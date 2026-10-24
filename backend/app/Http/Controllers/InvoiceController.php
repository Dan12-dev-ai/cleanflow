<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    private function findForUser(Request $request, Invoice $invoice): Invoice { $invoice->load(['order.customer','order.items.service','payment']); abort_unless($request->user()->role==='admin'||$invoice->order->customer_id===$request->user()->id||$invoice->order->assigned_staff_id===$request->user()->id,403); return $invoice; }
    public function index(Request $request){$q=Invoice::with(['order.customer','payment']);if($request->user()->role==='customer')$q->whereHas('order',fn($o)=>$o->where('customer_id',$request->user()->id));return $q->latest()->paginate();}
    public function show(Request $request,Invoice $invoice){return $this->findForUser($request,$invoice);}
    public function download(Request $request,Invoice $invoice){$invoice=$this->findForUser($request,$invoice);return Pdf::loadView('invoices.receipt',['invoice'=>$invoice])->download($invoice->invoice_number.'.pdf');}
}
