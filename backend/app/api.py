from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel 
from backend.model import predict

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]
app.add_middleware(
    CORSMiddleware, 
    allow_origins=origins, 
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/test", tags=["root"])
async def read_root(): 
    return {"message": "Welcome"}


class GameInfoIn(BaseModel):
    cash: float 
    stock: int 
    buy_price: float 
    sell_price: float

class GameInfoOut(GameInfoIn):
    action: int  

@app.post("/predict", response_model=GameInfoOut, status_code=200)
async def get_observation(payload: GameInfoIn):
    data = await payload.json()
    print(data)
    return {"action": "message received"}
    cash = payload.cash 
    stock = payload.stock 
    buy_price = payload.buy_price
    sell_price = payload.sell_price
    observation = {cash: cash, stock: stock, buy_price: buy_price, sell_price: sell_price}
    return predict(observation)

