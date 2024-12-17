class Config:
    SECRET_KEY = 'your_secret_key_here'  # Replace with a strong, secure key
    SQLALCHEMY_DATABASE_URI = 'sqlite:///notes_app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_COOKIE_SECURE = False
