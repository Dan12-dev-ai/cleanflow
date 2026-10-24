<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderCompleted extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly Order $order) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your Laundry Order Is Completed')
            ->greeting('Hello '.$notifiable->name.',')
            ->line("Your laundry order {$this->order->order_number} has been completed successfully.")
            ->line('Total: '.$this->order->total_amount.' ETB')
            ->line('Your clothes are ready for pickup or delivery.')
            ->line('Thank you for using CleanFlow Laundry.');
    }

    public function toArray(object $notifiable): array
    {
        return ['order_id' => $this->order->id, 'order_number' => $this->order->order_number, 'status' => 'completed', 'message' => "Your laundry order {$this->order->order_number} has been completed."];
    }
}
