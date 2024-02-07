import React from 'react';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {Bar,Line,Doughnut} from 'react-chartjs-2';

const state1 = {
  labels: ['2006','2007','2008','2009','2010','2011','2012' ],
  datasets: [{
    label: 'Series A',
    data: [12, 18, 15, 25, 30, 18,12],
    backgroundColor: '#664dc9',
    borderColor: '#664dc9',
    fill:false
  },{
    label: 'Series B',
    data: [18, 22, 18, 28, 35, 28,18],
    backgroundColor: '#44c4fa',
    borderColor: '#44c4fa',
    fill:false
  }
]
}
const option1 ={
maintainAspectRatio: false,
responsive: true,
legend: {
  display: false,
  labels: {
    display: false
  }
},
scales: {
  yAxes: [{
    ticks: {
      beginAtZero: true,
      fontSize: 10,
      max: 40
    }
  }],
  xAxes: [{
    ticks: {
      beginAtZero: true,
      fontSize: 11
    }
  }]
}
}
const state2 = {
  labels: ['2006','2007','2008','2009','2010','2011','2012' ],
  datasets: [{
    label: 'Series A',
    data: [10,25, 80, 38, 30, 18,12],
    backgroundColor: '#9B95D1',
    borderColor: '#664dc9',
    fill:true
  },{
    label: 'Series B',
    data: [15,35, 100, 48, 40, 28,22],
    backgroundColor: '#A8DBF0',
    borderColor: '#44c4fa',
    fill:true
  }
]
}
const option2 ={
  maintainAspectRatio: false,
  responsive: true,
  legend: {
    display: false,
    labels: {
      display: false
    }
  },
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true,
        fontSize: 10,
        max: 100
      }
    }],
    xAxes: [{
      ticks: {
        beginAtZero: true,
        fontSize: 11
      }
    }]
  }
}
const state3 ={
  labels: ['Sales','Pending;','Process'],
  datasets: [{
    data: [50,30,20],
    backgroundColor: ['#664dc9','#44c4fa', '#38cb89']
  }]
}
const option3 ={
  maintainAspectRatio: false,
  responsive: true,
  resize: true,
  animation: {
    animateScale: true,
    animateRotate: true
  },
  legend: {
    display: false,
    labels: {
      display: true
    }
  },
}
const MorrisCharts =()=>{
    return(
<>
  {/* Page Wrapper */}
  <div className="page-wrapper">
  <Helmet>
      <title>Dashboard- CRMS admin Template</title>
      <meta name="description" content="Reactify Blank Page" />
  </Helmet>
    <div className="content container-fluid">
      {/* Page Header */}
      <div className="crms-title row bg-white mb-4">
        <div className="col">
          <h3 className="page-title">
            <span className="page-title-icon bg-gradient-primary text-white me-2">
              <i className="fas fa-table" />
            </span>{" "}
            <span>Tooltip</span>
          </h3>
        </div>
        <div className="col text-end">
          <ul className="breadcrumb bg-white float-end m-0 ps-0 pe-0">
            <li className="breadcrumb-item">
              <Link to="/index">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Tooltip</li>
          </ul>
        </div>
      </div>
      {/* /Page Header */}
      <div className="row">
        {/* Chart */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Bar Chart</div>
            </div>
            <div className="card-body">
            <Bar
              data={state1}
              options={option1}
            />
            </div>
          </div>
        </div>
        {/* /Chart */}
        {/* Chart */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Stacked Bar Chart </div>
            </div>
            <div className="card-body">
            <Bar
              data={state1}
              options={option1}
            />
            </div>
          </div>
        </div>
        {/* /Chart */}
        {/* Chart */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Line Chart</div>
            </div>
            <div className="card-body">
              <div id="morrisLine1" />
              <Line
              data={state1}
              options={option1}
            />
            </div>
          </div>
        </div>
        {/* /Chart */}
        {/* Chart */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Area Chart</div>
            </div>
            <div className="card-body">
            <Line
              data={state2}
              options={option2}
            />
            </div>
          </div>
        </div>
        {/* /Chart */}
        {/* Chart */}
        {/* <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Line Chart</div>
            </div>
            <div className="card-body">
              <div id="morrisBar6" />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Line Chart</div>
            </div>
            <div className="card-body">
              <div id="morrisBar7" />
            </div>
          </div>
        </div> */}
        {/* /Chart */}
        {/* Chart */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Donut Chart</div>
            </div>
            <div className="card-body">
            <Doughnut
              className="h-300"
              data={state3}
              options={option3}
            />
            </div>
          </div>
        </div>
        {/* /Chart */}
      </div>
    </div>
  </div>
  {/* /Page Wrapper */}
</>

)};
export default MorrisCharts;
