<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Auth\AuthController;
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
});