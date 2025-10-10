<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\AiToolController;
use App\Http\Controllers\API\PasswordResetController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\TwoFactorController;
use App\Http\Controllers\API\AdminController;

Route::get('/status', function () {
    return response()->json([
        'message' => 'Laravel API working ✅'
    ]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Password reset routes (public)
Route::post('/password/send-reset-link', [PasswordResetController::class, 'sendResetLink']);
Route::post('/password/reset', [PasswordResetController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Password change route (authenticated)
    Route::post('/password/change', [PasswordResetController::class, 'changePassword']);
    
    // AI Tools routes - public (no auth required)
    Route::get('/ai-tools/categories', [AiToolController::class, 'categories']);
    
    // AI Tools routes - available to all authenticated users
    Route::get('/ai-tools', [AiToolController::class, 'index']);
    Route::get('/ai-tools/{aiTool}', [AiToolController::class, 'show']);
    Route::get('/my-tools', [AiToolController::class, 'myTools']);
    
    // AI Tools management - only users with appropriate roles can create/edit
    Route::middleware('role:admin,frontend,backend,user')->group(function () {
        Route::post('/ai-tools', [AiToolController::class, 'store']);
        Route::put('/ai-tools/{aiTool}', [AiToolController::class, 'update']);
        Route::delete('/ai-tools/{aiTool}', [AiToolController::class, 'destroy']);
    });
    
    // Review routes
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::put('/reviews/{review}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);
    
    // Two-Factor Authentication routes
    Route::get('/two-factor/status', [TwoFactorController::class, 'status']);
    Route::post('/two-factor/generate-secret', [TwoFactorController::class, 'generateSecret']);
    Route::post('/two-factor/enable', [TwoFactorController::class, 'enable']);
    Route::post('/two-factor/disable', [TwoFactorController::class, 'disable']);
    Route::post('/two-factor/verify', [TwoFactorController::class, 'verify']);
    Route::post('/two-factor/regenerate-recovery-codes', [TwoFactorController::class, 'regenerateRecoveryCodes']);
    Route::post('/two-factor/verify-recovery-code', [TwoFactorController::class, 'verifyRecoveryCode']);
    
    // Admin routes - protected by role middleware
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::post('/users', [AdminController::class, 'createUser']);
        Route::put('/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::get('/reviews', [AdminController::class, 'reviews']);
        Route::post('/reviews/{id}/approve', [AdminController::class, 'approveReview']);
        Route::delete('/reviews/{id}/reject', [AdminController::class, 'rejectReview']);
        Route::get('/content', [AdminController::class, 'contentManagement']);
        Route::post('/content/tools/{id}/approve', [AdminController::class, 'approveTool']);
        Route::post('/content/tools/{id}/reject', [AdminController::class, 'rejectTool']);
    });
});