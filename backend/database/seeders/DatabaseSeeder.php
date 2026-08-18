<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Service;
use App\Models\InventoryItem;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::firstOrCreate(['email'=>'admin@cleanflow.test'], ['name'=>'CleanFlow Admin','password'=>Hash::make('Admin@12345'),'role'=>'admin','status'=>'active','phone'=>'+251911000001']);
        $staff = User::firstOrCreate(['email'=>'staff@cleanflow.test'], ['name'=>'Grace Boateng','password'=>Hash::make('Staff@12345'),'role'=>'staff','status'=>'active','phone'=>'+251911000002']);
        $staff->staffProfile()->firstOrCreate([], ['phone'=>$staff->phone,'position'=>'Laundry Specialist','status'=>'active']);
        $customer = User::firstOrCreate(['email'=>'customer@cleanflow.test'], ['name'=>'Maya Chen','password'=>Hash::make('Customer@12345'),'role'=>'customer','status'=>'active','phone'=>'+251911000003','address'=>'Addis Ababa']);
        $customer->customerProfile()->firstOrCreate([], ['phone'=>$customer->phone,'address'=>$customer->address]);
        foreach ([['Wash & Fold','Standard',100,'24h'],['Dry Cleaning','Premium',250,'48h'],['Ironing','Express',50,'8h'],['Express Service','Urgent',180,'4h']] as [$name,$category,$price,$duration]) { Service::firstOrCreate(['name'=>$name],['category'=>$category,'price'=>$price,'base_price'=>$price,'duration'=>$duration,'estimated_hours'=>(int) filter_var($duration,FILTER_SANITIZE_NUMBER_INT),'status'=>'available','description'=>"{$name} service"]); }
        foreach ([['Detergent','Cleaning supplies',24,'packs',10],['Fabric Softener','Cleaning supplies',18,'bottles',8],['Packaging Bags','Packaging',120,'pieces',40]] as [$name,$category,$quantity,$unit,$threshold]) InventoryItem::firstOrCreate(['name'=>$name],['category'=>$category,'quantity'=>$quantity,'unit'=>$unit,'minimum_threshold'=>$threshold,'reorder_level'=>$threshold]);
        $order = Order::where('customer_id', $customer->id)->oldest()->first();
        if ($order) { $payment = Payment::firstOrCreate(['transaction_reference'=>'DEMO-PAY-'.$order->id],['order_id'=>$order->id,'customer_id'=>$customer->id,'amount'=>$order->total_amount,'payment_method'=>'cash','status'=>'paid','paid_at'=>now()]); $order->update(['payment_status'=>'paid']); }
    }
}
