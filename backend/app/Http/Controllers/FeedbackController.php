<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function publicIndex()
    {
        return Feedback::where('status', 'approved')->latest()->take(6)->get(['id', 'name', 'rating', 'message', 'created_at']);
    }

    public function store(Request $request)
    {
        $data = $request->validate(['name' => 'required|string|min:2|max:100', 'rating' => 'required|integer|between:1,5', 'message' => 'required|string|min:5|max:1000']);
        return response()->json(Feedback::create([...$data, 'status' => 'approved']), 201);
    }

    public function index()
    {
        return Feedback::latest()->paginate(50);
    }

    public function update(Request $request, Feedback $feedback)
    {
        $data = $request->validate(['status' => 'required|in:pending,approved,rejected']);
        $feedback->update($data);
        return $feedback;
    }
}
