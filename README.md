# Graduate Work - "Cloud File Storage"

Веб-приложение облачного файлового хранилища.

Проект реализован как единый монорепозиторий и содержит:

* **_backend_** на Python/Django;
* REST API на Django REST Framework;
* PostgreSQL в качестве СУБД;
* **_frontend_** на React, Redux Toolkit, React Router;
* сборку frontend через npm и Vite;
* публикацию собранного SPA через единый Django-сервер.

---

## Оглавление

- [Graduate Work - "Cloud File Storage"](#graduate-work---cloud-file-storage)
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

---

## 1. Описание

**_Graduate Work - "Cloud File Storage"_** — это веб-приложение облачного файлового хранилища.

Приложение позволяет пользователям регистрироваться, входить в систему, загружать файлы, скачивать их, переименовывать, изменять комментарии, удалять файлы и получать публичные ссылки на скачивание.

Для пользователей с признаком администратора доступна отдельная административная панель, позволяющая управлять пользователями и их файловыми хранилищами.

---

## 1.1. Основные возможности

### Для всех пользователей

* регистрация;
* вход и выход из системы;
* просмотр своего файлового хранилища;
* загрузка файлов с комментарием;
* скачивание файлов;
* переименование файлов;
* изменение комментария;
* удаление файлов;
* получение публичной обезличенной ссылки на файл;
* подтверждение скачивания публичного файла через отдельную страницу.

### Для администратора

* вход через отдельный интерфейс администратора;
* просмотр списка пользователей;
* просмотр признака администратора;
* изменение признака администратора;
* удаление пользователей;
* просмотр количества файлов пользователя;
* просмотр общего размера файлов пользователя;
* переход в хранилище любого пользователя;
* управление файлами любого пользователя.

---

## 1.2. Стек технологий

### Backend

* Python 3.10+
* Django 5.x
* Django REST Framework
* PostgreSQL
* django-cors-headers
* python-dotenv
* gunicorn
* whitenoise

### Frontend

* Node.js 18+
* npm
* React 18+
* Redux Toolkit
* React Router
* Vite

---

## 1.3. Backend-приложения

### `accounts`

Отвечает за:

* модель пользователя;
* регистрацию;
* вход;
* выход;
* получение текущего пользователя;
* административный список пользователей;
* удаление пользователей;
* изменение признака администратора;
* автоматическое создание администратора через миграцию.

### `storage_app`

Отвечает за:

* хранение информации о файлах;
* загрузку файлов;
* скачивание файлов;
* удаление файлов;
* переименование файлов;
* изменение комментариев;
* генерацию публичных ссылок;
* получение информации о публичном файле;
* подтверждённое скачивание публичного файла.

---

## 1.4. Frontend

Frontend реализован как SPA-приложение.

Основные страницы:

* `/` — главная страница;
* `/register` — регистрация;
* `/login` — вход пользователя;
* `/login/admin` — вход администратора;
* `/storage` — хранилище текущего пользователя;
* `/storage/:userId` — хранилище пользователя для администратора;
* `/admin` — административная панель;
* `/public/:token` — страница подтверждения скачивания публичного файла.

---

## 2. Установка

## 2.1. Системные требования

Перед установкой убедитесь, что установлены:

* Git;
* Python 3.10 или выше;
* PostgreSQL;
* Node.js 18 или выше;
* npm.

Проверка версий:

`git --version`  
`python --version`  
`node --version`  
`npm --version`  
`psql --version`

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

Откройте PowerShell или терминал PostgreSQL и подключитесь к PostgreSQL: _`psql -U postgres`_  
Создайте базу данных: _`CREATE DATABASE gw_cloud_storage`_  
Выйдите из psql: _`\q`_

### 2.3.2. Создание базы данных на Linux

Откройте терминал и подключитесь к PostgreSQL: _`sudo -u postgres psql`_  
Создайте базу данных: _`CREATE DATABASE gw_cloud_storage`_  
Выйдите из psql: _`\q`_

### 2.3.3. Создание базы данных на macOS

Если PostgreSQL установлен через Homebrew:  
Откройте терминал и подключитесь к PostgreSQL: _`brew services start postgresqlpsql postgres`  
Создайте базу данных: _`CREATE DATABASE gw_cloud_storage`_  
Выйдите из psql: _`\q`_

## 2.4. Установка backend на Windows

Откройте терминал и перейдите в папку **backend**: _`cd backend`_  
Создайте виртуальное окружение: _`python -m venv venv`_  
Активируйте виртуальное окружение: _`.\venv\Scripts\activate`_  
Обновите pip: _`python -m pip install --upgrade pip`_  
Установите зависимости: _`pip install -r requirements.txt`_  
Создайте файл .env в корне папки **backend**: _`copy .env.example .env`_  
Если файла .env.example нет, создайте файл вручную: _`New-Item .env`_  
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


python manage.py migrate

Запустите backend:


python manage.py runserver

Backend будет доступен по адресу:


http://127.0.0.1:8000


2.5. Установка backend на Linux/macOS

Перейдите в папку backend:


cd backend

Создайте виртуальное окружение:


python3 -m venv venv

Активируйте виртуальное окружение:


source venv/bin/activate

Обновите pip:


python -m pip install --upgrade pip

Установите зависимости:


pip install -r requirements.txt

Создайте .env:


cp .env.example .env

Если файла .env.example нет, создайте .env вручную:


touch .env

Пример содержимого файла backend/.env: