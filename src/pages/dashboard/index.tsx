import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import DataTable from 'react-data-table-component';
import Chart from "react-apexcharts";

//Table Style
const customStyles = {
  rows: {
    style: {
      minHeight: '48px', // override the row height
      fontSize: "1rem",
    }
  },
  headCells: {
    style: {
      paddingLeft: '8px', // override the cell padding for head cells
      paddingRight: '8px',
      fontSize: "1.2rem",
    },
  },
  cells: {
    style: {
      paddingLeft: '8px', // override the cell padding for data cells
      paddingRight: '8px',
    },
  },
};

function Dashboard() {
  const [startDate, setStartDate] = useState(moment(new Date(new Date().setDate(new Date().getDate() - 3))).format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment(new Date(new Date().setDate(new Date().getDate() + 3))).format('YYYY-MM-DD'));
  const [product1Data, setProduct1Data] = useState([] as any);
  const [product2Data, setProduct2Data] = useState([] as any);
  const [tableData, setTableData] = useState([] as any);
  const [productSelector, setProductSelector] = useState("all");
  const [chartOptions, setChartOptions] = useState({} as any);
  const [series, setSeries] = useState([] as any);

  //table columns
  const columns = [
    {
      name: 'Date',
      selector: 'date',
    },
    {
      name: 'Product',
      selector: 'product',
    },
    {
      name: 'Value',
      selector: 'value',
    },
  ];

  //init
  useEffect(() => {
    generateProductData(startDate, endDate);
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  //Generate random products data
  const generateProductData = (sDate: any, eDate: any) => {
    let tmp1 = [], tmp2 = [];

    var date: any = new Date(sDate);
    for (; date <= new Date(eDate); date.setDate(new Date(date).getDate() + 1)) {
      let random = Math.floor(Math.random() * 50) + 20;
      tmp1.push({ date: moment(date).format('YYYY-MM-DD'), product: 1, value: random });
      random = Math.floor(Math.random() * 50) + 20;
      tmp2.push({ date: moment(date).format('YYYY-MM-DD'), product: 2, value: random });
    }

    setProduct1Data(tmp1);
    setProduct2Data(tmp2);
    setDisplayData(productSelector, tmp1, tmp2);
  }

  //set display data
  const setDisplayData = (selector: any, data1: any, data2: any) => {
    //xaxis values for chart
    let xaxis: any = [];
    //series for chart
    let series1: any = [];
    let series2: any = [];
    let seriesSource = [];

    if (selector === "all") {
      setTableData([...data1, ...data2]);
      data1.forEach((item: any, index: any) => {
        item.value = item.value + data2[index].value;
        seriesSource.push(item);
      })
    }
    else if (selector === "p1") {
      setTableData(data1);
      seriesSource = data1;
    }
    else {
      setTableData(data2);
      seriesSource = data2;
    }

    seriesSource.forEach((item: any) => {
      xaxis.push(item.date);
      if (new Date(item.date) > new Date()) {
        series1.push(Math.floor(item.value * 0.95));
        series2.push(Math.floor(item.value * 1.05));
      }
      else {
        series1.push(item.value);
        series2.push(item.value);
      }
    })

    setChartOptions({
      colors: ['green', '#CED4DC'],
      xaxis: {
        categories: xaxis,
        labels: {
          style: {
            colors: "white"
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: "white"
          }
        }
      }
    })
    setSeries([
      {
        name: "-5%",
        data: series1
      },
      {
        name: "+5%",
        data: series2
      }
    ])
  }

  return (
    <div className="container mt-12 bg-transparent">

      {/* date range */}
      <div className="flex justify-center">
        <input
          value={startDate}
          onChange={(e: any) => { setStartDate(e.target.value); generateProductData(e.target.value, endDate) }}
          type="date"
          placeholder="StartDate"
          max={moment(new Date()).format('YYYY-MM-DD')}
          className="block ml-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring my-2" />
        <input
          value={endDate}
          onChange={(e: any) => { setEndDate(e.target.value); generateProductData(startDate, e.target.value) }}
          type="date"
          placeholder="EndDate"
          min={startDate < moment(new Date()).format('YYYY-MM-DD') ? moment(new Date()).format('YYYY-MM-DD') : startDate}
          className="block ml-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring my-2" />
      </div>

      {/* chart */}
      <Chart
        options={chartOptions}
        series={series}
        type="area"
        height="500"
        colors="white"
      />

      {/* product selector */}
      <div className="flex justify-center my-2 items-center">
        <div className="text-white ">Product Selector</div>
        <div className="relative inline-block ml-2 w-36 text-gray-700">
          <select
            className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
            value={productSelector}
            onChange={(e: any) => {
              setProductSelector(e.target.value);
              setDisplayData(e.target.value, product1Data, product2Data);
            }}>
            <option value="all">All</option>
            <option value="p1">Product 1</option>
            <option value="p2">Product 2</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
          </div>
        </div>
      </div>

      {/* product table */}
      <DataTable
        columns={columns}
        data={tableData}
        pagination={true}
        customStyles={customStyles}
      />

      {/* randomize button */}
      <div className="flex justify-center mt-2">
        <button
          className=" hover:bg-blue-500 text-white font-semibold focus:outline-none hover:text-white py-2 px-4 border border-white hover:border-transparent rounded"
          onClick={(e: any) => generateProductData(startDate, endDate)}
        >Randomize</button>
      </div>
    </div>
  );
}

export default Dashboard;
