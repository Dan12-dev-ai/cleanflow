<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;

class PasswordResetController extends Controller
{
    public function sendLink(Request $request){$request->validate(['email'=>'required|email']);$status=Password::sendResetLink($request->only('email'));return $status===Password::RESET_LINK_SENT?response()->json(['message'=>__($status)]):response()->json(['message'=>__($status)],422);}
    public function reset(Request $request){$data=$request->validate(['token'=>'required','email'=>'required|email','password'=>'required|string|min:8|confirmed']);$status=Password::reset($data,function($user,$password){$user->forceFill(['password'=>Hash::make($password)])->save();$user->tokens()->delete();});return $status===Password::PASSWORD_RESET?response()->json(['message'=>__($status)]):response()->json(['message'=>__($status)],422);}
}
