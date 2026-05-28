<?php

use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\CitizenController;
use App\Http\Controllers\DeliveryController;
use App\Http\Controllers\ExchangeAdController;
use App\Http\Controllers\PharmacyController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SpecialistController;
use Illuminate\Support\Facades\Route;






/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::controller(AuthController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::get('/get-my-profile', 'getMyProfile')->middleware('auth:sanctum');
    Route::post('/update-my-profile', 'updateMyProfile')->middleware('auth:sanctum');
});
Route::controller(AdminController::class)->middleware('auth:sanctum')->group(function () {
    Route::get('/get-dashboard-stats', 'getDashboardStats');
    Route::post('/get-users-by-role', 'getUsersByRole');
    Route::post('/toggle-user-status', 'toggleUserStatus');
    Route::get('/manage-exchange-ads', 'manageExchangeAds');
    Route::post('/search-user', 'searchUser');
    Route::post('/search-medicine-in-ads', 'searchMedicineInAds');
    Route::post('/add-user', 'addUser');
    Route::post('/delete-user', 'deleteUser');
});
Route::controller(CitizenController::class)->group(function () {
    Route::post('/get-all-medicines', 'getAllMedicines');
    Route::post('/create-order-for-pharmacist', 'createOrderForPharmacist')->middleware('auth:sanctum');
    Route::post('/cancel-order', 'cancelOrder')->middleware('auth:sanctum');
    Route::post('/get-my-order-history', 'getMyOrderHistory')->middleware('auth:sanctum');
    Route::post('/create-my-medicine-favorite', 'toggleFavorite')->middleware('auth:sanctum'); 
    Route::get('/get-my-coupons', 'getMyCoupons')->middleware('auth:sanctum'); 
    Route::get('/get-my-favorites', 'getMyFavorites')->middleware('auth:sanctum');

    });
    Route::controller(MedicineController::class)->group(function () {
    Route::post('/add-medicine', 'addMedicine')->middleware('auth:sanctum');
    Route::post('/update-medicine', 'updateMedicine')->middleware('auth:sanctum');
    Route::post('/delete-medicine', 'deleteMedicine')->middleware('auth:sanctum');
    });
    Route::controller(PharmacyController::class)->group(function () {
    Route::get('/get-my-orders', 'getMyOrders')->middleware('auth:sanctum');
    Route::post('/accept-order', 'acceptOrder')->middleware('auth:sanctum');
    Route::post('/reject-order', 'rejectOrder')->middleware('auth:sanctum');
    });
    Route::controller(ReviewController::class)->group(function () {
    Route::post('/add-review', 'addReview')->middleware('auth:sanctum');
     Route::post('/delete-review', 'deleteReview')->middleware('auth:sanctum');
    });
    Route::controller(DeliveryController::class)->group(function () {
    Route::post('/accept-delivery', 'acceptDelivery')->middleware('auth:sanctum');
    Route::post('/reject-delivery', 'rejectDelivery')->middleware('auth:sanctum');
    Route::post('/pick-up-order', 'pickUpOrder')->middleware('auth:sanctum');
    Route::post('/deliver-order', 'deliverOrder')->middleware('auth:sanctum');
    Route::post('/get-order-details', 'getOrderDetails')->middleware('auth:sanctum');
    Route::post('/update-availability-status', 'updateAvailabilityStatus')->middleware('auth:sanctum');
    Route::get('/get-my-assigned-orders', 'getMyAssignedOrders')->middleware('auth:sanctum');
    });
