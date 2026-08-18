<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order; use App\Models\Payment; use App\Models\Service; use App\Models\User;

class ReportController extends Controller
{
    public function index(){return ['available_reports'=>['dashboard','sales','orders','revenue','customers','services']];}
    public function show(string $report){return match($report){'dashboard'=>['total_orders'=>Order::count(),'completed_orders'=>Order::where('status','delivered')->count(),'cancelled_orders'=>Order::where('status','cancelled')->count(),'revenue'=>Payment::where('status','paid')->sum('amount'),'average_order_value'=>Order::avg('total_amount'),'most_popular_service'=>Service::withCount('orderItems')->orderByDesc('order_items_count')->first()], 'sales','revenue'=>Payment::where('status','paid')->selectRaw('date(paid_at) date, sum(amount) total')->groupByRaw('date(paid_at)')->orderBy('date')->get(), 'orders'=>Order::selectRaw('date(created_at) date, count(*) total')->groupByRaw('date(created_at)')->orderBy('date')->get(), 'customers'=>User::where('role','customer')->selectRaw('date(created_at) date, count(*) total')->groupByRaw('date(created_at)')->orderBy('date')->get(), 'services'=>Service::withCount('orderItems')->orderByDesc('order_items_count')->get(), default=>abort(404)};}
}
