import React from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  Tooltip,
  Legend,
} from "recharts";

const Grafico = ({ info, transado, extra }) => {
  extra.forEach((element) => {
    // console.log(element);
  });
  return (
    <div>
      {/* {extra[0]["IBM"].alto} */}
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
    </div>
  );
};

const divStyle = {
  display: "flex",
};

const titleStyle = {
  padding: 50,
};

export default Grafico;
