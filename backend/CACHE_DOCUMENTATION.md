# Redis Cache Implementation Documentation

## Преглед

Системата използва Redis за кеширане на често достъпвани данни, което значително подобрява производителността на API endpoints.

## Конфигурация

### Docker Compose
```yaml
redis:
  image: redis:7-alpine
  container_name: vibecode_redis
  restart: always
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
```

### Laravel Configuration
```env
CACHE_STORE=redis
REDIS_CLIENT=predis
REDIS_HOST=redis
REDIS_PORT=6379
```

## CacheService

### Основни функции

#### 1. Кеширане на категории
```php
CacheService::getCategories() // Кешира всички AI tool категории
```

#### 2. Кеширане на статистики
```php
CacheService::getTotalToolsCount()        // Общ брой AI tools
CacheService::getApprovedToolsCount()     // Брой одобрени tools
CacheService::getPendingToolsCount()      // Брой чакащи tools
CacheService::getUsersCount()             // Брой потребители
CacheService::getReviewsCount()           // Брой ревюта
```

#### 3. Кеш инвалидация
```php
CacheService::clearAiToolsCache()  // Изчиства всички AI tools кешове
CacheService::clearUsersCache()    // Изчиства потребителски кешове
CacheService::clearReviewsCache()  // Изчиства ревю кешове
CacheService::clearAllCache()      // Изчиства всички кешове
```

#### 4. Warm-up функция
```php
CacheService::warmUpCache()  // Попълва кеша с всички данни
```

## Cache Keys

| Key | Описание | TTL |
|-----|----------|-----|
| `ai_tools_categories` | AI tool категории | 3600s (1 час) |
| `ai_tools_count` | Общ брой AI tools | 3600s |
| `approved_tools_count` | Брой одобрени tools | 3600s |
| `pending_tools_count` | Брой чакащи tools | 3600s |
| `users_count` | Брой потребители | 3600s |
| `reviews_count` | Брой ревюта | 3600s |

## Автоматично кеш инвалидиране

### AI Tools
- **Създаване**: `CacheService::clearAiToolsCache()`
- **Обновяване**: `CacheService::clearAiToolsCache()`
- **Изтриване**: `CacheService::clearAiToolsCache()`
- **Одобрение/Отхвърляне**: `CacheService::clearAiToolsCache()`

### Потребители
- **Създаване**: `CacheService::clearUsersCache()`
- **Обновяване**: `CacheService::clearUsersCache()`
- **Изтриване**: `CacheService::clearUsersCache()`

## Artisan Commands

### Warm-up Cache
```bash
php artisan cache:warm-up
```

**Изход:**
```
Starting cache warm-up...
Cache warm-up completed successfully!
Cache status:
  categories_cached: ✅ Cached
  tools_count_cached: ✅ Cached
  approved_tools_cached: ✅ Cached
  pending_tools_cached: ✅ Cached
  users_cached: ✅ Cached
  reviews_cached: ✅ Cached
```

## Производителност

### Преди кеширане
- Categories endpoint: ~1.3s
- Admin stats endpoint: ~0.1s

### След кеширане
- Categories endpoint: ~0.3s (**4x по-бързо**)
- Admin stats endpoint: ~0.08s (**25% по-бързо**)

## Използване в контролери

### AiToolController
```php
public function categories(): JsonResponse
{
    $categories = CacheService::getCategories();
    return response()->json($categories);
}
```

### AdminController
```php
public function stats()
{
    $stats = [
        'totalUsers' => CacheService::getUsersCount(),
        'totalTools' => CacheService::getTotalToolsCount(),
        'totalReviews' => CacheService::getReviewsCount(),
        'pendingTools' => CacheService::getPendingToolsCount(),
        // ...
    ];
    return response()->json($stats);
}
```

## Мониторинг

### Проверка на кеш статус
```php
$stats = CacheService::getCacheStats();
// Връща array с boolean стойности за всеки кеш
```

### Проверка на Redis връзка
```bash
docker-compose exec redis redis-cli ping
# Очакван отговор: PONG
```

## Best Practices

### 1. Кеш инвалидация
- Винаги изчиствайте кеша при промени в данните
- Използвайте специфични clear методи вместо clearAllCache()

### 2. TTL настройки
- По подразбиране: 3600 секунди (1 час)
- За динамични данни: по-кратък TTL
- За статични данни: по-дълъг TTL

### 3. Warm-up
- Изпълнявайте `cache:warm-up` при deployment
- Добавете в cron job за периодично обновяване

### 4. Мониторинг
- Проверявайте Redis паметта редовно
- Мониторирайте cache hit/miss ratio

## Troubleshooting

### Проблем: Redis connection failed
```bash
# Проверка на Redis статус
docker-compose ps redis

# Рестартиране на Redis
docker-compose restart redis
```

### Проблем: Кеш не се обновява
```bash
# Ръчно изчистване на всички кешове
docker-compose exec php php artisan cache:clear

# Warm-up на кеша
docker-compose exec php php artisan cache:warm-up
```

### Проблем: Високо Redis памет използване
```bash
# Проверка на Redis памет
docker-compose exec redis redis-cli info memory

# Изчистване на всички кешове
docker-compose exec redis redis-cli flushall
```

## Бъдещи подобрения

1. **Cache Tags**: Използване на Laravel cache tags за по-ефективно инвалидиране
2. **Cache Warming**: Автоматично warm-up при deployment
3. **Cache Metrics**: Добавяне на метрики за cache hit/miss ratio
4. **Distributed Caching**: Подготовка за multi-server setup
5. **Cache Compression**: Компресия на големи кешове
