import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  XAxis,
  YAxis,
  Line,
  LineChart,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const GraphContainer = styled.div`
  border-style: solid;
  width: 90%;
  background-color: rgb(24, 60, 64);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;

const MovingAvgContainer = styled.div`
  /* border-style: solid;
  border-color: white; */
  width: 375px;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const MovingAvgTitle = styled.div`
  color: white;
  font-size: 1.2rem;
  margin-top: 20px;
  text-decoration: underline;
`;

const InputContainer = styled.form`
  width: 100%;
  height: 30px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px;
`;

const PeriodInput = styled.input`
  width: 50px;
  margin: 0px 5px 0px 5px;
  -moz-appearance: textfield;
  -webkit-appearance: textfield;
`;

const TextLabel = styled.text`
  margin: 0px 5px 0px 5px;
`;

const AddBtn = styled.button`
  margin: 0px 5px 0px 5px;
  height: 25px;
  width: 80px;
  background-color: rgb(80, 250, 216);
  border-radius: 5px;
  border: none;
  font-size: 1rem;
  &:hover {
    cursor: pointer;
  }
`;

const CurrentIndicatorContainer = styled.div`
  color: white;
  display: flex;
  width: 60%;
  position: relative;
  margin: 5px;
`;

const IndicatorPeriod = styled.div`
  color: ${(props) => props.color};
`;

const RemoveBtn = styled.button`
  position: absolute;
  right: 0px;
  margin: 0px 5px 0px 5px;
  height: 25px;
  width: 80px;
  background-color: rgb(80, 250, 216);
  border-radius: 5px;
  border: none;
  font-size: 1rem;
  &:hover {
    cursor: pointer;
  }
`;

const TabsContainer = styled.div`
  background-color: white;
  display: flex;
  justify-content: center;
  background-color: rgb(24, 60, 64);
`;

const DurationTabs = styled.div`
  padding: 0px 10px 0px 10px;
  border-style: solid;
  border-width: 1px;
  border-color: rgb(16, 39, 41);
  color: white;

  &:hover {
    cursor: pointer;
  }
`;

const Graph = (props) => {
  const [data, setData] = useState(props.data);
  let element;
  if (data.length - 252 >= 0) {
    element = data.length - 252;
  } else {
    element = 0;
  }

  const [displayData, setDisplayData] = useState(
    data.slice(element, data.length)
  );
  const [bottomNumber, setBottomNumber] = useState();
  const [topNumber, setTopNumber] = useState();
  const [tickerArray, setTickerArray] = useState([]);
  const [avgList, setAvgList] = useState([]);
  const [graphInterval, setGraphInterval] = useState("1 Year");

  const sliceFunc = (duration) => {
    let arrayIndex;
    if (data.length - duration >= 0) {
      arrayIndex = data.length - duration;
    } else {
      arrayIndex = 0;
    }

    setDisplayData(data.slice(arrayIndex, data.length));
  };

  const setYAxisRange = () => {
    const priceList = [];
    displayData.forEach((data) => priceList.push(data.price));
    let maxPrice = Math.max(...priceList);
    let minPrice = Math.min(...priceList);
    let diffPrice = maxPrice - minPrice;
    let priceAxis = [0.1, 0.5, 1, 5, 10, 50, 100, 500, 1000, 5000, 10000];
    let howClose = 100000000000000000;
    let tickerDistance;
    priceAxis.forEach((priceSeparation) => {
      let multiplier = diffPrice / priceSeparation;
      if (Math.abs(multiplier - 8) < howClose) {
        howClose = Math.abs(multiplier - 8);
        tickerDistance = priceSeparation;
        return tickerDistance;
      }
    });

    let bottomTicker;
    let topTicker;

    if (tickerDistance >= 10) {
      bottomTicker = Math.floor((minPrice - tickerDistance) / 10) * 10;
      setBottomNumber(bottomTicker);
      topTicker = Math.ceil((maxPrice + tickerDistance) / 10) * 10;
      setTopNumber(topTicker);
    } else if (10 > tickerDistance && tickerDistance >= 1) {
      bottomTicker = Math.floor(minPrice - tickerDistance);
      setBottomNumber(bottomTicker);
      topTicker = Math.ceil(maxPrice + tickerDistance);
      setTopNumber(topTicker);
    } else if (tickerDistance < 1) {
      bottomTicker = Math.floor((minPrice - tickerDistance) * 10) / 10;
      setBottomNumber(bottomTicker);
      topTicker = Math.ceil((maxPrice + tickerDistance) * 10) / 10;
      setTopNumber(topTicker);
    }

    let tempArray = [];

    while (bottomTicker <= topTicker) {
      tempArray.push(bottomTicker);
      bottomTicker = bottomTicker + tickerDistance;
      if (tickerDistance < 1) {
        bottomTicker = Math.round(bottomTicker * 10) / 10;
      }
    }
    setTickerArray(tempArray);
  };

  useEffect(() => {
    setYAxisRange();
  }, [displayData]);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  useEffect(() => {
    setDisplayData(data.slice(element, data.length));
    setGraphInterval("1 Year");
  }, [data]);

  useEffect(() => {
    setAvgList([]);
  }, [props.ticker]);

  const [periodInput, setPeriodInput] = useState();
  const [colorInput, setColorInput] = useState();

  const AddMovingAvgLine = (event) => {
    event.preventDefault();
    let tempData = data;
    let i = 0;
    tempData.map((x) => {
      if (i < periodInput - 1) {
        i++;
        return x;
      }
      let totalPrice = 0;
      for (let y = i - (periodInput - 1); y <= i; y++) {
        totalPrice = totalPrice + data[y].price;
      }
      i++;
      x[`${periodInput} Day MA`] =
        Math.round((totalPrice / periodInput) * 100) / 100;
      return x;
    });

    if (colorInput) {
      setAvgList([
        ...avgList,
        { period: `${periodInput} Day MA`, color: colorInput },
      ]);
    } else {
      setAvgList([
        ...avgList,
        { period: `${periodInput} Day MA`, color: "#000000" },
      ]);
    }
  };

  const GraphHandler = () => {
    if (displayData && bottomNumber && topNumber && tickerArray) {
      return (
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(16, 39, 41)" />
            <XAxis
              dataKey="date"
              padding={{ left: 50, right: 50 }}
              interval="preserveEnd"
              stroke="white"
              minTickGap={50}
            />
            <YAxis
              type="number"
              domain={[bottomNumber, topNumber]}
              ticks={tickerArray}
              stroke="white"
              minTickGap={2}
              padding={{ top: 10 }}
            />
            <Line
              type="linear"
              dataKey="price"
              stroke="#8884d8"
              name="Closing Price"
              dot={false}
              activeDot={true}
              strokeWidth={2}
            />
            {avgList.map((x) => {
              return (
                <Line
                  type="linear"
                  dataKey={x.period}
                  stroke={x.color}
                  name={x.period}
                  dot={false}
                  activeDot={true}
                  strokeWidth={2}
                />
              );
            })}
            <Tooltip cursor={false} />
            <Legend align="center" height={5} />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <GraphContainer>
      <TabsContainer>
        <DurationTabs
          style={
            graphInterval === "1 Month"
              ? { backgroundColor: "rgb(16, 39, 41)" }
              : {}
          }
          onClick={() => {
            sliceFunc(22);
            setGraphInterval("1 Month");
          }}
        >
          1 Month
        </DurationTabs>
        <DurationTabs
          style={
            graphInterval === "3 Months"
              ? { backgroundColor: "rgb(16, 39, 41)" }
              : {}
          }
          onClick={() => {
            sliceFunc(65);
            setGraphInterval("3 Months");
          }}
        >
          3 Months
        </DurationTabs>
        <DurationTabs
          style={
            graphInterval === "6 Months"
              ? { backgroundColor: "rgb(16, 39, 41)" }
              : {}
          }
          onClick={() => {
            sliceFunc(130);
            setGraphInterval("6 Months");
          }}
        >
          6 Months
        </DurationTabs>
        <DurationTabs
          style={
            graphInterval === "1 Year"
              ? { backgroundColor: "rgb(16, 39, 41)" }
              : {}
          }
          onClick={() => {
            sliceFunc(252);
            setGraphInterval("1 Year");
          }}
        >
          1 Year
        </DurationTabs>
      </TabsContainer>
      <div style={{ width: "100%" }}>{GraphHandler()}</div>
      <MovingAvgContainer>
        <MovingAvgTitle>Moving Average Indicator</MovingAvgTitle>
        <InputContainer onSubmit={AddMovingAvgLine}>
          <div>
            <TextLabel>Period:</TextLabel>
            <PeriodInput
              onInput={(e) => setPeriodInput(e.target.value)}
              type="number"
              step="1"
              min="2"
              required
            ></PeriodInput>
            <TextLabel>Day(s)</TextLabel>
          </div>
          <input
            type="color"
            onInput={(e) => setColorInput(e.target.value)}
            required
          />
          <AddBtn type="submit">Add</AddBtn>
        </InputContainer>
        {avgList.map((x) => (
          <CurrentIndicatorContainer>
            <IndicatorPeriod color={x.color}>{x.period}</IndicatorPeriod>
            <RemoveBtn
              onClick={() => {
                let tempList = avgList.filter((obj) => obj !== x);
                setAvgList(tempList);
              }}
            >
              Remove
            </RemoveBtn>
          </CurrentIndicatorContainer>
        ))}
      </MovingAvgContainer>
    </GraphContainer>
  );
};

export default Graph;
