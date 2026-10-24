<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return User::where('role','customer')->with('customerProfile')->withCount('orders')->latest('created_at')->paginate(15);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $d=$request->validate(['name'=>'required|string|max:255','email'=>'required|email|unique:users','password'=>'required|string|min:8','phone'=>'nullable|string|max:30','address'=>'nullable|string|max:1000','status'=>'sometimes|in:active,inactive']);$u=User::create([...$d,'role'=>'customer']);$u->customerProfile()->create(['phone'=>$u->phone,'address'=>$u->address]);return response()->json($u->load('customerProfile'),201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $customer)
    {
        abort_unless($customer->role==='customer',404); return $customer->load(['customerProfile','orders.items.service']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $customer)
    {
        abort_unless($customer->role==='customer',404);$d=$request->validate(['name'=>'sometimes|string|max:255','email'=>'sometimes|email|unique:users,email,'.$customer->id,'phone'=>'nullable|string|max:30','address'=>'nullable|string|max:1000','status'=>'sometimes|in:active,inactive']);$customer->update($d);$customer->customerProfile()->updateOrCreate([],['phone'=>$customer->phone,'address'=>$customer->address]);return $customer->load('customerProfile');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $customer)
    {
        abort_unless($customer->role==='customer',404);$customer->delete();return response()->noContent();
    }

    public function resetPassword(Request $request, User $customer)
    {
        abort_unless($customer->role === 'customer', 404);
        $data = $request->validate(['password' => 'required|string|min:8|confirmed']);
        $customer->update(['password' => $data['password']]);
        $customer->tokens()->delete();
        return response()->json(['message' => 'Customer password reset successfully.']);
    }
}
