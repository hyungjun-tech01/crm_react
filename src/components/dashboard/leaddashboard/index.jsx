import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import PieChart from "../piechart";
import HorizontalBarChart from "../barchart/horizontalchart";
import BarChart from "../barchart";
import LineChart from "../linechart";
import SingleChart from "../linechart/singlelinechart";
import TotalRevenuechart from "../barchart/totalreveue";
import Salesstatictschart from "../barchart/salesstatistics";
import Completedtaskchart from "../barchart/completedtaks";

const LeadDashboard =()=> {
    return (
     	<div className="page-wrapper">
			<Helmet>
				<title>Deals Dashboard - CRMS admin Template</title>
				<meta name="description" content="Reactify Blank Page" />
			</Helmet>
            <div className="content container-fluid">					
				<div className="crms-title row bg-white mb-4">
					<div className="col">
						<h3 className="page-title">
						<span className ="page-title-icon bg-gradient-primary text-white me-2">
							<i className ="fas fa-table"></i>
						</span> <span>Leads Dashboard</span></h3>
					</div>
					<div className ="col text-end">
						<ul className ="breadcrumb bg-white float-end m-0 pl-0 pr-0">
							<li className ="breadcrumb-item"><Link to="/">Dashboard</Link></li>
							<li className ="breadcrumb-item active">Leads Dashboard</li>
						</ul>
					</div>
				</div>
				<div className ="row graphs">
					<div className ="col-md-6">
						<div className ="card h-100">
							<div className="card-body">
								<h3 className="card-title">Sales Statistics</h3>
								<Salesstatictschart />
							</div>
						</div>
					</div>
	
					<div className ="col-md-6">
						<div className ="card h-100">
							<div className="card-body">
								<h3 className="card-title">Completed Tasks</h3>
								<Completedtaskchart />
							</div>
						</div>
					</div>
				</div>
				<div className ="row graphs">
					<div className ="col-md-6">
						<div className ="card h-100">
							<div className="card-body">
			                  	<h3 className="card-title">Total Lead</h3>
                                <PieChart />
			                </div>
						</div>
					</div>	
					<div className ="col-md-6">
						<div className ="card h-100">
							<div className="card-body">
								<h3 className="card-title">Number of Employees</h3>
								<HorizontalBarChart />
							</div>
						</div>
					</div>
				</div>
				<div className ="row graphs">
					<div className ="col-md-6">
						<div className ="card h-100">
							<div className="card-body">
								<h3 className="card-title">Sales Overview</h3>
								<LineChart />
							</div>
						</div>
					</div>	
					<div className ="col-md-6">
						<div className ="card h-100">
							<div className="card-body">
								<h3 className="card-title">Total Revenue</h3>
								<TotalRevenuechart />
							</div>
						</div>
					</div>
				</div>
				<div className ="row graphs">
					<div className ="col-md-6">
						<div className ="card h-100">
							<div className="card-body">
								<h3 className="card-title">Yearly Projects</h3>
								<BarChart />
							</div>
						</div>
					</div>	
					<div className ="col-md-6">
						<div className ="card h-100">
							<div className="card-body">
								<h3 className="card-title">Total Sales</h3>
								<SingleChart />
							</div>
						</div>
					</div>
				</div>
            </div>
         </div>
    );
  }
export default LeadDashboard;
