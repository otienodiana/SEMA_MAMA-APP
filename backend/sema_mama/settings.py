"""
Django settings for sema_mama project.

Generated by 'django-admin startproject' using Django 4.2.19.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
from datetime import timedelta
import os
from django.conf.urls.static import static



# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-y^ptm_l)$uk3)exhoe0!ui#$a20l_dmdk6^icv^yzr9fq=twk!'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DJANGO_DEBUG', 'False') == 'True'

ALLOWED_HOSTS = [
    "sema-mama-app.onrender.com",
    "sema-react-app.vercel.app",
    "localhost",
    "127.0.0.1",
    "*"  # Temporarily allow all hosts for testing
]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
    'debug_toolbar',
    
    # Custom apps in dependency order
    'users',
    'mama.apps.MamaConfig',
    'content',
    'analytics',
    'appointments',
    'community',
    'educational.apps.EducationalConfig',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',  # Temporarily allow all for debugging
    ),
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'ALGORITHM': 'HS256',
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
}

MIDDLEWARE = ['corsheaders.middleware.CorsMiddleware'] + [
    m for m in [
        'corsheaders.middleware.CorsMiddleware',
        'debug_toolbar.middleware.DebugToolbarMiddleware',
        'django.middleware.security.SecurityMiddleware',
        'django.contrib.sessions.middleware.SessionMiddleware',
        'django.middleware.common.CommonMiddleware',
        'django.middleware.locale.LocaleMiddleware',
        'django.middleware.common.CommonMiddleware',
        'django.middleware.csrf.CsrfViewMiddleware',
        'django.contrib.auth.middleware.AuthenticationMiddleware',
        'django.contrib.messages.middleware.MessageMiddleware',
        'django.middleware.clickjacking.XFrameOptionsMiddleware',
    ] if m != 'corsheaders.middleware.CorsMiddleware'
]

ROOT_URLCONF = 'sema_mama.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'),
            os.path.join(BASE_DIR, 'venv/lib/python3.12/site-packages/rest_framework/templates'),
        ],
        'APP_DIRS': True,  # This will look for templates in app directories
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.i18n',
            ],
        },
    },
]

WSGI_APPLICATION = 'sema_mama.wsgi.application'

#ASGI_APPLICATION = "sema_mama.asgi.application"

# Redis for real-time message storage
# CHANNEL_LAYERS = {
#     "default": {
#         "BACKEND": "channels.layers.RedisChannelLayer",
#         "CONFIG": {
#             "hosts": [("127.0.0.1", 6379)],  # Local Redis server
#         },
#     }
# }

# Database Configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME', 'sema_mama_db'),
        'USER': os.getenv('DB_USER', 'root'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'Root123!'),
        'HOST': os.getenv('DB_HOST', '34.16.6.244'),  # Use your Google Cloud SQL IP
        'PORT': os.getenv('DB_PORT', '3306'),
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            'connect_timeout': 60,
            'ssl': {
                'ca': os.path.join(BASE_DIR, 'ssl', 'server-ca.pem'),
                'cert': os.path.join(BASE_DIR, 'ssl', 'client-cert.pem'),
                'key': os.path.join(BASE_DIR, 'ssl', 'client-key.pem')
            }
        }
    }
}

# Ensure SSL directory exists
ssl_dir = os.path.join(BASE_DIR, 'ssl')
if not os.path.exists(ssl_dir):
    os.makedirs(ssl_dir)

# Debug Mode
DEBUG = os.getenv('DJANGO_DEBUG') == 'True'
# Database Configuration


# Simplified CORS settings
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = False

CORS_ALLOWED_ORIGINS = [
    "https://sema-react-app.vercel.app",
    "https://sema-react-q5w7t5cy2-otienodianas-projects.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CSRF_TRUSTED_ORIGINS = [
    "https://sema-react-app.vercel.app",
    "https://sema-react-q5w7t5cy2-otienodianas-projects.vercel.app",
]

CORS_ALLOW_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']

CORS_ALLOW_HEADERS = ['*']

# Security settings for production
SECURE_SSL_REDIRECT = False  # Set to True only if SSL is properly configured
SECURE_PROXY_SSL_HEADER = None  # Remove this if not using proper SSL
SESSION_COOKIE_SECURE = False  # Set to True only with proper SSL
CSRF_COOKIE_SECURE = False  # Set to True only with proper SSL


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


AUTH_USER_MODEL = 'users.User'  # Ensure this line exists

# Static and Media files configuration
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = '/media/'  # Add leading slash
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Ensure media directories exist
os.makedirs(MEDIA_ROOT, exist_ok=True)
PROFILE_PHOTOS_DIR = os.path.join(MEDIA_ROOT, 'profile_photos')
os.makedirs(PROFILE_PHOTOS_DIR, exist_ok=True)

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Internationalization settings
LANGUAGE_CODE = 'en'

LANGUAGES = [
    ('en', 'English'),
    ('sw', 'Swahili'),
    ('fr', 'French'),
]

# Update locale paths to be simpler
LOCALE_PATHS = [
    BASE_DIR / 'locale',
]

# Test Runner Configuration
TEST_RUNNER = 'sema_mama.test_runner.CategoryTestRunner'

INTERNAL_IPS = [
    '127.0.0.1',
    'localhost',
]

# Add detailed logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}

# Watchman settings for development
if DEBUG:
    import sys
    if sys.platform == 'win32':
        import asyncio
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# File watcher settings
USE_WATCHMAN = False  # Disable watchman if causing issues
WATCHMAN_ENABLE_PAID_FEATURES = False

# Add file watcher configuration
FILE_UPLOAD_HANDLERS = [
    'django.core.files.uploadhandler.MemoryFileUploadHandler',
    'django.core.files.uploadhandler.TemporaryFileUploadHandler',
]

# Development settings
if DEBUG:
    import sys
    import asyncio
    
    # Configure asyncio for Windows
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

    # File watcher settings
    USE_WATCHMAN = False
    WATCHMAN_ENABLE_PAID_FEATURES = False
    FILE_WATCHER = 'django.utils.autoreload.StatReloader'
    FILE_WATCHER_INTERVAL = 1  # seconds

    # Auto-reload settings
    AUTORELOAD_ENABLED = True
    AUTORELOAD_PATTERNS = [
        '*.py',
        '*.html',
        '*.js',
        '*.css',
    ]
    AUTORELOAD_IGNORE_PATTERNS = [
        '*/migrations/*.py',
        '*/node_modules/*',
        '*/venv/*',
        '*.pyc',
    ]

    DEBUG_TOOLBAR_CONFIG = {
        'SHOW_TOOLBAR_CALLBACK': lambda request: DEBUG,
        'RESULTS_CACHE_SIZE': 100,
        'RENDER_PANELS': True,
        'SQL_WARNING_THRESHOLD': 100,
    }

# Remove duplicate settings
USE_WATCHMAN = False
WATCHMAN_ENABLE_PAID_FEATURES = False

# Clean up duplicate settings
if 'debug_toolbar.middleware.DebugToolbarMiddleware' in MIDDLEWARE:
    MIDDLEWARE = list(dict.fromkeys(MIDDLEWARE))

# Add template loaders explicitly
TEMPLATE_LOADERS = None  # Remove this since it's defined in TEMPLATES

def show_toolbar(request):
    return DEBUG

DEBUG_TOOLBAR_CONFIG = {
    'SHOW_TOOLBAR_CALLBACK': lambda request: DEBUG,
    'RENDER_PANELS': True,
    'SQL_WARNING_THRESHOLD': 100,
    'RESULTS_CACHE_SIZE': 100,
    'SHOW_TEMPLATE_CONTEXT': True,
    'EXTRA_SIGNALS': [],
    'ENABLE_STACKTRACES': True,
    'HIDE_IN_STACKTRACES': (
        'django.middleware',
        'django.template',
        'debug_toolbar',
    ),
}

# Clean up settings - remove redundant/duplicate settings
TEMPLATE_LOADERS = None  # Remove this since it's defined in TEMPLATES
USE_WATCHMAN = False
WATCHMAN_ENABLE_PAID_FEATURES = False

if 'debug_toolbar.middleware.DebugToolbarMiddleware' in MIDDLEWARE:
    MIDDLEWARE = list(dict.fromkeys(MIDDLEWARE))
