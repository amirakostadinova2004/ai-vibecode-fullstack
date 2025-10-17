<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Security Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains security-related configurations for the AI VibeCode
    | application including rate limiting, CORS, and other security measures.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    |
    | Configure rate limiting for different API endpoints to prevent abuse.
    |
    */
    'rate_limits' => [
        'api' => [
            'max_attempts' => env('API_RATE_LIMIT', 60),
            'decay_minutes' => 1,
        ],
        'auth' => [
            'max_attempts' => env('AUTH_RATE_LIMIT', 5),
            'decay_minutes' => 1,
        ],
        'two_factor' => [
            'max_attempts' => env('TWO_FACTOR_RATE_LIMIT', 3),
            'decay_minutes' => 5,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | CORS Configuration
    |--------------------------------------------------------------------------
    |
    | Configure Cross-Origin Resource Sharing settings.
    |
    */
    'cors' => [
        'allowed_origins' => [
            'http://localhost:8200',
            'http://localhost:3000',
            env('FRONTEND_URL', 'http://localhost:8200'),
        ],
        'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
        'exposed_headers' => [],
        'max_age' => 86400, // 24 hours
        'supports_credentials' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Password Requirements
    |--------------------------------------------------------------------------
    |
    | Configure password complexity requirements.
    |
    */
    'password_requirements' => [
        'min_length' => 8,
        'require_uppercase' => true,
        'require_lowercase' => true,
        'require_numbers' => true,
        'require_symbols' => false,
    ],

    /*
    |--------------------------------------------------------------------------
    | Session Security
    |--------------------------------------------------------------------------
    |
    | Configure session security settings.
    |
    */
    'session' => [
        'lifetime' => env('SESSION_LIFETIME', 120), // minutes
        'secure' => env('SESSION_SECURE_COOKIE', false),
        'http_only' => true,
        'same_site' => 'lax',
    ],

    /*
    |--------------------------------------------------------------------------
    | Two-Factor Authentication
    |--------------------------------------------------------------------------
    |
    | Configure 2FA security settings.
    |
    */
    'two_factor' => [
        'issuer' => env('APP_NAME', 'AI VibeCode'),
        'window' => 1, // Allow 1 time step tolerance
        'recovery_codes_count' => 10,
        'backup_codes_length' => 8,
    ],

    /*
    |--------------------------------------------------------------------------
    | File Upload Security
    |--------------------------------------------------------------------------
    |
    | Configure file upload security settings.
    |
    */
    'file_upload' => [
        'max_size' => 10240, // 10MB in KB
        'allowed_types' => ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'txt', 'md'],
        'scan_for_malware' => false, // Set to true in production
    ],

    /*
    |--------------------------------------------------------------------------
    | API Security Headers
    |--------------------------------------------------------------------------
    |
    | Configure security headers for API responses.
    |
    */
    'headers' => [
        'X-Content-Type-Options' => 'nosniff',
        'X-Frame-Options' => 'DENY',
        'X-XSS-Protection' => '1; mode=block',
        'Referrer-Policy' => 'strict-origin-when-cross-origin',
        'Content-Security-Policy' => "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
    ],
];
