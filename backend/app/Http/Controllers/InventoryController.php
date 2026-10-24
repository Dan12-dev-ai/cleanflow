<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InventoryItem;
use App\Models\InventoryTransaction;

class InventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return InventoryItem::with('transactions')->orderBy('name')->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return response()->json(InventoryItem::create($request->validate(['name'=>'required|string|max:255|unique:inventory_items','quantity'=>'required|numeric|min:0','unit'=>'required|string|max:50','minimum_threshold'=>'required|numeric|min:0'])),201);
    }

    /**
     * Display the specified resource.
     */
    public function show(InventoryItem $inventory)
    {
        return $inventory->load('transactions');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, InventoryItem $inventory)
    {
        $inventory->update($request->validate(['name'=>'sometimes|string|max:255|unique:inventory_items,name,'.$inventory->id,'quantity'=>'sometimes|numeric|min:0','unit'=>'sometimes|string|max:50','minimum_threshold'=>'sometimes|numeric|min:0']));return $inventory;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InventoryItem $inventory)
    {
        $inventory->delete();return response()->noContent();
    }
    public function transaction(Request $request, InventoryItem $inventory){$d=$request->validate(['type'=>'required|in:stock_in,stock_out,adjustment','quantity'=>'required|numeric|gt:0','reason'=>'nullable|string|max:255']);$new=$d['type']==='stock_in'?$inventory->quantity+$d['quantity']:($d['type']==='stock_out'?$inventory->quantity-$d['quantity']:$d['quantity']);if($new<0)return response()->json(['message'=>'Insufficient stock.'],422);$inventory->update(['quantity'=>$new]);return response()->json(InventoryTransaction::create([...$d,'inventory_item_id'=>$inventory->id,'created_by'=>$request->user()->id]),201);}
}
