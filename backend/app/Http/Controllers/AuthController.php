<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $r) { if ($r->filled('phone')) $r->merge(['phone' => $this->normalizeEthiopianPhone($r->input('phone'))]); $d=$r->validate(['name'=>'required|string|max:255','email'=>'required|email|unique:users','password'=>'required|string|min:8|confirmed','phone'=>'nullable|string|max:30','address'=>'nullable|string|max:1000']); $u=User::create([...$d,'role'=>'customer']); $u->customerProfile()->create(['phone'=>$u->phone,'address'=>$u->address]); return response()->json(['user'=>$u,'token'=>$u->createToken('cleanflow-api')->plainTextToken],201); }
    public function login(Request $r) { $d=$r->validate(['email'=>'required|email','password'=>'required|string','device_name'=>'nullable|string|max:100']);$u=User::where('email',$d['email'])->first();if(!$u||!Hash::check($d['password'],$u->password))return response()->json(['message'=>'Invalid credentials.'],422);if($u->status!=='active')return response()->json(['message'=>'Account is inactive.'],403);return ['user'=>$u,'token'=>$u->createToken($d['device_name']??'cleanflow-api')->plainTextToken]; }
    public function logout(Request $r) {$r->user()->currentAccessToken()->delete();return response()->noContent();}
    public function user(Request $r) {return $r->user()->load(['customerProfile','staffProfile']);}
    public function updateProfile(Request $r)
    {
        $user = $r->user();
        if ($r->filled('phone')) $r->merge(['phone' => $this->normalizeEthiopianPhone($r->input('phone'))]);
        $data = $r->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => ['nullable', 'string', 'max:30', Rule::unique('users', 'phone')->ignore($user->id)],
            'address' => 'nullable|string|max:1000',
            'position' => 'nullable|string|max:100',
        ], [
            'phone.unique' => 'This phone number is already used by another account.',
        ]);
        if (array_key_exists('phone', $data) && $data['phone']) $data['phone'] = $this->normalizeEthiopianPhone($data['phone']);

        $user->update(collect($data)->except('position')->all());

        if ($user->role === 'staff' && array_key_exists('position', $data)) {
            $user->staffProfile()->updateOrCreate([], [
                'phone' => $user->phone,
                'position' => $data['position'],
                'status' => $user->status,
            ]);
        }

        return $user->fresh()->load(['customerProfile', 'staffProfile']);
    }

    private function normalizeEthiopianPhone(string $phone): string
    {
        $phone = preg_replace('/[\s()\-]/', '', $phone);
        if (str_starts_with($phone, '09')) return '+251'.substr($phone, 1);
        if (str_starts_with($phone, '9') && strlen($phone) === 9) return '+251'.$phone;
        return $phone;
    }
    public function changePassword(Request $r) {$d=$r->validate(['current_password'=>'required','password'=>'required|string|min:8|confirmed']);if(!Hash::check($d['current_password'],$r->user()->password))return response()->json(['message'=>'Current password is incorrect.'],422);$r->user()->update(['password'=>$d['password']]);return response()->noContent();}
}
