<?php

namespace App\Http\Controllers;

     use App\Models\Coupon;
use App\Models\Medicine;
use App\Models\Order;
use App\Models\Pharmacy;
use App\Models\Review;
use App\Traits\ShefaaTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PharmacyController extends Controller
{
     use ShefaaTrait;

    public function getMyInventory(Request $request)
    {
        $user = auth()->user();
        if (!$user || $user->role !== 'pharmacy') {
            return $this->ErrorResponse('Unauthorized. Only pharmacies can access this', 401);
        }

        $pharmacy = Pharmacy::where('user_id', $user->id)->first();

        if (!$pharmacy) {
            return $this->ErrorResponse('Pharmacy profile not found', 404);
        }

        $query = Medicine::where('pharmacy_id', $pharmacy->id);

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // فلترة بالفئة
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $inventory = $query->select('id', 'name', 'price', 'category', 'quantity_available', 'requires_prescription')
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->SuccessResponse($inventory, 'Inventory fetched successfully', 200);
    }
    public function getPharmacyReviews()
    {
        $user = auth()->user();

        if (!$user || $user->role !== 'pharmacy') {
            return $this->ErrorResponse('Unauthorized. Only pharmacies can access this', 401);
        }

        $pharmacy = Pharmacy::where('user_id', $user->id)->first();

        if (!$pharmacy) {
            return $this->ErrorResponse('Pharmacy profile not found', 404);
        }

        $reviews = Review::with('user:id,username')
            ->where('pharmacy_id', $pharmacy->id)
            ->latest()
            ->get();

        if ($reviews->isEmpty()) {
            return $this->SuccessResponse([], 'No reviews found to you till now', 200);
        }

        return $this->SuccessResponse($reviews, 'Reviews fetched successfully', 200);
    }
 public function getMyOrders()
    {
        $user = auth()->user();

        if (!$user || $user->role !== 'pharmacy') {
            return $this->ErrorResponse('Unauthorized. Only pharmacies can access this', 401);
        }

        $pharmacy = Pharmacy::where('user_id', $user->id)->first();

        if (!$pharmacy) {
            return $this->ErrorResponse('Pharmacy profile not found', 404);
        }

        $orders = Order::with([
            'orderItems.medicine:id,name,image,price', // جلب بيانات الدواء الأساسية فقط
            'payment:id,order_id,payment_status,payment_method,amount',
            'user:id,username,phone'
        ])
            ->where('pharmacy_id', $pharmacy->id)
            ->whereIn('ph_approval_status', ['pending', 'approved'])
            ->whereNotIn('order_status', ['delivered', 'cancelled'])
            ->latest()
            ->get();

        if ($orders->isEmpty()) {
            return $this->SuccessResponse([], 'You havent any order till now', 200);
        }

        return $this->SuccessResponse($orders, 'Orders fetched successfully', 200);
    }

}
