//TODO: disable sell when no stock
//TODO: disable buy when no cash

import { useEffect, useState } from "react";
import "./App.css";

function BuyButton() {}

function App() {
  const TRANSACTION = 0.4;
  const [cash, setCash] = useState(100);
  const [stock, setStock] = useState(0);
  const [buyPrice, setBuyPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [timePeriod, setTimePeriod] = useState(0);

  const handleBuy = () => {
    setCash((cash) => cash - buyPrice - TRANSACTION);
    setStock((stock) => stock + 1);
  };
  const handleSell = () => {
    setCash((cash) => cash + sellPrice - TRANSACTION);
    setStock((stock) => stock - 1);
  };

  const boxMullerTransform = () => {
    const u1 = Math.random();
    const u2 = Math.random();

    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

    return { z0, z1 };
  };

  const getNormallyDistributedRandomNumber = (mean, stddev) => {
    const { z0, _ } = boxMullerTransform();

    return z0 * stddev + mean;
  };

  const updatePrices = () => {
    setTimePeriod((timePeriod) => timePeriod + 1);
    const PERIOD = 100;
    const MINPRICE = 0.5;
    const MAXPRICE = 10;
    let new_buy_price = 2 + Math.sin(2 * Math.PI * (timePeriod / PERIOD));
    new_buy_price += getNormallyDistributedRandomNumber(0, 0.3);
    new_buy_price = Math.min(Math.max(new_buy_price, MINPRICE), MAXPRICE);
    new_buy_price = Math.round(new_buy_price * 100) / 100;

    let new_sell_price =
      new_buy_price +
      Math.max(0.01, getNormallyDistributedRandomNumber(1, 0.3));
    new_sell_price = Math.max(Math.min(MAXPRICE, new_sell_price), MINPRICE);
    new_sell_price = Math.round(new_sell_price * 100) / 100;

    setBuyPrice(new_buy_price);
    setSellPrice(new_sell_price);
  };

  const sendObservation = async () => {
    const observation = {
      cash: cash,
      stock: stock,
      buy_price: buyPrice,
      sell_price: sellPrice,
    };

    const response = await fetch("/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(observation),
    });
    let responseData = response.json();
    //trigger action
    //TODO: get action from responseData
  };

  useEffect(() => {
    updatePrices();
    const priceTimer = setInterval(() => {
      updatePrices();
    }, 3000);
    const serverTimer = setInterval(() => {
      sendObservation();
    }, 1000);
  }, []);

  return (
    <div className="App">
      <div className="Labels">
        <h1>Cash {cash}</h1>
        <h1>Stock {stock}</h1>
        <h2> Buy Price {buyPrice} </h2>
        <h2> Sell Price {sellPrice} </h2>
      </div>
      <div className="Buttons">
        <button onClick={handleBuy}>Buy</button>
        <button onClick={handleSell}>Sell</button>
      </div>
    </div>
  );
}

export default App;
