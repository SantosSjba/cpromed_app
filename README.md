# CPROMED App

Aplicación Laravel con Inertia.js y React.

## Requisitos

- **PHP** 8.2 o superior
- **Composer**
- **Node.js** (v18 o superior recomendado) y **npm**
- **Extensiones PHP**: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML

## Instalación

### 1. Clonar el repositorio (si aplica)

```bash
git clone <url-del-repositorio>
cd cpromed_app
```

### 2. Instalar dependencias PHP

```bash
composer install
```

### 3. Configurar entorno

```bash
# Copiar archivo de ejemplo (si no existe .env)
copy .env.example .env

# Generar clave de aplicación
php artisan key:generate
```

### 4. Base de datos

Por defecto la aplicación usa **SQLite**. Crear el archivo de base de datos y ejecutar migraciones:

```bash
# Crear base de datos SQLite (si no existe)
type nul > database\database.sqlite

# Ejecutar migraciones
php artisan migrate
```

Para usar **MySQL**, descomentar y configurar las variables `DB_*` en `.env` y luego ejecutar `php artisan migrate`.

### 5. Instalar dependencias de frontend

```bash
npm install
```

### 6. Compilar assets (producción)

```bash
npm run build
```

---

## Instalación rápida (todo en uno)

Si quieres instalar dependencias, copiar `.env`, generar clave y migrar en un solo paso:

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
npm install
npm run build
```

O usar el script de setup del proyecto (instala todo y compila):

```bash
composer run setup
```

---

## Ejecutar la aplicación

### Desarrollo (recomendado)

Inicia servidor PHP, cola de trabajos y Vite en paralelo:

```bash
composer run dev
```

O por separado en dos terminales:

**Terminal 1 – Servidor y cola:**

```bash
php artisan serve
```

**Terminal 2 – Frontend (Vite):**

```bash
npm run dev
```

La aplicación estará disponible en **http://localhost:8000** (o el puerto que indique `php artisan serve`).

### Producción

1. Compilar assets: `npm run build`
2. Servir la aplicación con el servidor web configurado (Apache/Nginx) o:

```bash
php artisan serve
```

---

## Comandos útiles

| Comando | Descripción |
|--------|-------------|
| `composer run dev` | Servidor + cola + Vite en desarrollo |
| `composer run setup` | Instalación completa (composer, .env, key, migrate, npm, build) |
| `php artisan serve` | Solo servidor PHP |
| `npm run dev` | Solo Vite (hot reload) |
| `npm run build` | Compilar assets para producción |
| `php artisan migrate` | Ejecutar migraciones |
| `php artisan test` | Ejecutar tests |
| `vendor/bin/pint` | Formatear código PHP |

---

## Variables de entorno relevantes

- **APP_URL**: URL pública de la app (ej. `http://localhost:8000`).
- **DB_***: Conexión a base de datos (por defecto SQLite; ver `.env.example` para MySQL).
