<?php

namespace App\Http\Controllers;
use App\Models\ExchangeAd;
use App\Models\Specialist;
use App\Traits\ShefaaTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;



class SpecialistController extends Controller
{
    use ShefaaTrait;
    public function getMyPendingAds()
    {
        $user = auth()->user();

        $isRoleSpecialist = ($user->role === 'specialist');
        $isPharmacistSpecialist = ($user->role === 'pharmacy' && $user->pharmacy && $user->pharmacy->is_specialist == 1);

        if (! $user || ! ($isRoleSpecialist || $isPharmacistSpecialist)) {
            return $this->ErrorResponse('Unauthorized. This page is restricted to specialists only', 401);
        }

        $specialist = Specialist::where('user_id', $user->id)->first();

        if (! $specialist) {
            return $this->ErrorResponse('Specialist profile not found for your account', 404);
        }

        $pendingAds = ExchangeAd::with('user:id,username,phone')
            ->where('security_check_status', null)
            ->where('specialist_id', $specialist->id)
            ->latest()
            ->get();

        if ($pendingAds->isEmpty()) {
            return $this->SuccessResponse([], 'No pending ads awaiting your verification at the moment', 200);
        }

        $formattedAds = $pendingAds->map(function ($ad) {
            return [
                'id' => $ad->id,
                'medicine_name' => $ad->medicine_name,
                'image' => $ad->image,
                'price' => $ad->price == 0 ? 'donation' : $ad->price,
                'ad_type' => $ad->ad_type,
                'notes' => $ad->notes,
                'posted_by' => $ad->user->username,
                'contact_phone' => $ad->user->phone,
                'created_at' => $ad->created_at->diffForHumans(),
            ];
        });

        return $this->SuccessResponse($formattedAds, 'Pending ads fetched successfully', 200);
    }
    public function verifyAd(Request $request)
    {
        $user = auth()->user();

        $isRoleSpecialist = ($user->role === 'specialist');
        $isPharmacistSpecialist = ($user->role === 'pharmacy' && $user->pharmacy && $user->pharmacy->is_specialist == 1);

        if (! $isRoleSpecialist && ! $isPharmacistSpecialist) {
            return $this->ErrorResponse('Unauthorized. Only specialists or verified pharmacies can perform this action', 401);
        }

        $validation = Validator::make($request->all(), [
            'ad_id' => 'required|integer|exists:exchange_ads,id',
            'status' => 'required|boolean',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validation->fails()) {
            return $this->ErrorResponse($validation->errors(), 422);
        }

        $specialist = Specialist::where('user_id', $user->id)->first();

        if (! $specialist) {
            return $this->ErrorResponse('Specialist profile not found for your account', 404);
        }

        $ad = ExchangeAd::where('id', $request->ad_id)
            ->where('specialist_id', $specialist->id)
            ->first();

        if (! $ad) {
            return $this->ErrorResponse('Ad not found or not assigned to you for verification', 404);
        }

        if ($ad->security_check_status !== null) {
            return $this->ErrorResponse('This ad has already been processed', 400);
        }

        try {
            DB::transaction(function () use ($ad, $request) {
                $ad->update([
                    'security_check_status' => $request->status ? 1 : 0,
                    'notes' => $request->notes ?? ($request->status ? 'Approved by Authorized Specialist' : 'Rejected for safety/quality reasons'),
                    'is_showing' => $request->status ? 1 : 0,
                ]);
            });

            $statusMessage = $request->status ? 'verified and published' : 'rejected';

            return $this->SuccessResponse($ad, "Ad has been {$statusMessage} successfully", 200);
        } catch (\Exception $e) {
            return $this->ErrorResponse('An error occurred while processing the ad: '.$e->getMessage(), 500);
        }
    }
public function markAdAsTaken(Request $request)
    {
        $user = auth()->user();

        $isRoleSpecialist = ($user->role === 'specialist');
        $isPharmacistSpecialist = ($user->role === 'pharmacy' && $user->pharmacy && $user->pharmacy->is_specialist == 1);

        if (! $user || ! ($isRoleSpecialist || $isPharmacistSpecialist)) {
            return $this->ErrorResponse('Unauthorized. This action is restricted to authorized specialists only', 401);
        }

        $specialist = Specialist::where('user_id', $user->id)->first();

        if (! $specialist) {
            return $this->ErrorResponse('Specialist profile not found for your account', 404);
        }

        $validation = Validator::make($request->all(), [
            'ad_id' => 'required|integer|exists:exchange_ads,id',
        ]);

        if ($validation->fails()) {
            return $this->ErrorResponse($validation->errors(), 422);
        }

        $ad = ExchangeAd::where('id', $request->ad_id)
            ->where('specialist_id', $specialist->id)
            ->where('security_check_status', 1)
            ->first();

        if (! $ad) {
            return $this->ErrorResponse('Ad not found, not verified yet, or not assigned to you', 404);
        }

        if ($ad->is_showing === 0) {
            return $this->ErrorResponse('This medicine is already marked as taken and is currently hidden', 400);
        }

        $ad->update([
            'is_showing' => 0,
        ]);

        return $this->SuccessResponse($ad, 'Medicine marked as taken successfully; ad is now hidden from public view', 200);
    }
public function getMyActionHistory()
    {
        $user = auth()->user();

        $isRoleSpecialist = ($user->role === 'specialist');
        $isPharmacistSpecialist = ($user->role === 'pharmacy' && $user->pharmacy && $user->pharmacy->is_specialist == 1);

        if (! $user || ! ($isRoleSpecialist || $isPharmacistSpecialist)) {
            return $this->ErrorResponse('Unauthorized. This page is restricted to authorized specialists only', 401);
        }

        $specialist = Specialist::where('user_id', $user->id)->first();

        if (! $specialist) {
            return $this->ErrorResponse('Specialist profile not found for your account', 404);
        }

        $history = ExchangeAd::with('user:id,username,phone')
            ->where('specialist_id', $specialist->id)
            ->whereNotNull('security_check_status')
            ->latest()
            ->get();

        if ($history->isEmpty()) {
            return $this->SuccessResponse([], 'Your action history is currently empty', 200);
        }

        $formattedHistory = $history->map(function ($ad) {
            return [
                'id' => $ad->id,
                'medicine_name' => $ad->medicine_name,
                'image' => $ad->image,
                'ad_type' => $ad->ad_type,
                'owner_name' => $ad->user->username,
                'owner_phone' => $ad->user->phone,
                'verification_status' => $ad->security_check_status ? 'Approved' : 'Rejected',
                'delivery_status' => $ad->is_showing === 0 && $ad->security_check_status == 1 ? 'Handed Over' : 'Available',
                'specialist_notes' => $ad->notes,
                'action_date' => $ad->updated_at->diffForHumans(),
            ];
        });

        return $this->SuccessResponse($formattedHistory, 'Action history fetched successfully', 200);
    }
}


