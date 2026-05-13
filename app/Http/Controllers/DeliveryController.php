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
    public function rejectDelivery(Request $request)
    {
        $user = auth()->user();
        if (!$user || $user->role !== 'delivery') {
            return $this->ErrorResponse('Unauthorized. Only deliveries can access this', 401);
        }

        $delivery = Delivery::where('user_id', $user->id)->first();

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
            return $this->ErrorResponse('Order not found or cannot be rejected now', 404);
        }

        try {
            DB::transaction(function () use ($order, $delivery) {
                $order->update([
                    'delivery_id' => null,
                    'delivery_approval_status' => 'pending',
                ]);
                $delivery->update(['availability_status' => 1]);
            });

            $this->autoAssignDelivery($order, $user->id);

            return $this->SuccessResponse(null, 'Order rejected. Searching for another delivery person in the same area', 200);
        } catch (\Exception $e) {
            return $this->ErrorResponse('Error during rejection: ' . $e->getMessage(), 500);
        }
    }
    public function pickUpOrder(Request $request)
    {
        $user = auth()->user();

        if (!$user || $user->role !== 'delivery') {
            return $this->ErrorResponse('Unauthorized. Only deliveries can access this', 401);
        }

        $delivery = Delivery::where('user_id', $user->id)->first();

        $validation = Validator::make($request->all(), [
            'order_id' => 'required|integer|exists:orders,id'
        ]);

        if ($validation->fails()) {
            return $this->ErrorResponse($validation->errors(), 422);
        }

        $order = Order::with(['user', 'pharmacy.user', 'payment'])
            ->where('id', $request->order_id)
            ->where('delivery_id', $delivery->id)
            ->where('delivery_approval_status', 'accepted')
            ->where('order_status', 'in_process')
            ->first();

        if (!$order) {
            return $this->ErrorResponse('Order not ready for pickup', 400);
        }

        try {
            DB::transaction(function () use ($order) {
                $order->update(['order_status' => 'picked_up']);

                return $order;
            });

            return $this->SuccessResponse($order, 'Order picked up. On the way to customer', 200);
        } catch (\Exception $e) {
            return $this->ErrorResponse('Failed to update pickup status: ' . $e->getMessage(), 500);
        }
    }



    public function deliverOrder(Request $request)
    {
        $user = auth()->user();

        if (!$user || $user->role !== 'delivery') {
            return $this->ErrorResponse('Unauthorized. Only deliveries can access this', 401);
        }

        $delivery = Delivery::where('user_id', $user->id)->first();

        $validation = Validator::make($request->all(), [
            'order_id' => 'required|integer|exists:orders,id'
        ]);

        if ($validation->fails()) {
            return $this->ErrorResponse($validation->errors(), 422);
        }

        $order = Order::with(['user', 'pharmacy.user', 'payment'])
            ->where('id', $request->order_id)
            ->where('delivery_id', $delivery->id)
            ->where('order_status', 'picked_up')
            ->first();

        if (!$order) {
            return $this->ErrorResponse('Order not found or not picked up yet', 400);
        }

        try {
            DB::transaction(function () use ($order, $user) {
                $order->update(['order_status' => 'delivered']);

                if ($order->payment) {
                    $order->payment->update(['payment_status' => 'paid']);
                }

                Delivery::where('user_id', $user->id)->update(['availability_status' => 1]);

                // منطق الكوبون
                $this->checkAndGenerateLoyaltyCoupon($order->user_id, $order->pharmacy_id);

                return $order;
            });

            return $this->SuccessResponse(null, 'Delivery completed successfully', 200);
        } catch (\Exception $e) {
            return $this->ErrorResponse('Error: ' . $e->getMessage(), 500);
        }
    }
    public function updateAvailabilityStatus(Request $request)
    {
        $user = auth()->user();

        if (!$user || $user->role !== 'delivery') {
            return $this->ErrorResponse('Unauthorized. Only deliveries can access this', 401);
        }

        $validation = Validator::make($request->all(), [
            'availability_status' => 'required|boolean'
        ]);

        if ($validation->fails()) {
            return $this->ErrorResponse($validation->errors(), 422);
        }

        $delivery = Delivery::where('user_id', $user->id)->first();

        if ($request->availability_status == 0) {
            $hasActive = Order::where('delivery_id', $delivery->id)
                ->whereIn('order_status', ['in_process', 'picked_up'])
                ->exists();
            if ($hasActive) {
                return $this->ErrorResponse('Finish your active orders first', 400);
            }
        }

        $delivery->update([
            'availability_status' => $request->availability_status
        ]);

        return $this->SuccessResponse($delivery, 'Status updated successfully', 200);
    }

    public function getMyAssignedOrders()
    {
        $user = auth()->user();

        if (!$user || $user->role !== 'delivery') {
            return $this->ErrorResponse('Unauthorized. Only deliveries can access this', 401);
        }

        $delivery = Delivery::where('user_id', $user->id)->first();

        $myOrders = Order::with(['pharmacy.user', 'orderItems.medicine', 'payment'])
            ->where('delivery_id', $delivery->id)
            ->where('delivery_approval_status', 'assigned')
            ->latest()
            ->get();

        if ($myOrders->isEmpty()) {
            return $this->SuccessResponse([], 'No new orders assigned to you at the moment', 200);
        }

        return $this->SuccessResponse($myOrders, 'Assigned orders fetched', 200);
    }
    public function getOrderDetails(Request $request)
    {
        $user = auth()->user();

        if (!$user || $user->role !== 'delivery') {
            return $this->ErrorResponse('Unauthorized. Only deliveries can access this', 401);
        }

        $delivery = Delivery::where('user_id', $user->id)->first();

        $validation = Validator::make($request->all(), [
            'order_id' => 'required|integer|exists:orders,id'
        ]);

        if ($validation->fails()) {
            return $this->ErrorResponse($validation->errors(), 422);
        }

        $order = Order::with([
            'orderItems.medicine:id,name,price',
            'pharmacy.user:id,username,phone',
            'payment',
            'user:id,username,phone'
        ])
            ->where('id', $request->order_id)
            ->where('delivery_id', $delivery->id)
            ->first();

        if (!$order) {
            return $this->ErrorResponse('Unable to access order details. Ensure the order is assigned to you', 403);
        }
        return $this->SuccessResponse($order, 'Order details retrieved successfully', 200);
    }
}
