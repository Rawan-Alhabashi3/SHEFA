<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use App\Models\Order;
use App\Traits\ShefaaTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DeliveryController extends Controller
{
    use ShefaaTrait;

    public function acceptDelivery(Request $request)
    {
        $user = auth()->user();
        if (!$user || $user->role !== 'delivery') {
            return $this->ErrorResponse('Unauthorized. Only deliveries can access this', 401);
        }

        $delivery = Delivery::where('user_id', $user->id)->first();

        // المستخدم غير موجود او حالته مشغول
        if (!$delivery || $delivery->availability_status == 0) {
            return $this->ErrorResponse('You are currently unavailable or have another active order', 400);
        }

        $validation = Validator::make($request->all(), [
            'order_id' => 'required|integer|exists:orders,id'
        ]);

        if ($validation->fails()) {
            return $this->ErrorResponse($validation->errors(), 422);
        }

        $order = Order::where('id', $request->order_id)
            ->where('delivery_id', $delivery->id)
            ->where('delivery_approval_status', 'assigned')
            ->first();

        if (!$order) {
            return $this->ErrorResponse('Order not found or not assigned to you', 404);
        }

        try {
            DB::transaction(function () use ($order, $delivery) {
                // تحديث حالة الطلب والمندوب
                $order->update([
                    'delivery_approval_status' => 'accepted',
                    'order_status' => 'in_process'
                ]);

                $delivery->update(['availability_status' => 0]);
            });

            return $this->SuccessResponse($order->load(['user', 'pharmacy']), 'Order accepted. Please pick it up from the pharmacy', 200);
        } catch (\Exception $e) {
            return $this->ErrorResponse('Failed to accept order: ' . $e->getMessage(), 500);
        }
    }
}