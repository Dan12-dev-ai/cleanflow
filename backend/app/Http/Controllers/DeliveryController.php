<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Delivery;
use App\Models\Order;

class DeliveryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $q=Delivery::with(['order','customer','staff']);$u=$request->user();if($u->role==='staff')$q->where('staff_id',$u->id);if($u->role==='customer')$q->where('customer_id',$u->id);return $q->latest()->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data=$request->validate(['order_id'=>'required|exists:orders,id','pickup_date'=>'nullable|date','pickup_time'=>'nullable','pickup_address'=>'required|string|max:1000','delivery_date'=>'nullable|date','delivery_time'=>'nullable','delivery_address'=>'nullable|string|max:1000','notes'=>'nullable|string']);$order=Order::findOrFail($data['order_id']);if($request->user()->role==='customer')abort_unless($order->customer_id===$request->user()->id,403);$data['customer_id']=$order->customer_id;return response()->json(Delivery::create($data)->load('order'),201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Delivery $delivery)
    {
        $u=$request->user();abort_unless($u->role==='admin'||$delivery->customer_id===$u->id||$delivery->staff_id===$u->id,403);return $delivery->load(['order','customer','staff']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Delivery $delivery)
    {
        $u=$request->user();abort_unless($u->role==='admin'||$delivery->staff_id===$u->id,403);$data=$request->validate(['staff_id'=>'nullable|exists:users,id','pickup_date'=>'nullable|date','pickup_time'=>'nullable','pickup_address'=>'sometimes|string|max:1000','delivery_date'=>'nullable|date','delivery_time'=>'nullable','delivery_address'=>'nullable|string|max:1000','notes'=>'nullable|string','status'=>'sometimes|in:requested,assigned,picked_up,processing,out_for_delivery,delivered,cancelled']);$delivery->update($data);return $delivery->fresh()->load(['order','customer','staff']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Delivery $delivery)
    {
        abort_unless($request->user()->role==='admin',403);$delivery->delete();return response()->noContent();
    }
}
