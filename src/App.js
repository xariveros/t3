import React, { Component, useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";
import Grafico from "./components/grafico";
import {} from "recharts";

const socket = io("wss://le-18262636.bitzonte.com", {
  path: "/stocks",
  protocols: "wss://",
  transports: ["polling", "websocket"],
});

var stocks = [];
socket.on("STOCKS", (info) => {
  stocks = info;
});
socket.emit("STOCKS", "oli");

var exchanges = [];
socket.on("EXCHANGES", (info) => {
  exchanges = info;
  console.log(exchanges);
});
socket.emit("EXCHANGES", "oli");

const App = () => {
  const [data, setData] = useState([]);
  const [estadisticas, setEstadisticas] = useState([]);
  var informaciones = [{}];
  const [transados, setTransados] = useState([]);
  var aux_transados = [{}];
  var aux_transados2 = [{}];
  const [transados2, setTransados2] = useState([]);
  const [buy, setBuy] = useState([]);
  var aux_buy = [{}];
  const [sell, setSell] = useState([]);
  var aux_sell = [{}];

  useEffect(() => {
    socket.on("UPDATE", (info) => {
      setData((currentData) => [...currentData, info]);
      informaciones.forEach((element) => {
        if (element[info.ticker]) {
          element[info.ticker].variacion =
            Math.round(
              ((element[info.ticker].ultimo - info.value) / 100) * 100 * 100
            ) / 100;
          element[info.ticker].ultimo = info.value;
          if (info.value < element[info.ticker].bajo) {
            element[info.ticker].bajo = info.value;
          }
          if (info.value > element[info.ticker].alto) {
            element[info.ticker].alto = info.value;
          }
        } else {
          element[info.ticker] = {};
          element[info.ticker].volumen = 0; //suma compra y venta
          element[info.ticker].alto = info.value;
          element[info.ticker].bajo = info.value;
          element[info.ticker].ultimo = info.value;
          element[info.ticker].variacion = 0;
          element[info.ticker].ticker = info.ticker;
        }
      });
      setEstadisticas(informaciones);
      //console.log(informaciones);
    });

    socket.on("BUY", (info) => {
      aux_transados.forEach((element) => {
        if (element[info.ticker]) {
          element[info.ticker].transado += info.volume;
        } else {
          element[info.ticker] = {};
          element[info.ticker].ticker = info.ticker;
          element[info.ticker].transado = info.volume;
        }
      });
      aux_buy.forEach((element) => {
        if (element[info.ticker]) {
          element[info.ticker].transado += info.volume;
        } else {
          element[info.ticker] = {};
          element[info.ticker].ticker = info.ticker;
          element[info.ticker].transado = info.volume;
        }
      });
      setTransados(aux_transados);
      setBuy(aux_buy);
      //console.log(aux_buy);
    });

    //var aux_transados2 = [];
    socket.on("SELL", (info) => {
      aux_transados2.forEach((element) => {
        if (element[info.ticker]) {
          element[info.ticker].transado += info.volume;
        } else {
          element[info.ticker] = {};
          element[info.ticker].ticker = info.ticker;
          element[info.ticker].transado = info.volume;
        }
      });
      if (aux_transados[0][info.ticker]) {
        aux_transados[0][info.ticker].transado += info.volume; //suma de buy total + sell de update
      }
      aux_sell.forEach((element) => {
        if (element[info.ticker]) {
          element[info.ticker].transado += info.volume;
        } else {
          element[info.ticker] = {};
          element[info.ticker].ticker = info.ticker;
          element[info.ticker].transado = info.volume;
        }
      });
      setTransados2(aux_transados2);
      setTransados(aux_transados);
      setSell(aux_sell);
    });
  }, []);
  data.forEach((element) => {
    element.time = new Date(element.time);
    element.time =
      element.time.getFullYear() +
      " " +
      element.time.getHours() +
      ":" +
      element.time.getMinutes() +
      ":" +
      element.time.getSeconds();
    element[element.ticker] = element.value;
  });
  var lista_ticker = {};
  data.forEach((element) => {
    stocks.forEach((stock) => {
      if (stock.ticker === element.ticker) {
        if (lista_ticker[element.ticker]) {
          lista_ticker[element.ticker] = [
            ...lista_ticker[element.ticker],
            element,
          ];
        } else {
          lista_ticker[element.ticker] = [element];
        }
      }
    });
  });

  var info_para_graficar = [];
  for (var key in lista_ticker) {
    info_para_graficar.push(lista_ticker[key]);
  }

  function handleClick() {
    var btn = document.getElementById("boton");
    if (socket.connected) {
      socket.disconnect();
      btn.innerHTML = "Prender";
    } else {
      socket.connect();
      btn.innerHTML = "Apagar";
    }
  }

  return (
    <div>
      <button
        type="submit"
        onClick={handleClick}
        value="Apagar"
        id="boton"
        style={style}
      >
        Apagar
      </button>
      <Grafico
        info={info_para_graficar}
        transado={transados}
        buy={buy}
        sell={sell}
        extra={estadisticas}
        stocks={stocks}
        exchanges={exchanges}
      />
    </div>
  );
};

const style = {
  "margin-left": "300",
  padding: 30,
  color: "#FFFFFF",
  "background-color": "#000000",
};

export default App;
