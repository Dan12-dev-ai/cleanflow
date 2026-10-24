<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'telebirr' => [
        'merchant_id' => env('TELEBIRR_MERCHANT_ID'),
        'checkout_url' => env('TELEBIRR_CHECKOUT_URL'),
        'verify_url' => env('TELEBIRR_VERIFY_URL'),
        'callback_secret' => env('TELEBIRR_CALLBACK_SECRET'),
        'account_name' => env('TELEBIRR_ACCOUNT_NAME', 'CleanFlow Laundry'),
        'account_number' => env('TELEBIRR_ACCOUNT_NUMBER', 'Not configured'),
    ],
    'cbe' => [
        'account_name' => env('CBE_ACCOUNT_NAME', 'CleanFlow Laundry'),
        'account_number' => env('CBE_ACCOUNT_NUMBER', 'Not configured'),
    ],

];
