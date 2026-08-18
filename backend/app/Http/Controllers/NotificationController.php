<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class NotificationController extends Controller
{
    public function index(Request $r){return $r->user()->notifications()->latest()->paginate();}
    public function markRead(Request $r,string $notification){$n=$r->user()->notifications()->find($notification);if(!$n)throw new ModelNotFoundException();$n->markAsRead();return $n;}
    public function markAllRead(Request $r){$r->user()->unreadNotifications->markAsRead();return response()->noContent();}
    public function destroy(Request $r,string $notification){$n=$r->user()->notifications()->find($notification);if(!$n)throw new ModelNotFoundException();$n->delete();return response()->noContent();}
}
