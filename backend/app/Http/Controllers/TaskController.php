<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $q=Task::with(['assignee','order']); if($request->user()->role==='staff')$q->where('assigned_to',$request->user()->id); return $q->latest()->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data=$request->validate(['assigned_to'=>'required|exists:users,id','order_id'=>'nullable|exists:orders,id','title'=>'required|string|max:255','description'=>'nullable|string','priority'=>'sometimes|in:low,normal,high,urgent','due_date'=>'nullable|date']); return response()->json(Task::create($data)->load(['assignee','order']),201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Task $task)
    {
        abort_unless($request->user()->role==='admin'||$task->assigned_to===$request->user()->id,403);return $task->load(['assignee','order']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        abort_unless($request->user()->role==='admin'||$task->assigned_to===$request->user()->id,403);$data=$request->validate(['assigned_to'=>'sometimes|exists:users,id','order_id'=>'nullable|exists:orders,id','title'=>'sometimes|string|max:255','description'=>'nullable|string','priority'=>'sometimes|in:low,normal,high,urgent','due_date'=>'nullable|date','status'=>'sometimes|in:pending,in_progress,completed,cancelled']);if(($data['status']??null)==='completed')$data['completed_at']=now();$task->update($data);return $task->fresh()->load(['assignee','order']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Task $task)
    {
        abort_unless($request->user()->role==='admin',403);$task->delete();return response()->noContent();
    }
}
