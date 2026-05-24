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
}
