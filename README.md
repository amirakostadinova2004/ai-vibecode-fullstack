# AI VibeCode - Fullstack Application

Модерна fullstack приложение за управление на AI инструменти с ролева система, кеширане и административен панел.

## Технологии

### Backend
- **Laravel 12** - PHP framework
- **MySQL 8.0** - База данни
- **Redis 7** - Кеширане
- **Laravel Sanctum** - API аутентикация
- **Google Authenticator** - 2FA

### Frontend
- **Next.js 15** - React framework
- **Tailwind CSS** - Стилизиране
- **App Router** - Next.js routing

### Infrastructure
- **Docker & Docker Compose** - Контейнеризация
- **Nginx** - Web server

##  Изисквания

- Docker и Docker Compose
- Git
- Node.js 20+ (за разработка)
- PHP 8.2+ (за разработка)

## 🛠️ Инсталация

### 1. Клониране на проекта
```bash
git clone https://github.com/amirakostadinova2004/ai-vibecode-fullstack.git
cd ai-vibecode-fullstack
```

### 2. Конфигурация на environment файлове

#### Backend (.env)
```bash
# Копиране на example файла
cp backend/.env.example backend/.env

# Основни настройки
APP_NAME="AI VibeCode"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

# База данни
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=vibecode
DB_USERNAME=vibecode_user
DB_PASSWORD=vibecode_pass

# Кеширане
CACHE_STORE=redis
REDIS_CLIENT=predis
REDIS_HOST=redis
REDIS_PORT=6379

# API
SANCTUM_STATEFUL_DOMAINS=localhost:8200
```

##  Стартиране с Docker

### 1. Стартиране на всички услуги
```bash
# Стартиране на всички контейнери
docker-compose up -d

# Проверка на статуса
docker-compose ps
```

### 2. Инсталация на зависимости и миграции
```bash
# Backend зависимости
docker run --rm -v $(pwd)/backend:/app -w /app composer:latest composer install

# Frontend зависимости
docker-compose exec frontend npm install

# Генериране на APP_KEY
docker-compose exec php php artisan key:generate

# Миграции и seeders
docker-compose exec php php artisan migrate --seed

# Warm-up на кеша
docker-compose exec php php artisan cache:warm-up
```

### 3. Проверка на услугите
```bash
# Backend API
curl http://localhost:8201/api/ai-tools/categories

# Frontend
open http://localhost:8200
```

##  Разработка

### Backend команди
```bash
# Влизане в PHP контейнера
docker-compose exec php bash

# Artisan команди
docker-compose exec php php artisan migrate
docker-compose exec php php artisan make:controller MyController
docker-compose exec php php artisan cache:clear

# Composer команди
docker run --rm -v $(pwd)/backend:/app -w /app composer:latest composer require package/name
```

### Frontend команди
```bash
# Влизане в frontend контейнера
docker-compose exec frontend bash

# NPM команди
docker-compose exec frontend npm run dev
docker-compose exec frontend npm run build
docker-compose exec frontend npm install package-name
```

## 📊 Как се добавят AI инструменти

### 1. Чрез API (програмен)
```bash
# Аутентикация
TOKEN=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  http://localhost:8201/api/login | jq -r '.token')

# Добавяне на инструмент
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ChatGPT",
    "description": "AI-powered chatbot",
    "category": "Chatbot",
    "url": "https://chat.openai.com",
    "rating": 5,
    "price_tier": 1
  }' \
  http://localhost:8201/api/ai-tools
```

### 2. Чрез UI (потребителски интерфейс)

1. **Вход в системата** - http://localhost:8200/login
2. **Навигация** - Кликнете на "Dashboard" в страничната лента
3. **Добавяне** - Кликнете на "Add AI Tool" бутона
4. **Попълване на формата**:
   - Име на инструмента
   - Описание
   - Категория
   - URL адрес
   - Рейтинг (1-5)
   - Ценова категория (1-3)
5. **Изпращане** - Кликнете "Submit"

### 3. Одобрение от администратор

Новите инструменти се създават със статус `pending` и трябва да бъдат одобрени от администратор:

1. **Admin вход** - admin@admin.local / password
2. **Content Management** - Навигиране към Admin Panel → Content Management
3. **Одобрение** - Кликване на "Approve" за всеки инструмент
4. **Публикуване** - Одобрените инструменти се появяват в основния dashboard

## 👥 Ролева система и права

### Роли в системата

| Роля | Описание | Права |
|------|----------|-------|
| **admin** | Администратор | Пълен достъп до всички функции |
| **frontend** | Frontend разработчик | Може да създава/редактира AI инструменти |
| **backend** | Backend разработчик | Може да създава/редактира AI инструменти |

### Права по роли

#### 🔐 Admin (admin)
- ✅ Достъп до Admin Panel
- ✅ Управление на потребители (CRUD)
- ✅ Одобрение/отхвърляне на AI инструменти
- ✅ Преглед на статистики
- ✅ Управление на ревюта
- ✅ Пълен достъп до всички endpoints

#### 👨‍💻 Developers (frontend, backend)
- ✅ Създаване на AI инструменти
- ✅ Редактиране на собствени инструменти
- ✅ Изтриване на собствени инструменти
- ✅ Преглед на всички одобрени инструменти
- ❌ Няма достъп до Admin Panel
- ❌ Не може да одобрява инструменти


### Тестови потребители

| Email | Парола | Роля | Описание |
|-------|--------|------|----------|
| admin@admin.local | password | admin | Администратор |
| test@example.com | password | user | Тестов потребител |
| frontend@dev.local | password | frontend | Frontend разработчик |
| backend@dev.local | password | backend | Backend разработчик |

### Middleware защита

```php
// Само за admin
Route::middleware('role:admin')->group(function () {
    Route::get('/admin/stats', [AdminController::class, 'stats']);
});

// За всички разработчици
Route::middleware('role:admin,frontend,backend')->group(function () {
    Route::get('/dev/dashboard', [Controller::class, 'index']);
});

// За всички аутентикирани потребители
Route::middleware('role:admin,frontend,backend,user')->group(function () {
    Route::post('/ai-tools', [AiToolController::class, 'store']);
});
```

## 🔒 2FA (Two-Factor Authentication)

### Активиране на 2FA
1. Вход в системата
2. Навигация към Settings (премахнато от основния dashboard)
3. Кликване на "Enable 2FA"
4. Сканиране на QR кода с Google Authenticator
5. Въвеждане на 6-цифрения код за потвърждение

### Отключване на 2FA
1. В Settings страницата
2. Въвеждане на паролата
3. Кликване на "Disable 2FA"

## 🗄️ База данни

### Основни таблици
- **users** - Потребители с роли и 2FA настройки
- **ai_tools** - AI инструменти с одобрение статус
- **reviews** - Ревюта за AI инструменти
- **personal_access_tokens** - API токени за аутентикация

### Миграции
```bash
# Стартиране на миграции
docker-compose exec php php artisan migrate

# Отмяна на миграции
docker-compose exec php php artisan migrate:rollback

# Преглед на статуса
docker-compose exec php php artisan migrate:status
```

## 🚀 Cache система

### Redis кеширане
```bash
# Warm-up на кеша
docker-compose exec php php artisan cache:warm-up

# Изчистване на кеша
docker-compose exec php php artisan cache:clear

# Проверка на Redis
docker-compose exec redis redis-cli ping
```

### Кеширани данни
- AI tool категории
- Брой инструменти (общо, одобрени, чакащи)
- Брой потребители
- Брой ревюта

##  Troubleshooting

### Често срещани проблеми

#### 1. Docker контейнерите не стартират
```bash
# Проверка на статуса
docker-compose ps

# Преглед на логовете
docker-compose logs php
docker-compose logs mysql
docker-compose logs redis

# Рестартиране на услугите
docker-compose restart
```

#### 2. База данни connection error
```bash
# Проверка на MySQL
docker-compose exec mysql mysql -u root -p

# Проверка на .env файла
docker-compose exec php cat .env | grep DB_

# Рестартиране на MySQL
docker-compose restart mysql
```

#### 3. Frontend не зарежда
```bash
# Проверка на frontend контейнера
docker-compose exec frontend npm run dev

# Проверка на портовете
netstat -tulpn | grep :8200
```

#### 4. API връща HTML вместо JSON
```bash
# Проверка на Laravel routes
docker-compose exec php php artisan route:list

# Изчистване на кеша
docker-compose exec php php artisan optimize:clear
```

##  API Endpoints

### Аутентикация
```
POST /api/login          - Вход
POST /api/register       - Регистрация
POST /api/logout         - Изход
GET  /api/me             - Текущ потребител
```

### AI Tools
```
GET    /api/ai-tools              - Списък с инструменти
GET    /api/ai-tools/categories   - Категории
GET    /api/ai-tools/{id}         - Детайли за инструмент
POST   /api/ai-tools              - Създаване (аутентикиран)
PUT    /api/ai-tools/{id}         - Редактиране (аутентикиран)
DELETE /api/ai-tools/{id}         - Изтриване (аутентикиран)
GET    /api/my-tools              - Моите инструменти
```

### Admin (само за admin роля)
```
GET  /api/admin/stats                    - Статистики
GET  /api/admin/users                    - Потребители
POST /api/admin/users                    - Създаване на потребител
PUT  /api/admin/users/{id}               - Редактиране на потребител
DELETE /api/admin/users/{id}             - Изтриване на потребител
GET  /api/admin/content                  - Чакащи инструменти
POST /api/admin/content/tools/{id}/approve - Одобрение на инструмент
POST /api/admin/content/tools/{id}/reject  - Отхвърляне на инструмент
```

### 2FA
```
GET  /api/two-factor/status              - Статус на 2FA
POST /api/two-factor/generate-secret     - Генериране на секрет
POST /api/two-factor/enable              - Активиране на 2FA
POST /api/two-factor/disable             - Деактивиране на 2FA
POST /api/two-factor/verify              - Верификация на код
```

##  Deployment

### Production настройки
```bash
# .env за production
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Оптимизация
docker-compose exec php php artisan config:cache
docker-compose exec php php artisan route:cache
docker-compose exec php php artisan view:cache
```

### Backup
```bash
# Backup на база данни
docker-compose exec mysql mysqldump -u root -p vibecode > backup.sql

# Backup на Redis
docker-compose exec redis redis-cli BGSAVE
```

---


