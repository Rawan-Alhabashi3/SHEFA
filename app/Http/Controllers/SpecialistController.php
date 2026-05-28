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
    
}
