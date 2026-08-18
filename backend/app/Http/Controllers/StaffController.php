<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Order;
use App\Models\Task;
use App\Models\Delivery;

class StaffController extends Controller
{
    public function index(){return User::where('role','staff')->with('staffProfile')->withCount(['assignedOrders as active_orders_count'=>fn($q)=>$q->whereNotIn('status',['delivered','cancelled'])])->paginate();}
    public function store(Request $r){$d=$r->validate(['name'=>'required|string|max:255','email'=>'required|email|unique:users','password'=>'required|string|min:8','phone'=>'nullable|string|max:30','position'=>'nullable|string|max:100','status'=>'sometimes|in:active,inactive']);$u=User::create([...$d,'role'=>'staff']);$u->staffProfile()->create(['phone'=>$u->phone,'position'=>$d['position']??null,'status'=>$u->status]);return response()->json($u->load('staffProfile'),201);}
    public function update(Request $r,User $user){abort_unless($user->role==='staff',404);$d=$r->validate(['name'=>'sometimes|string|max:255','email'=>'sometimes|email|unique:users,email,'.$user->id,'phone'=>'nullable|string|max:30','position'=>'nullable|string|max:100','status'=>'sometimes|in:active,inactive']);$user->update($d);$user->staffProfile()->updateOrCreate([],['phone'=>$user->phone,'position'=>$d['position']??$user->staffProfile?->position,'status'=>$user->status]);return $user->load('staffProfile');}
    public function assignOrder(Request $r,Order $order){$d=$r->validate(['staff_id'=>'required|exists:users,id']);$staff=User::findOrFail($d['staff_id']);abort_unless($staff->role==='staff'&&$staff->status==='active',422);$order->update(['assigned_staff_id'=>$staff->id,'status'=>$order->status==='pending'?'accepted':$order->status]);Delivery::updateOrCreate(['order_id'=>$order->id],['customer_id'=>$order->customer_id,'staff_id'=>$staff->id,'pickup_date'=>$order->pickup_date,'pickup_address'=>$order->pickup_address,'status'=>'assigned']);return $order->load(['staff','delivery']);}
    public function dashboard(Request $r){$orders=Order::where('assigned_staff_id',$r->user()->id);return ['assigned_orders'=>$orders->whereNotIn('status',['delivered','cancelled'])->count(),'completed_orders'=>(clone $orders)->where('status','delivered')->count(),'pending_tasks'=>Task::where('assigned_to',$r->user()->id)->where('status','pending')->count()];}
    public function orders(Request $r){return Order::where('assigned_staff_id',$r->user()->id)->with(['customer','items.service'])->latest()->paginate();}
    public function customers(){return User::where('role','customer')->select('id','name','email','phone','address')->paginate();}
    public function profile(Request $r){return $r->user()->load('staffProfile');}
}
