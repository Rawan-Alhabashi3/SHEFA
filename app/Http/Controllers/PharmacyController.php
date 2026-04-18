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

        $inventory = $query->orderBy('created_at', 'desc')->get();

        return $this->SuccessResponse($inventory, 'Inventory fetched successfully', 200);
    }
}
