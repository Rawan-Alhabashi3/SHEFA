<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Pharmacy;
use App\Models\Review;
use App\Traits\ShefaaTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class ReviewController extends Controller
{
     use ShefaaTrait;

    public function addReview(Request $request)
    {
        $user = auth()->user();

        if (!$user || $user->role !== 'citizen') {
            return $this->ErrorResponse('Unauthorized. Only citizens can access this', 401);
        }

        $validation = Validator::make($request->all(), [
            'pharmacy_id' => 'required|integer|exists:pharmacies,id',
            'rate' => 'nullable|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        if ($validation->fails()) {
            return $this->ErrorResponse($validation->errors(), 422);
        }

        $pharmacy = Pharmacy::find($request->pharmacy_id);

        if (!$pharmacy) {
            return $this->ErrorResponse('Pharmacy not found', 404);
        }

        // التحقق من أن المواطن قد اشترى فعلاً من هذه الصيدلية (لضمان المصداقية)
        $hasOrdered = Order::where('user_id', $user->id)
            ->where('pharmacy_id', $request->pharmacy_id)
            ->where('order_status', 'delivered')
            ->exists();

        if (!$hasOrdered) {
            return $this->ErrorResponse('You can only review pharmacies you have ordered from.', 403);
        }

        try {
            $result = DB::transaction(function () use ($user, $request) {
                $newReview = Review::create([
                    'pharmacy_id' => $request->pharmacy_id,
                    'user_id'     => $user->id,
                    'rate'        => $request->rate,
                    'comment'     => $request->comment
                ]);

                return $newReview;
            });

            return $this->SuccessResponse($result, 'Thank you! Your review has been submitted', 201);
        } catch (\Exception $e) {
            return $this->ErrorResponse('Failed to add review: ' . $e->getMessage(), 500);
        }
        }
 public function deleteReview(Request $request)
    {
        $user = auth()->user();

        if (!$user || $user->role !== 'citizen') {
            return $this->ErrorResponse('Unauthorized. Only citizens can access this', 401);
        }

        $validation = Validator::make($request->all(), [
            'review_id' => 'required|integer|exists:reviews,id',
        ]);

        if ($validation->fails()) {
            return $this->ErrorResponse($validation->errors(), 422);
        }

        $checkReview = Review::where('id', $request->review_id)
            ->where('user_id', $user->id)
            ->first();

        if (!$checkReview) {
            return $this->ErrorResponse('Review not found or does not belong to you', 404);
        }

        $checkReview->delete();
        return $this->SuccessResponse(null, 'Review deleted successfully', 200);
    }
}


