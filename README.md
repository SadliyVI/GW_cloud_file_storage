# Graduate Work - "Cloud File Storage"

Веб-приложение облачного файлового хранилища, для загрузки, хранения, скачивания,
переименования файлов и организации публичного доступа к ним по специальным ссылкам.

Проект реализован как единый монорепозиторий и содержит:

- **_backend_** на Python/Django;
- REST API на Django REST Framework;
- PostgreSQL в качестве СУБД;
- **_frontend_** на React, Redux Toolkit, React Router;
- сборку frontend через npm и Vite;
- публикацию собранного SPA через единый Django-сервер.

---

---

[![Cloud icon](frontend/src/assets/cloud_icon.png)](https://www.geonavfilestorage.online)

## [Online version](https://www.geonavfilestorage.online)

---

## Оглавление

- [Graduate Work - "Cloud File Storage"](#graduate-work---cloud-file-storage)
  - [Online version](#online-version)
  - [Оглавление](#оглавление)
  - [1. Описание](#1-описание)
  - [1.1. Основные возможности](#11-основные-возможности)
    - [Для всех пользователей](#для-всех-пользователей)
    - [Для администратора](#для-администратора)
  - [1.2. Стек технологий](#12-стек-технологий)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [1.3. Backend-приложения](#13-backend-приложения)
    - [`accounts`](#accounts)
    - [`storage_app`](#storage_app)
  - [1.4. Frontend](#14-frontend)
  - [2. Установка](#2-установка)
  - [2.1. Системные требования](#21-системные-требования)
  - [2.2. Клонирование проекта с GitHub](#22-клонирование-проекта-с-github)
    - [Windows PowerShell](#windows-powershell)
    - [Linux/macOS](#linuxmacos)
  - [2.3. Настройка PostgreSQL](#23-настройка-postgresql)
    - [2.3.1. Создание базы данных на Windows](#231-создание-базы-данных-на-windows)
    - [2.3.2. Создание базы данных на Linux](#232-создание-базы-данных-на-linux)
    - [2.3.3. Создание базы данных на macOS](#233-создание-базы-данных-на-macos)
  - [2.4. Установка backend на Windows](#24-установка-backend-на-windows)
  - [2.5. Установка backend на Linux/macOS](#25-установка-backend-на-linuxmacos)
  - [2.6. Установка frontend на Windows/Linux/macOS](#26-установка-frontend-на-windowslinuxmacos)
  - [2.7. Запуск проекта в режиме разработки](#27-запуск-проекта-в-режиме-разработки)
    - [Терминал 1 — backend](#терминал-1--backend)
      - [Запуск в Windows](#запуск-в-windows)
      - [Запук в Linux/macOS](#запук-в-linuxmacos)
    - [Терминал 2 — frontend](#терминал-2--frontend)
      - [Windows/Linux/macOS](#windowslinuxmacos)
    - [Проверка](#проверка)
  - [2.8. Сборка frontend и запуск через Django](#28-сборка-frontend-и-запуск-через-django)
    - [2.8.1. Сборка frontend](#281-сборка-frontend)
    - [2.8.2. Настройка backend для production](#282-настройка-backend-для-production)
    - [2.8.3. Сбор статических файлов Django](#283-сбор-статических-файлов-django)
    - [2.8.4. Применение миграций](#284-применение-миграций)
    - [2.8.5. Запуск через Django](#285-запуск-через-django)
  - [3. Конфигурация](#3-конфигурация)
  - [3.1. Описание переменных окружения](#31-описание-переменных-окружения)
  - [4. Структура проекта](#4-структура-проекта)
  - [5. Основные маршруты приложения](#5-основные-маршруты-приложения)
  - [5.1. Frontend](#51-frontend)
  - [5.2. Backend API](#52-backend-api)
  - [6. Учётная запись администратора](#6-учётная-запись-администратора)
  - [6.1. Изменение пароля администратора](#61-изменение-пароля-администратора)
    - [Изменение пароля в Windows/Linux/macOS](#изменение-пароля-в-windowslinuxmacos)
  - [6.2. Создание администратора вручную](#62-создание-администратора-вручную)
  - [7. Полезные команды](#7-полезные-команды)
  - [7.1. Backend](#71-backend)
    - [Активация виртуального окружения](#активация-виртуального-окружения)
    - [Запуск сервера](#запуск-сервера)
    - [Создание миграций](#создание-миграций)
    - [Применение миграций](#применение-миграций)
    - [Проверка миграций](#проверка-миграций)
    - [Создание суперпользователя](#создание-суперпользователя)
    - [Изменение пароля пользователя](#изменение-пароля-пользователя)
    - [Django shell](#django-shell)
    - [Сбор статических файлов](#сбор-статических-файлов)
  - [7.2. Frontend](#72-frontend)
    - [Установка зависимостей](#установка-зависимостей)
    - [Запуск dev-сервера](#запуск-dev-сервера)
    - [Сборка frontend](#сборка-frontend)
    - [Предпросмотр production-сборки](#предпросмотр-production-сборки)
  - [8. Возможные проблемы](#8-возможные-проблемы)
    - [8.1. Ошибка подключения к PostgreSQL](#81-ошибка-подключения-к-postgresql)
    - [8.2. Ошибка database does not exist](#82-ошибка-database-does-not-exist)
    - [8.3. Ошибка password authentication failed](#83-ошибка-password-authentication-failed)
    - [8.4. Ошибка CORS](#84-ошибка-cors)
    - [8.5. Публичная ссылка открывается на `127.0.0.1:8000`](#85-публичная-ссылка-открывается-на-1270018000)
    - [8.6. Ошибка TemplateDoesNotExist: index.html](#86-ошибка-templatedoesnotexist-indexhtml)
    - [8.7. Администратор не создался](#87-администратор-не-создался)
    - [8.8. Пересоздание базы данных](#88-пересоздание-базы-данных)
    - [Windows/Linux/macOS через psql](#windowslinuxmacos-через-psql)
  - [9. Лицензия](#9-лицензия)

---

## 1. Описание

**_Graduate Work - "Cloud File Storage"_** — это веб-приложение облачного файлового хранилища.

Приложение позволяет пользователям регистрироваться, входить в систему, загружать файлы, скачивать их, переименовывать, изменять комментарии, удалять файлы и получать публичные ссылки на скачивание.

Для пользователей с признаком администратора доступна отдельная административная панель, позволяющая управлять пользователями и их файловыми хранилищами.

---

## 1.1. Основные возможности

### Для всех пользователей

- регистрация;
- вход и выход из системы;
- просмотр своего файлового хранилища;
- сортировка файлов по выбранному полю;
- загрузка файлов с комментарием через проводник;
- drag-and-drop загрузку файлов;
- предпросмотр файлов средствами браузера;
- скачивание файлов;
- переименование файлов;
- изменение комментария;
- удаление файлов;
- получение публичной обезличенной ссылки на файл;
- подтверждение скачивания публичного файла через отдельную страницу.

### Для администратора

- вход через отдельный интерфейс администратора;
- просмотр списка пользователей;
- просмотр признака администратора;
- изменение признака администратора;
- удаление пользователей;
- просмотр количества файлов пользователя;
- сортировка пользователей по выбранному полю;
- просмотр общего размера файлов пользователя;
- переход в хранилище любого пользователя;
- управление файлами любого пользователя.

---

## 1.2. Стек технологий

### Backend

- Python 3.10+
- Django 5.x
- Django REST Framework
- PostgreSQL
- django-cors-headers
- python-dotenv
- gunicorn
- whitenoise

### Frontend

- Node.js 18+
- npm
- React 18+
- Redux Toolkit
- React Router
- Vite

---

## 1.3. Backend-приложения

### `accounts`

Отвечает за:

- модель пользователя;
- регистрацию;
- вход;
- выход;
- получение текущего пользователя;
- административный список пользователей;
- удаление пользователей;
- изменение признака администратора;
- автоматическое создание администратора через миграцию.

### `storage_app`

Отвечает за:

- хранение информации о файлах;
- загрузку файлов;
- скачивание файлов;
- удаление файлов;
- переименование файлов;
- изменение комментариев;
- генерацию публичных ссылок;
- получение информации о публичном файле;
- подтверждённое скачивание публичного файла.

---

## 1.4. Frontend

Frontend реализован как SPA-приложение.

Основные страницы:

- `/` — главная страница;
- `/register` — регистрация;
- `/login` — вход пользователя;
- `/login/admin` — вход администратора;
- `/storage` — хранилище текущего пользователя;
- `/storage/:userId` — хранилище пользователя для администратора;
- `/admin` — административная панель;
- `/public/:token` — страница подтверждения скачивания публичного файла.

---

## 2. Установка

## 2.1. Системные требования

Перед установкой убедитесь, что установлены:

- Git;
- Python 3.10 или выше;
- Venv;
- PostgreSQL;
- Node.js 18 или выше;
- npm.

Проверка версий:

```bash
git --version 
python --version  
node --version  
npm --version  
psql --version
```

## 2.2. Клонирование проекта с GitHub

Откройте консоль и перейдите в папку, где хотите разместить проект.

### Windows PowerShell

```bash
cd C:\...\...\YUOR_FILE
git clone [https://github.com/SadliyVI/GW_cloud_file_storage.git]
cd GW_cloud_file_storage
```

### Linux/macOS

```bash
cd ~\...\...\YUOR_FILE
git clone [https://github.com/SadliyVI/GW_cloud_file_storage.git]
cd GW_cloud_file_storage
```

## 2.3. Настройка PostgreSQL

Проект использует СУБД **_PostgreSQL_**.  
По умолчанию в инструкции используется база данных:  **_gw_cloud_storage_**.  
Пользователь: **_postgres_**  
Пароль: **_geonav_**  
Если у вас другие данные PostgreSQL, укажите их в файле **_backend/.env_**.

### 2.3.1. Создание базы данных на Windows

Откройте PowerShell или терминал PostgreSQL и подключитесь к PostgreSQL:

```bash
psql -U postgres
```

Создайте базу данных:

```bash
CREATE DATABASE gw_cloud_storage
```

Выйдите из psql:

```bash
\q
```

### 2.3.2. Создание базы данных на Linux

Откройте терминал и подключитесь к PostgreSQL:

```bash
sudo -u postgres psql
```

Создайте базу данных:

```bash
CREATE DATABASE gw_cloud_storage
```

Выйдите из psql:

```bash
\q
```

### 2.3.3. Создание базы данных на macOS

Если PostgreSQL установлен через Homebrew:  
Откройте терминал и подключитесь к PostgreSQL:

```bash
brew services start postgresqlpsql postgres
```

Создайте базу данных:

```bash
CREATE DATABASE gw_cloud_storage
```

Выйдите из psql:

```bash
\q
```

## 2.4. Установка backend на Windows

Откройте терминал и перейдите в папку **backend**:

```bash
cd backend
```

Создайте виртуальное окружение:

```bash
python -m venv venv
```

Активируйте виртуальное окружение:

```bash
.\venv\Scripts\activate
```

Обновите pip:

```bash
python -m pip install --upgrade pip
```

Установите зависимости:

```bash
pip install -r requirements.txt
```

Создайте файл .env в корне папки **backend**:

```bash
copy .env.example .env
```

Если файла .env.example нет, создайте файл вручную:

```bash
New-Item .env
```

Пример содержимого файла _`backend/.env`_:

```bash
DJANGO_SETTINGS_MODULE=cloud_storage.settings.dev
SECRET_KEY=local-dev-secret
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
DB_NAME=gw_cloud_storage
DB_USER=postgres
DB_PASSWORD=postgres
## DB_HOST=127.0.0.1
## DB_PORT=5432
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
FILE_STORAGE_ROOT=media/user_files
FRONTEND_URL=http://127.0.0.1:5173
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_FULL_NAME=System Administrator
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=Admin123!
```

Выполните миграции:

```bash
python manage.py migrate
```

Запустите backend:

```bash
python manage.py runserver
```

Backend будет доступен по адресу:

[http://127.0.0.1:8000](http://127.0.0.1:8000)  

## 2.5. Установка backend на Linux/macOS

Перейдите в папку backend:

```bash
cd backend
```

Создайте виртуальное окружение:

```bash
python3 -m venv venv
```

Активируйте виртуальное окружение:

```bash
source venv/bin/activate
```

Обновите pip:

```bash
python -m pip install --upgrade pip
```

Установите зависимости:

```bash
pip install -r requirements.txt
```

Создайте файл .env в корне папки **backend**:

```bash
cp .env.example .env
```

Если файла `.env.example` нет, создайте `.env` вручную:

```bash
touch .env
```

Пример содержимого файла **backend/.env** см. выше.

Выполните миграции:

```bash
python manage.py migrate
```

Запустите backend:

```bash
python manage.py runserver
```

Backend будет доступен по адресу:

[http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 2.6. Установка frontend на Windows/Linux/macOS

Откройте новый терминал.

Из корня проекта перейдите в папку frontend:

```bash
cd frontend
```

Установите зависимости:

```bash
npm install
```

Запустите frontend в режиме разработки:

```bash
npm run dev
```

Frontend будет доступен по адресу:

[http://127.0.0.1:5173](http://127.0.0.1:5173)

или:

[http://localhost:5173](http://localhost:5173)

---

## 2.7. Запуск проекта в режиме разработки

Для разработки нужно запустить два сервера.

### Терминал 1 — backend

#### Запуск в Windows

```powershell
cd backend
.\venv\Scripts\activate
python manage.py runserver
```

#### Запук в Linux/macOS

```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

Backend:

[http://127.0.0.1:8000](http://127.0.0.1:8000)

### Терминал 2 — frontend

#### Windows/Linux/macOS

```bash
cd frontend
npm run dev
```

Frontend:

[http://127.0.0.1:5173](http://127.0.0.1:5173)

### Проверка

Откройте в браузере:

[http://127.0.0.1:5173](http://127.0.0.1:5173)

Вы должны увидеть главную страницу приложения.

---

## 2.8. Сборка frontend и запуск через Django

Этот способ нужен, если требуется запускать проект через один Django-сервер.

### 2.8.1. Сборка frontend

Из папки frontend выполните:

```bash
npm run build
```

После сборки появится папка:

```text
frontend/dist
```

### 2.8.2. Настройка backend для production

В файле _`backend/.env`_ можно указать:

```env
DJANGO_SETTINGS_MODULE=cloud_storage.settings.prod
DEBUG=False
SECRET_KEY=your-production-secret-key
ALLOWED_HOSTS=127.0.0.1,localhost,your-domain.ru
DB_NAME=gw_cloud_storage
DB_USER=postgres
DB_PASSWORD=postgres
CORS_ALLOWED_ORIGINS=https://your-domain.ru
FILE_STORAGE_ROOT=media/user_files
FRONTEND_URL=https://your-domain.ru
```

### 2.8.3. Сбор статических файлов Django

Из папки backend:

```bash
python manage.py collectstatic
```

Если будет запрос подтверждения, введите:

```text
yes
```

### 2.8.4. Применение миграций

```bash
python manage.py migrate
```

### 2.8.5. Запуск через Django

```bash
python manage.py runserver
```

После этого приложение может быть доступно через backend:

[http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 3. Конфигурация

Основная конфигурация backend хранится в файле:

```text
backend/.env
```

Пример:

```env
DJANGO_SETTINGS_MODULE=cloud_storage.settings.dev
SECRET_KEY=local-dev-secret
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
DB_NAME=gw_cloud_storage
DB_USER=postgres
DB_PASSWORD=postgres
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
FILE_STORAGE_ROOT=media/user_files
FRONTEND_URL=http://127.0.0.1:5173
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_FULL_NAME=System Administrator
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=Admin123!
```

---

## 3.1. Описание переменных окружения

| Переменная | Описание |
| --- | --- |
| `DJANGO_SETTINGS_MODULE` | Модуль настроек Django |
| `SECRET_KEY` | Секретный ключ Django |
| `DEBUG` | Режим отладки |
| `ALLOWED_HOSTS` | Разрешённые хосты |
| `DB_NAME` | Имя базы данных PostgreSQL |
| `DB_USER` | Пользователь PostgreSQL |
| `DB_PASSWORD` | Пароль PostgreSQL |
| `DB_HOST` | Хост PostgreSQL |
| `DB_PORT` | Порт PostgreSQL |
| `CORS_ALLOWED_ORIGINS` | Разрешённые источники для frontend |
| `FILE_STORAGE_ROOT` | Папка хранения файлов пользователей |
| `FRONTEND_URL` | Адрес frontend для публичных ссылок |
| `DEFAULT_ADMIN_USERNAME` | Логин администратора по умолчанию |
| `DEFAULT_ADMIN_FULL_NAME` | Полное имя администратора |
| `DEFAULT_ADMIN_EMAIL` | Email администратора |
| `DEFAULT_ADMIN_PASSWORD` | Пароль администратора |

---

## 4. Структура проекта

```text
├─ backend
│  ├─ accounts
│  │  ├─ admin.py
│  │  ├─ apps.py
│  │  ├─ migrations
│  │  │  ├─ 0001_initial.py
│  │  │  ├─ 0002_create_default_admin.py
│  │  │  └─ __init__.py
│  │  ├─ models.py
│  │  ├─ serializers.py
│  │  ├─ urls.py
│  │  ├─ validators.py
│  │  └─ views.py
│  ├─ cloud_storage
│  │  ├─ asgi.py
│  │  ├─ settings
│  │  │  ├─ base.py
│  │  │  ├─ dev.py
│  │  │  ├─ prod.py
│  │  │  └─ __init__.py
│  │  ├─ urls.py
│  │  ├─ wsgi.py
│  │  └─ __init__.py
│  ├─ manage.py
│  ├─ requirements.txt
│  └─ storage_app
│     ├─ admin.py
│     ├─ apps.py
│     ├─ migrations
│     │  ├─ 0001_initial.py
│     │  └─ __init__.py
│     ├─ models.py
│     ├─ serializers.py
│     ├─ urls.py
│     ├─ utils.py
│     └─ views.py
├─ frontend
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ src
│  │  ├─ api
│  │  │  └─ client.js
│  │  ├─ app
│  │  │  └─ store.js
│  │  ├─ App.jsx
│  │  ├─ components
│  │  │  ├─ AdminRoute.jsx
│  │  │  ├─ FieldTooltip.jsx
│  │  │  ├─ FormAlert.jsx
│  │  │  ├─ Navbar.jsx
│  │  │  ├─ PasswordGenerator.jsx
│  │  │  └─ ProtectedRoute.jsx
│  │  ├─ features
│  │  │  ├─ auth
│  │  │  │  └─ authSlice.js
│  │  │  ├─ files
│  │  │  │  └─ filesSlice.js
│  │  │  └─ users
│  │  │     └─ usersSlice.js
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ AdminPage.jsx
│  │  │  ├─ HomePage.jsx
│  │  │  ├─ LoginPage.jsx
│  │  │  ├─ NotFoundPage.jsx
│  │  │  ├─ PublicDownloadPage.jsx
│  │  │  ├─ RegisterPage.jsx
│  │  │  └─ StoragePage.jsx
│  │  ├─ styles
│  │  │  └─ main.css
│  │  └─ utils
│  │     └─ errors.js
│  └─ vite.config.js
└─ README.md
```

---

## 5. Основные маршруты приложения

## 5.1. Frontend

| Маршрут | Описание |
| --- | --- |
| `/` | Главная страница |
| `/register` | Регистрация пользователя |
| `/login` | Вход пользователя |
| `/login/admin` | Вход администратора |
| `/storage` | Файловое хранилище текущего пользователя |
| `/storage/:userId` | Файловое хранилище выбранного пользователя для администратора |
| `/admin` | Административная панель |
| `/public/:token` | Страница подтверждения скачивания публичного файла |

---

## 5.2. Backend API

| Метод | URL | Описание |
| --- | --- | --- |
| `GET` | `/api/csrf/` | Получение CSRF-cookie |
| `POST` | `/api/auth/register/` | Регистрация |
| `POST` | `/api/auth/login/` | Вход |
| `POST` | `/api/auth/logout/` | Выход |
| `GET` | `/api/auth/me/` | Текущий пользователь |
| `GET` | `/api/auth/users/` | Список пользователей для администратора |
| `PATCH` | `/api/auth/users/<user_id>/admin/` | Изменение признака администратора |
| `DELETE` | `/api/auth/users/<user_id>/` | Удаление пользователя |
| `GET` | `/api/storage/files/` | Список файлов текущего пользователя |
| `POST` | `/api/storage/files/upload/` | Загрузка файла |
| `PATCH` | `/api/storage/files/<file_id>/update/` | Переименование файла или изменение комментария |
| `DELETE` | `/api/storage/files/<file_id>/` | Удаление файла |
| `GET` | `/api/storage/files/<file_id>/download/` | Скачивание файла |
| `GET` | `/api/storage/public/<token>/` | Информация о публичном файле |
| `GET` | `/api/storage/public/<token>/download/` | Скачивание публичного файла |

---

## 6. Учётная запись администратора

Администратор создаётся автоматически миграцией:

```text
backend/accounts/migrations/0002_create_default_admin.py
```

Данные администратора берутся из файла:

```text
backend/.env
```

Пример:

```env
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_FULL_NAME=System Administrator
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=Admin123!
```

После выполнения миграций:

```bash
python manage.py migrate
```

можно войти как администратор:

```text
Логин: admin
Пароль: Admin123!
```

Административный вход:

[http://127.0.0.1:5173/login/admin](http://127.0.0.1:5173/login/admin)

---

## 6.1. Изменение пароля администратора

### Изменение пароля в Windows/Linux/macOS

Из папки backend:

```bash
python manage.py changepassword admin
```

где _`admin`_ — логин администратора.

---

## 6.2. Создание администратора вручную

Если нужно создать дополнительного администратора:

```bash
python manage.py createsuperuser
```

---

## 7. Полезные команды

## 7.1. Backend

### Активация виртуального окружения

Windows:

```powershell
.\venv\Scripts\activate
```

Linux/macOS:

```bash
source venv/bin/activate
```

### Запуск сервера

```bash
python manage.py runserver
```

### Создание миграций

```bash
python manage.py makemigrations
```

### Применение миграций

```bash
python manage.py migrate
```

### Проверка миграций

```bash
python manage.py showmigrations
```

### Создание суперпользователя

```bash
python manage.py createsuperuser
```

### Изменение пароля пользователя

```bash
python manage.py changepassword username
```

### Django shell

```bash
python manage.py shell
```

### Сбор статических файлов

```bash
python manage.py collectstatic
```

---

## 7.2. Frontend

Перейти в папку frontend:

```bash
cd frontend
```

### Установка зависимостей

```bash
npm install
```

### Запуск dev-сервера

```bash
npm run dev
```

### Сборка frontend

```bash
npm run build
```

### Предпросмотр production-сборки

```bash
npm run preview
```

---

## 8. Возможные проблемы

### 8.1. Ошибка подключения к PostgreSQL

Проверьте:

- запущен ли PostgreSQL;
- создана ли база данных;
- верны ли данные в _`backend/.env`_.

Проверка подключения:

```bash
psql -U postgres -d gw_cloud_storage
```

---

### 8.2. Ошибка database does not exist

Создайте базу данных:

```sql
CREATE DATABASE gw_cloud_storage;
```

---

### 8.3. Ошибка password authentication failed

Проверьте переменную:

```env
DB_PASSWORD=postgres
```

Если у пользователя PostgreSQL другой пароль, укажите его.

---

### 8.4. Ошибка CORS

Проверьте переменную:

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

После изменения _`.env`_ перезапустите backend.

---

### 8.5. Публичная ссылка открывается на `127.0.0.1:8000`

Если публичная ссылка открывается на адресе 127.0.0.1:8000, а не на 127.0.0.1:5173, проверьте переменную:

```env
FRONTEND_URL=http://127.0.0.1:5173
```

После изменения _`.env`_ перезапустите backend.

---

### 8.6. Ошибка TemplateDoesNotExist: index.html

В режиме разработки открывайте frontend по адресу:

[http://127.0.0.1:5173](http://127.0.0.1:5173)

Если хотите открывать приложение через backend:

[http://127.0.0.1:8000](http://127.0.0.1:8000)

сначала соберите frontend:

```bash
cd frontend
npm run build
```

---

### 8.7. Администратор не создался

Проверьте миграции:

```bash
python manage.py showmigrations accounts
```

Должно быть:

```text
[X] 0001_initial
[X] 0002_create_default_admin
```

Если миграция ещё не применена:

```bash
python manage.py migrate
```

---

### 8.8. Пересоздание базы данных

> Внимание: команда удалит все данные.

### Windows/Linux/macOS через psql

```bash
psql -U postgres
```

```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'gw_cloud_storage';

DROP DATABASE IF EXISTS gw_cloud_storage;

CREATE DATABASE gw_cloud_storage;

\q
```

Затем:

```bash
python manage.py migrate
```

---

## 9. Лицензия

MIT License

Copyright (c) 2026 by Sadliy Vasiliy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files, to deal in the Software
without restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software.
