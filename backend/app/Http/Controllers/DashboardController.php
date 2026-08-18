<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User; use App\Models\Order; use App\Models\Payment; use App\Models\InventoryItem;

class DashboardController extends Controller
{
    public function admin(){return ['total_staff'=>User::where('role','staff')->count(),'total_customers'=>User::where('role','customer')->count(),'active_orders'=>Order::whereNotIn('status',['delivered','cancelled'])->count(),'completed_orders'=>Order::where('status','delivered')->count(),'total_revenue'=>Payment::where('status','paid')->sum('amount'),'pending_payments'=>Payment::where('status','pending')->count(),'low_stock_items'=>InventoryItem::whereColumn('quantity','<=','minimum_threshold')->count()];}
}
