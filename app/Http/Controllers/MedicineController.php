<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use App\Models\Pharmacy;
use App\Traits\ShefaaTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MedicineController extends Controller
{
    public function addMedicine(Request $request)
    {
        $user = auth()->user();
        if (!$user || $user->role !== 'pharmacy') {
            return $this->ErrorResponse('Unauthorized. Only pharmacists can access this', 401);
        }

        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:png,jpg,jpeg|max:2048',
            'quantity_available' => 'required|integer|min:0',
            'expiration_date' => 'required|date|after:today',
            'description' => 'nullable|string',
            'category' => 'required|in:medicine,cosmetic',
        ]);

        if ($validation->fails()) {
            return $this->ErrorResponse($validation->errors(), 422);
        }

        // جلب بروفايل الصيدلية المرتبط بالمستخدم الحالي
        $pharmacy = Pharmacy::where('user_id', $user->id)->first();

        if (!$pharmacy) {
            return $this->ErrorResponse('No pharmacy profile found for this user', 404);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $folderName = ($request->category === 'cosmetic') ? 'cosmetics' : 'medicines';
            $path = $request->file('image')->store($folderName, 'public');
            $imagePath = asset('storage/' . $path);
        }

        $medicine = Medicine::create([
            'pharmacy_id' => $pharmacy->id,
            'name' => $request->name,
            'price' => $request->price,
            'image' => $imagePath,
            'quantity_available' => $request->quantity_available,
            'expiration_date' => $request->expiration_date,
            'description' => $request->description,
            'category' => $request->category,
        ]);

        return $this->SuccessResponse($medicine, 'Medicine added successfully to your inventory', 201);
    }
}
