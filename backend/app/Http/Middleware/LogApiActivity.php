<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogApiActivity
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        if ($request->user() && ! $request->is('api/notifications*')) {
            \App\Models\ActivityLog::create(['user_id'=>$request->user()->id,'action'=>$request->method().' '.$request->path(),'description'=>'API request completed with status '.$response->getStatusCode(),'ip_address'=>$request->ip()]);
        }
        return $response;
    }
}
