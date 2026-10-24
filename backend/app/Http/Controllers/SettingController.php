<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request; use App\Models\Setting;

class SettingController extends Controller
{
    public function index(){return Setting::orderBy('key')->get();}
    public function update(Request $r){$d=$r->validate(['settings'=>'required|array','settings.*.key'=>'required|string|max:100','settings.*.value'=>'nullable']);foreach($d['settings']as$row)Setting::updateOrCreate(['key'=>$row['key']],['value'=>$row['value']]);return $this->index();}
}
