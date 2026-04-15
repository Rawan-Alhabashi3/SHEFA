<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\Medicine;
use App\Models\Order;
use App\Traits\ShefaaTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CitizenController extends Controller
{
    use ShefaaTrait;

    public function getAllMedicines(Request $request)
    {
        $user = auth()->user();

        // جلب الأدوية مع معلومات الصيدلية والمحافظة
        $query = Medicine::with(['pharmacy.user'])
            ->where('expiration_date', '>', now()->toDateString())
            ->where('quantity_available', '>', 0);

        //دوا أو مستحضر
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // الفلترة الجغرافية الذكية:
        // إذا أرسل المستخدم محافظة معينة نفلتر بها، وإذا لم يرسل، نظهر له أدوية محافظته المسجلة افتراضياً
        $targetGovernorate = $request->governorate ?? ($user ? $user->governorate : null);

        if ($targetGovernorate) {
            // وظيفة str_replace('_', ' ', هي تبديل ال _ الى مسافة.... مثلا بالداتا بيز هيي saudi_arabia بتنعرض للمستخدم saudi arabia
            // strtolower وظيفتها تحويل الاحرف الى احرف صغيرة
            // ucwords تحويل اول حرف من كل كلمة الى capital
            $formattedGov = ucwords(strtolower(str_replace('_', ' ', $targetGovernorate)));

            $query->whereHas('pharmacy', function ($q) use ($formattedGov) {
                $q->where('governorate', $formattedGov);
            });
        }
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->has('pharmacy_id')) {
            $query->where('pharmacy_id', $request->pharmacy_id);
        }

        $medicines = $query->orderBy('expiration_date', 'asc')->get();

        // إذا كان هناك تصنيف محدد نختار اسمه، وإذا لم يوجد نسميها "Products"
        if (!$request->filled('category')) {
            $categoryLabel = 'Products';
        } else {
            $categoryLabel = $request->category === 'cosmetic' ? 'Cosmetics' : 'Medicines';
        }

        if ($medicines->isEmpty()) {
            return $this->SuccessResponse([], "No {$categoryLabel} found in " . ($targetGovernorate ?? 'your area'), 200);
        }

        return $this->SuccessResponse($medicines, "{$categoryLabel} fetched successfully", 200);
    }
    public function createOrderForPharmacist(Request $request)
    {
        $user = auth()->user();
        if (!$user || $user->role !== 'citizen') {
            return $this->ErrorResponse('Unauthorized. Only citizens can access this', 401);
        }

        if ($request->has('governorate')) {
            $request->merge(['governorate' => ucwords(strtolower($request->governorate))]);
        }

        $validation = Validator::make($request->all(), [
            'pharmacy_id' => 'required|integer|exists:pharmacies,id',
            'customer_name' => 'required|string|max:255',
            'phone_number' => 'required|string',
            'address' => 'required|string',
            'governorate' => 'required|in:Damascus,Aleppo,Homs,Hama,Lattakia,Tartous,Daraa,Deir ez-Zor,Hasakah,Raqqa,Suwayda,Quneitra,Rif Dimashq',
            'payment_method' => 'required|in:electronic,cash',
            'coupon_code' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.medicine_id' => 'required|integer|exists:medicines,id',
            'items.*.desired_quantity' => 'required|integer|min:1',
        ]);

        if ($validation->fails()) {
            return $this->ErrorResponse($validation->errors(), 422);
        }

        $coupon = null;
        if ($request->filled('coupon_code')) {
            $coupon = Coupon::where('code', $request->coupon_code)
                ->where('user_id', $user->id)
                ->where('pharmacy_id', $request->pharmacy_id)
                ->where('is_used', false)
                ->where('valid_until', '>', now())
                ->first();

            if (!$coupon) {
                return $this->ErrorResponse('Invalid or expired coupon for this pharmacy.', 422);
            }
        }

        try {
            $data = DB::transaction(function () use ($user, $request, $coupon) {

                $cosmeticsSubtotal = 0;
                $medicinesSubtotal = 0;
                $itemsToCreate = [];

                foreach ($request->items as $itemData) {
                    // lockForUpdate: وظيفتها حجز الدواء حتى انتهاء ال transaction الحالية
                    $medicine = Medicine::lockForUpdate()->find($itemData['medicine_id']);

                    if ($medicine->quantity_available < $itemData['desired_quantity']) {
                        throw new \Exception("Insufficient stock for: {$medicine->name}");
                    }

                    $itemTotalPrice = $medicine->price * $itemData['desired_quantity'];

                    if ($medicine->category === 'cosmetic') {
                        $cosmeticsSubtotal += $itemTotalPrice;   //4000
                    } else {
                        $medicinesSubtotal += $itemTotalPrice;
                    }

                    // تجهيز البيانات لإنشائها لاحقاً
                    $itemsToCreate[] = [
                        'medicine_id' => $medicine->id,
                        'desired_quantity' => $itemData['desired_quantity'],
                        'total_price' => $itemTotalPrice,
                        'medicine_model' => $medicine // نحتفظ بالمودل لنخصم منه لاحقاً
                    ];
                }

                $discountValue = 0;
                if ($coupon && $cosmeticsSubtotal > 0) {
                    $discountValue = ($cosmeticsSubtotal * $coupon->discount_percentage / 100);
                }

                $finalOrderTotal = ($cosmeticsSubtotal + $medicinesSubtotal) - $discountValue;

                $newOrder = Order::create([
                    'user_id' => $user->id,
                    'pharmacy_id' => $request->pharmacy_id,
                    'customer_name' => $request->customer_name,
                    'phone_number' => $request->phone_number,
                    'address' => $request->address,
                    'governorate' => $request->governorate,
                    'coupon_code' => $request->coupon_code,
                    'total_price' => $finalOrderTotal,
                    'ph_approval_status' => 'pending',
                    'order_status' => 'pending',
                    'delivery_approval_status' => 'pending'
                ]);

                // إنشاء العناصر وخصم الكمية
                foreach ($itemsToCreate as $item) {
                    $newOrder->orderItems()->create([
                        'medicine_id' => $item['medicine_id'],
                        'desired_quantity' => $item['desired_quantity'],
                        'total_price' => $item['total_price']
                    ]);

                    $item['medicine_model']->decrement('quantity_available', $item['desired_quantity']);
                }

                // إنشاء الدفع
                $payment = $newOrder->payment()->create([
                    'payment_method' => $request->payment_method,
                    'amount' => $finalOrderTotal,
                    'payment_status' => 'pending'
                ]);

                if ($coupon) {
                    $coupon->update(['is_used' => true]);
                }
                return [
                    'order' => $newOrder->load('orderItems.medicine'),
                    'payment_details' => $payment,
                    'discount_amount' => $discountValue
                ];
            });

            return $this->SuccessResponse([
                'order' => $data['order'],
                'payment_details' => $data['payment_details'],
                'savings' => $data['discount_amount']
            ], 'Order placed successfully.', 201);
        } catch (\Exception $e) {
            return $this->ErrorResponse('Process failed: ' . $e->getMessage(), 500);
        }
    }
    public function cancelOrder(Request $request)
    {
        $user = auth()->user();

        if (!$user || $user->role !== 'citizen') {
            return $this->ErrorResponse('Unauthorized. Only citizens can access this', 401);
        }

        $validation = Validator::make($request->all(), [
            'order_id' => 'required|integer|exists:orders,id'
        ]);

        if ($validation->fails()) {
            return $this->ErrorResponse($validation->errors()->first(), 422);
        }

        $order = Order::with(['orderItems', 'payment'])
            ->where('id', $request->order_id)
            ->where('user_id', $user->id)
            ->first();

        if (!$order) {
            return $this->ErrorResponse('This order could not be found.', 404);
        }

        if ($order->ph_approval_status !== 'pending' || $order->order_status !== 'pending') {
            return $this->ErrorResponse('Cannot cancel: Order is already processed.', 400);
        }

        try {
            DB::transaction(function () use ($order, $user) {
                // إعادة الكميات للمخزن
                foreach ($order->orderItems as $item) {
                    Medicine::where('id', $item->medicine_id)
                        ->increment('quantity_available', $item->desired_quantity);
                }

                // تحديث حالة الطلب
                $order->update(['order_status' => 'cancelled']);

                if ($order->coupon_code) {
                    Coupon::where('code', $order->coupon_code)
                        ->where('user_id', $user->id)
                        ->where('pharmacy_id', $order->pharmacy_id)
                        ->update(['is_used' => false]);
                }

                // تحديث حالة الدفع إن وجدت
                if ($order->payment) {
                    $newStatus = ($order->payment->payment_method === 'electronic') ? 'failed' : 'failed';
                    $order->payment->update(['payment_status' => $newStatus]);
                }
            });

            return $this->SuccessResponse(null, 'Order cancelled and coupon returned.', 200);
        } catch (\Exception $e) {
            return $this->ErrorResponse('An error occurred during cancellation', 500);
        }
    }
    public function getMyOrderHistory(Request $request)
    {
        $user = auth()->user();

        if (!$user || $user->role !== 'citizen') {
            return $this->ErrorResponse('Unauthorized. Only citizens can access this', 401);
        }

        $validation = Validator::make($request->all(), [
            'status' => 'nullable|string|in:pending,in_process,picked_up,delivered,cancelled'
        ]);

        if ($validation->fails()) {
            return $this->ErrorResponse($validation->errors(), 422);
        }

        // جلب الطلبات مع العلاقات الأساسية
        $query = Order::with(['orderItems.medicine', 'pharmacy.user', 'payment'])
            ->where('user_id', $user->id)
            ->latest();

        if ($request->filled('status')) {
            $query->where('order_status', $request->status);
        }

        $orders = $query->get();

        if ($orders->isEmpty()) {
            return $this->SuccessResponse([], 'You haven\'t placed any orders yet.', 200);
        }

        $formattedHistory = [
            'active_orders' => $orders->whereIn('order_status', ['pending', 'in_process', 'picked_up'])->values(),
            'past_orders'   => $orders->whereIn('order_status', ['delivered', 'cancelled'])->values(),
        ];

        return $this->SuccessResponse($formattedHistory, 'Order history retrieved successfully.', 200);
    }
}
