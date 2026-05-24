<?php

namespace App\Http\Controllers;
use App\Models\ExchangeAd;
use App\Models\Specialist;
use App\Models\User;
use App\Traits\ShefaaTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;



class ExchangedAdController extends Controller
{
    use ShefaaTrait;

    public function createAd(Request $request)
    {
        $user = auth()->user();

        if (! $user || $user->role !== 'citizen') {
            return $this->ErrorResponse('Unauthorized. Only citizens can add exchange ads.', 401);
        }

        $validation = Validator::make($request->all(), [
            'medicine_name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:png,jpg,jpeg|max:2048',
            'price' => 'required_if:ad_type,sale|nullable|numeric|min:0',
            'ad_type' => 'required|in:donation,sale',
            'notes' => 'nullable|string',
            'governorate' => 'required|in:Damascus,Aleppo,Homs,Hama,Lattakia,Tartous,Daraa,Deir ez-Zor,Hasakah,Raqqa,Suwayda,Quneitra,Rif Dimashq',
        ]);

        if ($validation->fails()) {
            return $this->ErrorResponse($validation->errors(), 422);
        }

        $potentialSpecialistUserIds = User::where('governorate', $request->governorate)
            ->where('account_status', 1)
            ->where(function ($query) {
                $query->where('role', 'specialist')
                    ->orWhere(function ($q) {
                        $q->where('role', 'pharmacy')
                            ->whereHas('pharmacy', function ($ph) {
                                $ph->where('is_specialist', 1);
                            });
                    });
            })
            ->pluck('id');

        if ($potentialSpecialistUserIds->isEmpty()) {
            return $this->ErrorResponse('Sorry, there is no specialist or verified pharmacy available in your governorate at the moment to verify the medicine.', 404);
        }

        $selectedUserId = $potentialSpecialistUserIds->random();
        $selectedUser = User::with(['pharmacy', 'specialist'])->find($selectedUserId);

        $name = ($selectedUser->role === 'pharmacy' && $selectedUser->pharmacy)
                ? $selectedUser->pharmacy->pharmacy_name
                : ($selectedUser->specialist->pharmacy_name ?? $selectedUser->username);

        $address = ($selectedUser->role === 'pharmacy' && $selectedUser->pharmacy)
                   ? $selectedUser->pharmacy->pharmacy_address
                   : ($selectedUser->specialist->pharmacy_address ?? $selectedUser->governorate);

        $specialist = Specialist::firstOrCreate(
            ['user_id' => $selectedUserId],
            [
                'governorate' => $selectedUser->governorate,
                'pharmacy_name' => $name,
                'pharmacy_address' => $address,
            ]
        );

        $finalPrice = ($request->ad_type === 'donation') ? 0 : $request->price;

        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('exchangeAds', 'public');
            $imagePath = asset('storage/'.$path);
        }

        try {
            $ad = DB::transaction(function () use ($user, $specialist, $request, $imagePath, $finalPrice) {
                return ExchangeAd::create([
                    'user_id' => $user->id,
                    'specialist_id' => $specialist->id,
                    'governorate' => $request->governorate,
                    'medicine_name' => $request->medicine_name,
                    'image' => $imagePath,
                    'price' => $finalPrice,
                    'ad_type' => $request->ad_type,
                    'security_check_status' => null,
                    'is_showing' => null,
                    'notes' => $request->notes,
                ]);
            });

            return $this->SuccessResponse(
                $ad,
                'Ad submitted successfully. Please wait for the specialist to review and verify the medicine safety.',
                201
            );
        } catch (\Exception $e) {
            return $this->ErrorResponse('Failed to submit the ad: '.$e->getMessage(), 500);
        }
    }
    public function getAllMyAds()
    {
        $user = auth()->user();

        if (! $user || $user->role !== 'citizen') {
            return $this->ErrorResponse('Unauthorized. Only citizens can access this.', 401);
        }

        $myAds = ExchangeAd::with(['specialist.user.pharmacy'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        if ($myAds->isEmpty()) {
            return $this->SuccessResponse([], 'No ads found for you.', 200);
        }

        $formattedAds = $myAds->map(function ($ad) {
            $specialistRecord = $ad->specialist;
            $userRecord = $specialistRecord->user;

            $isPharmacy = ($userRecord->role === 'pharmacy' && $userRecord->pharmacy);

            return [
                'id' => $ad->id,
                'medicine_name' => $ad->medicine_name,
                'image' => $ad->image,
                'price' => $ad->price,
                'ad_type' => $ad->ad_type,
                'status' => is_null($ad->security_check_status) ? 'pending' : ($ad->security_check_status ? 'verified' : 'rejected'),
                'availability' => $ad->is_showing === 1 ? 'available' : 'taken/hidden',

                'specialist_at' => $isPharmacy
                    ? $userRecord->pharmacy->pharmacy_name
                    : ($specialistRecord->pharmacy_name ?? $userRecord->username),

                'location' => $isPharmacy
                    ? $userRecord->pharmacy->pharmacy_address
                    : ($specialistRecord->pharmacy_address ?? $ad->governorate),

                'created_at' => $ad->created_at->diffForHumans(),
            ];
        });

        return $this->SuccessResponse($formattedAds, 'Your ads history fetched successfully.', 200);
    }

    public function getAllConfirmAds(Request $request)
    {
        $query = ExchangeAd::with(['specialist.user.pharmacy'])
            ->where('security_check_status', true)
            ->where('is_showing', 1)
            ->latest();

        $governorate = $request->governorate ?? (auth()->user() ? auth()->user()->governorate : null);

        if ($governorate) {
            $query->where('governorate', $governorate);
        }

        if ($request->filled('medicine_name')) {
            $query->where('medicine_name', 'like', '%'.$request->medicine_name.'%');
        }

        if ($request->filled('ad_type')) {
            $query->where('ad_type', $request->ad_type);
        }

        $ads = $query->get();

        if ($ads->isEmpty()) {
            return $this->SuccessResponse([], 'No confirmed medicine ads found in '.($governorate ?? 'this area'), 200);
        }

        $formattedAds = $ads->map(function ($ad) {
            $specialistRecord = $ad->specialist;
            $userRecord = $specialistRecord->user;

            $isPharmacy = ($userRecord->role === 'pharmacy' && $userRecord->pharmacy);

            return [
                'id' => $ad->id,
                'medicine_name' => $ad->medicine_name,
                'image' => $ad->image,
                'price' => $ad->price == 0 ? 'Free (Donation)' : $ad->price,
                'ad_type' => $ad->ad_type,
                'governorate' => $ad->governorate,
                'notes' => $ad->notes,
                'verification' => 'Verified by authorized specialist',

                'collect_from' => $isPharmacy ? $userRecord->pharmacy->pharmacy_name : ($specialistRecord->pharmacy_name ?? $userRecord->username),

                'address' => $isPharmacy ? $userRecord->pharmacy->pharmacy_address : ($specialistRecord->pharmacy_address ?? $ad->governorate),

                'availability' => $ad->is_showing === 1 ? 'Available' : 'Taken',
                'posted_at' => $ad->created_at->diffForHumans(),
            ];
        });

        return $this->SuccessResponse($formattedAds, 'Confirmed medicine ads fetched successfully.', 200);
    }
    public function deletePendingAd(Request $request)
    {
        $user = auth()->user();

        if (! $user || $user->role !== 'citizen') {
            return $this->ErrorResponse('Unauthorized. Only citizens can access this.', 401);
        }

        $validation = Validator::make($request->all(), [
            'ad_id' => 'required|integer|exists:exchange_ads,id',
        ]);

        if ($validation->fails()) {
            return $this->ErrorResponse($validation->errors(), 422);
        }

        $ad = ExchangeAd::where('id', $request->ad_id)
            ->where('user_id', $user->id)
            ->first();

        if (! $ad) {
            return $this->ErrorResponse('Ad not found.', 404);
        }

        if ($ad->security_check_status !== null) {
            return $this->ErrorResponse('Cannot delete an ad that has already been processed.', 400);
        }

        if ($ad->image) {
            $path = str_replace(asset('storage/'), '', $ad->image);
            Storage::disk('public')->delete($path);
        }

        $ad->delete();

        return $this->SuccessResponse(null, 'Ad deleted successfully.', 200);
    }
}
