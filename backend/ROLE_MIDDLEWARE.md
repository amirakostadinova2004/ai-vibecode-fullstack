# Role Middleware Documentation

## Преглед

`RoleMiddleware` е middleware за защита на route-ове според роли на потребителите. Той проверява дали аутентикираният потребител има необходимата роля за достъп до определен endpoint.

## Как работи

### 1. Регистрация на Middleware

```php
// bootstrap/app.php
$middleware->alias([
    'role' => \App\Http\Middleware\RoleMiddleware::class,
]);
```

### 2. Използване в Routes

```php
// Само за admin роля
Route::middleware('role:admin')->group(function () {
    Route::get('/admin/stats', [AdminController::class, 'stats']);
});

// За множество роли
Route::middleware('role:admin,frontend,backend')->group(function () {
    Route::get('/management/dashboard', [Controller::class, 'index']);
});

// За всички потребители (но не и гости)
Route::middleware('role:admin,frontend,backend,user')->group(function () {
    Route::post('/ai-tools', [AiToolController::class, 'store']);
});
```

## Доступни роли

- `admin` - Администратор с пълен достъп
- `frontend` - Frontend разработчик
- `backend` - Backend разработчик  
- `user` - Обикновен потребител
- `owner` - Собственик на системата

## Отговори при грешки

### 401 - Неаутентикиран потребител
```json
{
    "error": "Unauthenticated"
}
```

### 403 - Недостатъчни права
```json
{
    "error": "Insufficient permissions",
    "message": "You do not have the required role to access this resource",
    "required_roles": ["admin"],
    "your_role": "user"
}
```

## Примери за използване

### Admin само endpoints
```php
Route::prefix('admin')->middleware('role:admin')->group(function () {
    Route::get('/stats', [AdminController::class, 'stats']);
    Route::get('/users', [AdminController::class, 'users']);
    Route::post('/users', [AdminController::class, 'createUser']);
});
```

### Developer endpoints (frontend + backend)
```php
Route::middleware('role:frontend,backend')->group(function () {
    Route::get('/dev/dashboard', [DevController::class, 'index']);
    Route::get('/dev/tools', [DevController::class, 'tools']);
});
```

### Публични за всички аутентикирани потребители
```php
Route::middleware('role:admin,frontend,backend,user')->group(function () {
    Route::post('/ai-tools', [AiToolController::class, 'store']);
    Route::get('/my-tools', [AiToolController::class, 'myTools']);
});
```

## Текущи защитени routes

### Admin Routes (само admin роля)
- `/api/admin/*` - Всички admin endpoints

### AI Tools Management (всички аутентикирани потребители)
- `POST /api/ai-tools` - Създаване на нов AI инструмент
- `PUT /api/ai-tools/{id}` - Редактиране на AI инструмент
- `DELETE /api/ai-tools/{id}` - Изтриване на AI инструмент

### Публични AI Tools Routes (всички аутентикирани потребители)
- `GET /api/ai-tools` - Списък с AI инструменти
- `GET /api/ai-tools/{id}` - Детайли за AI инструмент
- `GET /api/my-tools` - Моите AI инструменти

## Безопасност

- Middleware-ът проверява ролята на потребителя от базата данни
- Няма възможност за заобикаляне на проверките
- Всички admin операции са защитени
- Потребителите могат да създават/редактират само собствените си AI инструменти
