<?php

namespace App\Http\Controllers;

use App\Models\ExchangeAd;
use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use App\Traits\ShefaaTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    use ShefaaTrait;

    public function getDashboardStats()
    {
        $admin = auth()->user();
        if (!$admin || $admin->role !== 'admin') {
            return $this->ErrorResponse('Unauthorized. Only admins can access this', 401);
        }

        $stats = [
            'users_overview' => [
                'total' => User::count(),
                'citizens' => User::where('role', 'citizen')->count(),
                'pharmacies' => User::where('role', 'pharmacy')->count(),
                'specialists' => User::where('role', 'specialist')->count(),
                'delivery' => User::where('role', 'delivery')->count(),
                'inactive_users' => User::where('account_status', 0)->count(),
            ],
            'ads_stats' => [
                'total_ads' => ExchangeAd::count(),
                'published' => ExchangeAd::where('is_showing', 1)->count(),
                'pending_verification' => ExchangeAd::whereNull('security_check_status')->count(), // المعلقة
                'completed_exchanges' => ExchangeAd::where('is_showing', 0)->where('security_check_status', 1)->count(), // تم تسليمها
                'rejected_ads' => ExchangeAd::where('security_check_status', 0)->count(), // إعلانات مرفوضة لأسباب طبية
            ],
            'orders_stats' => [
                'total_orders' => Order::count(),
                'pending_orders' => Order::where('order_status', 'pending')->count(),
                'processing' => Order::whereIn('order_status', ['in_process', 'picked_up'])->count(),
                'completed_orders' => Order::where('order_status', 'delivered')->count(),
                'canceled_orders' => Order::where('order_status', 'canceled')->count(),
            ],
            'financial_overview' => [
                'total_paid_orders' => Payment::where('payment_status', 'paid')->count(),
                // تجميع الإيرادات حسب العملة
                'revenue_by_currency' => Payment::where('payment_status', 'paid')
                    // جمع قيم حقل ال amount التابعة للعملة الواحدة باسم مستعار وهو total
                    ->select('currency', DB::raw('SUM(amount) as total')) // DB لاستخدام دالة ال sum
                    // group by لمعرفة كل total لأي عملة تابع
                    ->groupBy('currency')
                    ->get(),
            ],
            'activity_by_governorate' => User::select('governorate', DB::raw('count(*) as count'))
                ->groupBy('governorate')
                ->orderBy('count', 'desc')
                ->get(),
        ];

        return $this->SuccessResponse($stats, 'Complete dashboard statistics fetched successfully', 200);
    }
public function getUsersByRole(Request $request)
    {
        $admin = auth()->user();
        if (!$admin || $admin->role !== 'admin') {
            return $this->ErrorResponse('Unauthorized. Only admins can access this', 401);
        }

        $validation = Validator::make($request->all(), [
            'role' => 'required|in:citizen,pharmacy,specialist,delivery,admin'
        ]);

        if ($validation->fails()) {
            return $this->ErrorResponse($validation->errors(), 422);
        }

        $role = $request->role;

        // جلب المستخدمين مع فحص وجود العلاقة
        $query = User::where('role', $role);

        // للتحقق من انها توجد علاقة في مودل User
        if (method_exists(User::class, $role)) {
            $query->with($role);
        }

        $users = $query->latest()->get();

        if ($users->isEmpty()) {
            return $this->SuccessResponse([], "No {$role} users found till now", 200);
        }

        return $this->SuccessResponse($users, "All {$role} users fetched successfully", 200);
    }

}