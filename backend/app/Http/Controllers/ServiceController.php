<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $q = Service::query(); if (! optional($request->user())->hasRole('admin', 'staff')) $q->where('status', 'available'); return $q->orderBy('name')->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return response()->json(Service::create($request->validate(['name'=>'required|string|max:255','category'=>'required|string|max:100','description'=>'nullable|string','price'=>'required|numeric|min:0','duration'=>'nullable|string|max:100','status'=>'sometimes|in:available,unavailable'])), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service)
    {
        return $service;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Service $service)
    {
        $service->update($request->validate(['name'=>'sometimes|string|max:255','category'=>'sometimes|string|max:100','description'=>'nullable|string','price'=>'sometimes|numeric|min:0','duration'=>'nullable|string|max:100','status'=>'sometimes|in:available,unavailable'])); return $service;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        $service->delete(); return response()->noContent();
    }
}
