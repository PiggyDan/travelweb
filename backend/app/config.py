from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


DEV_SECRET_KEY = "dev-only-insecure-secret-change-me-before-deploying"


class Settings(BaseSettings):
    """Runtime configuration, read from environment variables or `backend/.env`."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # SQLite keeps local development dependency-free. In production use Postgres:
    #   postgresql+psycopg://user:password@host:5432/eternal_sky
    database_url: str = "sqlite:///./eternal_sky.db"

    # Signs admin session tokens. MUST be set to a long random value in production.
    secret_key: str = DEV_SECRET_KEY
    admin_session_hours: int = 12

    # Set true when the site is served over HTTPS so cookies are marked Secure.
    cookie_secure: bool = False

    # How long a visitor's chat stays linked to their browser.
    chat_cookie_days: int = 180

    # --- AI chat assistant ---
    assistant_enabled: bool = True
    # Optional here: the Anthropic SDK also reads ANTHROPIC_API_KEY from the environment.
    anthropic_api_key: str | None = None
    assistant_model: str = "claude-opus-5-5"
    # Where the website runs; the assistant reads the tour catalog from {site_url}/catalog.json.
    site_url: str = "http://127.0.0.1:3000"


@lru_cache
def get_settings() -> Settings:
    return Settings()
