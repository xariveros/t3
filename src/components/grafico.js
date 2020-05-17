import React, { useState } from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  Tooltip,
  Legend,
} from "recharts";

const Grafico = ({ info, transado, buy, sell, extra, exchanges, stocks }) => {
  //console.log(buy);
  // console.log(sell);
  //console.log(exchanges);
  //console.log(stocks);
  var listed_companies = [];
  var info_exchanges = [];
  var aux_exchanges = [];
  for (const key in exchanges) {
    //listed_companies = [...listed_companies, exchanges[key].listed_companies];
    listed_companies.push({
      [exchanges[key].exchange_ticker]: exchanges[key].listed_companies,
    });
  }
  var volumen_total = 0;
  for (const key in exchanges) {
    aux_exchanges.push(exchanges[key].exchange_ticker);

    listed_companies.forEach((element) => {
      var nombre_exchange = exchanges[key].exchange_ticker;

      if (element[nombre_exchange]) {
        info_exchanges[nombre_exchange] = {};
        info_exchanges[nombre_exchange].cantidad_acciones =
          element[nombre_exchange].length;
        info_exchanges[nombre_exchange].buy = 0;
        info_exchanges[nombre_exchange].sell = 0;
        info_exchanges[nombre_exchange].nombre = nombre_exchange;
        stocks.forEach((stock) => {
          element[nombre_exchange].forEach((nombre_empresa) => {
            if (stock.company_name === nombre_empresa) {
              //console.log(buy);
              if (buy[0] && buy[0][stock.ticker]) {
                info_exchanges[nombre_exchange].buy +=
                  buy[0][stock.ticker].transado;
                volumen_total += buy[0][stock.ticker].transado;
              }
              if (sell[0] && sell[0][stock.ticker]) {
                info_exchanges[nombre_exchange].sell +=
                  sell[0][stock.ticker].transado;
                volumen_total += sell[0][stock.ticker].transado;
              }
            }
          });
        });

        info_exchanges[nombre_exchange].total =
          info_exchanges[nombre_exchange].buy +
          info_exchanges[nombre_exchange].sell;
      }
    });
  }
  //console.log(aux_exchanges);
  //console.log(listed_companies);
  //setInfo_para_exchanges(info_exchanges);
  return (
    <div>
      {info.map((info) => (
        <div>
          <h1 style={titleStyle}>{info[0].ticker}</h1>
          <div style={divStyle}>
            <LineChart
              width={500}
              height={300}
              data={info}
              margin={{
                top: 5,
                right: 30,
                left: 30,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={info[0].ticker}
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
            {extra.map((dato) => {
              if (dato[info[0].ticker]) {
                return (
                  <div
                    key={Math.random()}
                    display="flex"
                    flex-direction="row"
                    flex-wrap="wrap"
                  >
                    <p>Precio más alto: {dato[info[0].ticker].alto}</p>
                    <p>Precio más bajo: {dato[info[0].ticker].bajo}</p>
                    <p>Último precio: {dato[info[0].ticker].ultimo}</p>
                    <p>
                      Variación porcentual: {dato[info[0].ticker].variacion}%
                    </p>
                  </div>
                );
              }
            })}
            {transado.map((dato) => {
              if (dato[info[0].ticker]) {
                return (
                  <div>
                    <p>Volumen transado: {dato[info[0].ticker].transado}</p>
                  </div>
                );
              }
            })}
          </div>
        </div>
      ))}
      <div id="exchanges" style={divStyle}>
        {aux_exchanges.map((dato) => {
          if (dato) {
            return (
              <div style={otroDivStyle}>
                <h1 style={titleStyle}>
                  <p>Exchange: {info_exchanges[dato].nombre}</p>
                </h1>
                <p>Suma Buy: {info_exchanges[dato].buy}</p>
                <p>Suma Sell: {info_exchanges[dato].sell}</p>
                <p>Volumen Total: {info_exchanges[dato].total}</p>
                <p>
                  Cantidad de acciones: {info_exchanges[dato].cantidad_acciones}
                </p>
                <p>
                  Participación{" "}
                  {Math.round(
                    (info_exchanges[dato].total / volumen_total) * 10000
                  ) / 100}
                  %
                </p>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

const divStyle = {
  display: "flex",
};

const otroDivStyle = {
  padding: 50,
};

const titleStyle = {
  padding: 30,
};

export default Grafico;
