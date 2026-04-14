<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\Medicine;
use App\Models\Order;
use App\Traits\ShefaaTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CitizenController extends Controller
{
    use ShefaaTrait;

    public function getAllMedicines(Request $request)
    {
        $user = auth()->user();

        // جلب الأدوية مع معلومات الصيدلية والمحافظة
        $query = Medicine::with(['pharmacy.user'])
            ->where('expiration_date', '>', now()->toDateString())
            ->where('quantity_available', '>', 0);

        //دوا أو مستحضر
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // الفلترة الجغرافية الذكية:
        // إذا أرسل المستخدم محافظة معينة نفلتر بها، وإذا لم يرسل، نظهر له أدوية محافظته المسجلة افتراضياً
        $targetGovernorate = $request->governorate ?? ($user ? $user->governorate : null);

        if ($targetGovernorate) {
            // وظيفة str_replace('_', ' ', هي تبديل ال _ الى مسافة.... مثلا بالداتا بيز هيي saudi_arabia بتنعرض للمستخدم saudi arabia
            // strtolower وظيفتها تحويل الاحرف الى احرف صغيرة
            // ucwords تحويل اول حرف من كل كلمة الى capital
            $formattedGov = ucwords(strtolower(str_replace('_', ' ', $targetGovernorate)));

            $query->whereHas('pharmacy', function ($q) use ($formattedGov) {
                $q->where('governorate', $formattedGov);
            });
        }
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->has('pharmacy_id')) {
            $query->where('pharmacy_id', $request->pharmacy_id);
        }

        $medicines = $query->orderBy('expiration_date', 'asc')->get();

        // إذا كان هناك تصنيف محدد نختار اسمه، وإذا لم يوجد نسميها "Products"
        if (!$request->filled('category')) {
            $categoryLabel = 'Products';
        } else {
            $categoryLabel = $request->category === 'cosmetic' ? 'Cosmetics' : 'Medicines';
        }

        if ($medicines->isEmpty()) {
            return $this->SuccessResponse([], "No {$categoryLabel} found in " . ($targetGovernorate ?? 'your area'), 200);
        }

        return $this->SuccessResponse($medicines, "{$categoryLabel} fetched successfully", 200);
    }
}
