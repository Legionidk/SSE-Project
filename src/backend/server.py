import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware, allow_origins=["http://localhost:5173"], allow_methods=["*"]
)


async def task_progress_generator():
    for progress in [0, 20, 40, 60, 80, 100]:
        yield {"event": "progress", "data": progress}

        await asyncio.sleep(1)

    yield {"event": "complete", "data": "Задача завершена"}


@app.get("/stream/")
async def stream():
    return EventSourceResponse(task_progress_generator())


@app.get("/")
async def stream():
    return {"message": "I'm alive!"}
