from contextlib import asynccontextmanager

from fastapi import FastAPI
import uvicorn

from api import router as api_router
from core.config import settings
from core.models import db_helper


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    yield
    # shutdown
    print("dispose engine")
    await db_helper.dispose()

app = FastAPI(
    lifespan=lifespan,
)
app.include_router(
    api_router,
    prefix=settings.api.prefix,
)


if __name__ == '__main__':
    uvicorn.run(
        "main:app",
        host=settings.run.host,
        port=settings.run.port,
        reload=True
    )
