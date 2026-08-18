<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Customer;

class AuthController extends Controller
{
    public function register(Request $r) { $d=$r->validate(['name'=>'required|string|max:255','email'=>'required|email|unique:users','password'=>'required|string|min:8|confirmed','phone'=>'nullable|string|max:30','address'=>'nullable|string|max:1000']); $u=User::create([...$d,'role'=>'customer']); $u->customerProfile()->create(['phone'=>$u->phone,'address'=>$u->address]); Customer::firstOrCreate(['user_id'=>$u->id],['address'=>$u->address,'join_date'=>now()->toDateString(),'status'=>'active']); return response()->json(['user'=>$u,'token'=>$u->createToken('cleanflow-api')->plainTextToken],201); }
    public function login(Request $r) { $d=$r->validate(['email'=>'required|email','password'=>'required|string','device_name'=>'nullable|string|max:100']);$u=User::where('email',$d['email'])->first();if(!$u||!Hash::check($d['password'],$u->password))return response()->json(['message'=>'Invalid credentials.'],422);if($u->status!=='active')return response()->json(['message'=>'Account is inactive.'],403);return ['user'=>$u,'token'=>$u->createToken($d['device_name']??'cleanflow-api')->plainTextToken]; }
    public function logout(Request $r) {$r->user()->currentAccessToken()->delete();return response()->noContent();}
    public function user(Request $r) {return $r->user()->load(['customerProfile','staffProfile']);}
    public function updateProfile(Request $r) {$data=$r->validate(['name'=>'sometimes|string|max:255','phone'=>'nullable|string|max:30','address'=>'nullable|string|max:1000','position'=>'nullable|string|max:100']);$r->user()->update(collect($data)->except('position')->all());if($r->user()->role==='staff'&&array_key_exists('position',$data))$r->user()->staffProfile()->updateOrCreate([],['phone'=>$r->user()->phone,'position'=>$data['position'],'status'=>$r->user()->status]);return $r->user()->fresh()->load(['customerProfile','staffProfile']);}
    public function changePassword(Request $r) {$d=$r->validate(['current_password'=>'required','password'=>'required|string|min:8|confirmed']);if(!Hash::check($d['current_password'],$r->user()->password))return response()->json(['message'=>'Current password is incorrect.'],422);$r->user()->update(['password'=>$d['password']]);return response()->noContent();}
}
