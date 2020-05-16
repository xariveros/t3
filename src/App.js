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

const App = () => {
  const [data, setData] = useState([]);
  //const [informaciones, setInformaciones] = useState([]);
  const [estadisticas, setEstadisticas] = useState([]);
  var informaciones = [{}];
  const [transados, setTransados] = useState([]);
  var aux_transados = [{}];
  // var lista = [
  //   {
  //     twt: { max: 1, min: 2, transado: 3 },
  //     fb: { max: 1, min: 2, transado: 3 },
  //   },
  // ];

  useEffect(() => {
    socket.on("UPDATE", (info) => {
      setData((currentData) => [...currentData, info]);
      informaciones.forEach((element) => {
        //console.log("entro aki");
        //element es objeto
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
    });
    var aux = [];
    //console.log(aux);
    socket.on("BUY", (info) => {
      //console.log(info);
      aux_transados.forEach((element) => {
        if (element[info.ticker]) {
          element[info.ticker].transado += info.volume;
        } else {
          element[info.ticker] = {};
          element[info.ticker].ticker = info.ticker;
          element[info.ticker].transado = info.volume;
        }
      });
      setTransados(aux_transados);
    });
    // socket.on("SELL", (info) => {});
  }, []);

  data.forEach((element) => {
    element.time = new Date(element.time);
    element.time = element.time.toGMTString();
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
        extra={estadisticas}
      />
    </div>
  );
};

const style = {
  margin: "10",
  padding: 10,
  listStyle: "none",
  center: 1,
};

export default App;
