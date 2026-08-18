<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Service;
use Illuminate\Support\Facades\DB;
use App\Notifications\OrderStatusChanged;
use App\Notifications\OrderCompleted;
use App\Models\Delivery;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $q=Order::with(['customer','staff','items.service']); $u=$request->user(); if($u->role==='customer')$q->where('customer_id',$u->id); if($u->role==='staff')$q->where('assigned_staff_id',$u->id); return $q->latest()->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $d=$request->validate(['phone'=>'required|string|max:30','clothes_type'=>'required|string|max:100','quantity'=>'required|numeric|gt:0','unit'=>'required|string|max:30','pickup_date'=>'required|date|after_or_equal:today','pickup_address'=>'required|string|max:1000','special_instructions'=>'nullable|string','items'=>'required|array|min:1','items.*.service_id'=>'required|exists:services,id','items.*.quantity'=>'required|numeric|gt:0']); return DB::transaction(function()use($d,$request){$items=[];$total=0;foreach($d['items']as$row){$s=Service::where('status','available')->findOrFail($row['service_id']);$sub=$s->price*$row['quantity'];$total+=$sub;$items[]=[$s,$row['quantity'],$sub];}$request->user()->customerProfile()->updateOrCreate([],['phone'=>$d['phone'],'address'=>$d['pickup_address']]);$o=Order::create(['order_number'=>'LD-'.now()->format('YmdHis').random_int(10,99),'customer_id'=>$request->user()->id,'service_id'=>$items[0][0]->id,'phone'=>$d['phone'],'clothes_type'=>$d['clothes_type'],'category'=>$items[0][0]->category,'quantity'=>$d['quantity'],'unit'=>$d['unit'],'pickup_date'=>$d['pickup_date'],'order_date'=>now(),'pickup_address'=>$d['pickup_address'],'special_instructions'=>$d['special_instructions']??null,'total_amount'=>$total]);foreach($items as[$s,$q,$sub])$o->items()->create(['service_id'=>$s->id,'quantity'=>$q,'weight'=>$d['unit']==='kg'?$q:null,'unit_price'=>$s->price,'subtotal'=>$sub]);Delivery::create(['order_id'=>$o->id,'customer_id'=>$request->user()->id,'pickup_date'=>$d['pickup_date'],'pickup_address'=>$d['pickup_address'],'status'=>'requested']);return response()->json($o->load(['items.service','delivery']),201);});
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Order $order)
    {
        $u=$request->user();abort_unless($u->role==='admin'||$order->customer_id===$u->id||$order->assigned_staff_id===$u->id,403);return $order->load(['customer','staff','items.service','payments','delivery']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateStatus(Request $request, Order $order)
    {
        $d=$request->validate(['status'=>'required|in:accepted,received,washing,drying,ironing,ready,ready_for_pickup,delivered,cancelled']);$u=$request->user();abort_unless($u->role==='admin'||($u->role==='staff'&&$order->assigned_staff_id===$u->id)||($u->role==='customer'&&$order->customer_id===$u->id&&$d['status']==='cancelled'&&$order->status==='pending'),403);$flow=['pending'=>['accepted','cancelled'],'accepted'=>['received','cancelled'],'received'=>['washing','cancelled'],'washing'=>['drying','cancelled'],'drying'=>['ironing','cancelled'],'ironing'=>['ready','cancelled'],'ready'=>['ready_for_pickup','delivered'],'ready_for_pickup'=>['delivered'],'delivered'=>[],'cancelled'=>[]];abort_unless(in_array($d['status'],$flow[$order->status]??[],true),422,'Invalid order status transition.');$order->update($d);$order->customer->notify(new OrderStatusChanged($order));if($order->status==='delivered')$order->customer->notify(new OrderCompleted($order));return $order;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
