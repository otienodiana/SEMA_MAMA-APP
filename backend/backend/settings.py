CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_METHODS = [
    "GET",
    "POST",
    "PUT",
    "PATCH", 
    "DELETE",
    "OPTIONS"
]

INSTALLED_APPS = [
    # ...existing code...
    'mama.apps.MamaConfig',
    'debug_toolbar',
]

AUTH_USER_MODEL = 'mama.CustomUser'

# Debug Toolbar Settings
INTERNAL_IPS = [
    "127.0.0.1",
]

DEBUG_TOOLBAR_CONFIG = {
    'SHOW_TOOLBAR_CALLBACK': lambda request: True,
}

MIDDLEWARE = [
    # ...existing middleware...
    'debug_toolbar.middleware.DebugToolbarMiddleware',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ] if not DEBUG else [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'mama': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
