<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;

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

// Auth routes
Route::prefix('auth')->group(function () {
    // Public route - no authentication required
    Route::post('login', [AuthController::class, 'login']);
    
    // Protected routes - require authentication
    Route::middleware('auth:api')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('me', [AuthController::class, 'me']);
    });
});

// Product routes - Protected by JWT authentication
Route::middleware('auth:api')->group(function () {
    // Authenticated users can view products
    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{id}', [ProductController::class, 'show']);
    
    // Admin-only routes for managing products
    Route::middleware('admin')->group(function () {
        Route::post('products', [ProductController::class, 'store']);
        Route::put('products/{id}', [ProductController::class, 'update']);
        Route::delete('products/{id}', [ProductController::class, 'destroy']);
    });
});

