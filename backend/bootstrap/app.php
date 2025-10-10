<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful; // 👈 add this line

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            EnsureFrontendRequestsAreStateful::class,
        ]);
        
        // Register role middleware
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
        
        // Exclude CSRF for login, register, admin routes, and AI tools routes
        $middleware->validateCsrfTokens(except: [
            'api/login',
            'api/register',
            'api/ai-tools',
            'api/ai-tools/*',
            'api/my-tools',
            'api/admin/content/tools/*/approve',
            'api/admin/content/tools/*/reject',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();