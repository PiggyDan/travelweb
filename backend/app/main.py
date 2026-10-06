from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import DEV_SECRET_KEY, get_settings
from app.db import Base, engine
from app.routers import admin, public


@asynccontextmanager
async def lifespan(_: FastAPI):
    settings = get_settings()
    if settings.cookie_secure and settings.secret_key == DEV_SECRET_KEY:
        raise RuntimeError("Set SECRET_KEY to a long random value before running in production.")
    # Creates missing tables on start-up. Introduce Alembic migrations before
    # changing columns on a database that already holds real data.
    Base.metadata.create_all(engine)
    yield


app = FastAPI(title="Eternal Sky Tour API", version="1.0.0", lifespan=lifespan)

app.include_router(public.router)
app.include_router(admin.auth_router)
app.include_router(admin.router)


@app.get("/api/health", tags=["meta"])
def health() -> dict[str, str]:
    return {"status": "ok"}
