<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\DeliveryController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\FeedbackController;

Route::get('/', fn () => response()->json([
    'name' => 'CleanFlow Laundry OS API',
    'status' => 'online',
    'frontend' => env('FRONTEND_URL', 'http://127.0.0.1:5173'),
    'version' => '1.0.0',
]));

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [PasswordResetController::class, 'sendLink']);
Route::post('/auth/reset-password', [PasswordResetController::class, 'reset']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/feedback', [FeedbackController::class, 'publicIndex']);
Route::post('/feedback', [FeedbackController::class, 'store'])->middleware('throttle:10,1');
Route::post('/payments/webhook', [PaymentController::class, 'webhook'])->middleware('throttle:60,1');
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/profile/password', [AuthController::class, 'changePassword']);
    Route::apiResource('services', ServiceController::class)->except('index','show')->middleware('role:admin');
    Route::get('/services/{service}', [ServiceController::class, 'show']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
    Route::apiResource('customers', CustomerController::class)->middleware('role:admin,staff');
    Route::patch('/customers/{customer}/password', [CustomerController::class, 'resetPassword'])->middleware('role:admin');
    Route::get('/staff/dashboard', [StaffController::class, 'dashboard'])->middleware('role:staff');
    Route::get('/staff/orders', [StaffController::class, 'orders'])->middleware('role:staff');
    Route::get('/staff/customers', [StaffController::class, 'customers'])->middleware('role:staff');
    Route::get('/staff/profile', [StaffController::class, 'profile'])->middleware('role:staff');
    Route::get('/staff', [StaffController::class, 'index'])->middleware('role:admin');
    Route::post('/staff', [StaffController::class, 'store'])->middleware('role:admin');
    Route::put('/staff/{user}', [StaffController::class, 'update'])->middleware('role:admin');
    Route::patch('/orders/{order}/assign', [StaffController::class, 'assignOrder'])->middleware('role:admin');
    Route::apiResource('tasks', TaskController::class)->middleware('role:admin,staff');
    Route::apiResource('deliveries', DeliveryController::class)->middleware('role:admin,staff,customer');
    Route::post('/payments/create', [PaymentController::class, 'create'])->middleware('role:admin,staff,customer');
    Route::post('/payments/{payment}/verify', [PaymentController::class, 'verify'])->middleware('role:admin,staff,customer');
    Route::post('/payments/{payment}/proof', [PaymentController::class, 'submitProof'])->middleware('role:customer');
    Route::patch('/payments/{payment}/verification', [PaymentController::class, 'verifyProof'])->middleware('role:admin');
    Route::post('/payments/{payment}/confirm-cash', [PaymentController::class, 'confirmCash'])->middleware('role:admin,staff');
    Route::get('/orders/{order}/payments', [PaymentController::class, 'orderPayments']);
    Route::get('/payments', [PaymentController::class, 'index'])->middleware('role:admin,staff,customer');
    Route::get('/payments/{payment}', [PaymentController::class, 'show'])->middleware('role:admin,staff,customer');
    Route::apiResource('inventory', InventoryController::class)->middleware('role:admin');
    Route::post('/inventory/{inventoryItem}/transactions', [InventoryController::class, 'transaction'])->middleware('role:admin');
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllRead']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);
    Route::get('/admin/dashboard', [DashboardController::class, 'admin'])->middleware('role:admin');
    Route::get('/reports/{report}', [ReportController::class, 'show'])->middleware('role:admin');
    Route::get('/reports', [ReportController::class, 'index'])->middleware('role:admin');
    Route::get('/settings', [SettingController::class, 'index'])->middleware('role:admin');
    Route::put('/settings', [SettingController::class, 'update'])->middleware('role:admin');
    Route::get('/admin/feedback', [FeedbackController::class, 'index'])->middleware('role:admin');
    Route::patch('/admin/feedback/{feedback}', [FeedbackController::class, 'update'])->middleware('role:admin');
});
