import React, {useEffect} from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link , useHistory} from "react-router-dom";
import { useTranslation } from "react-i18next";

import PieChart from "./piechart";
import HorizontalBarChart from "./barchart/horizontalchart";
import BarChart from "./barchart";
import LineChart from "./linechart";
import SingleChart from "./linechart/singlelinechart";
import TotalRevenuechart from "./barchart/totalreveue";
import Salesstatictschart from "./barchart/salesstatistics";
import Completedtaskchart from "./barchart/completedtaks";
import { useCookies } from "react-cookie";


const Dashboard = () => {
  const [ t ] = useTranslation();
  const [cookies, removeCookie] = useCookies([
    "myLationCrmUserId",
    "myLationCrmUserName",
    "myLationCrmAuthToken",
  ]);

  const history = useHistory();
  
  useEffect(() => {
  
    if(cookies.myLationCrmAuthToken === undefined
      || cookies.myLationCrmAuthToken === null
      || cookies.myLationCrmAuthToken === "undefined"
      || cookies.myLationCrmAuthToken === ""
    ) {

      removeCookie('myLationCrmUserId');
      removeCookie('myLationCrmUserName');
      removeCookie('myLationCrmAuthToken');
      history.push("/login");
    }
  }, []);

  return (
    <HelmetProvider>
      <div className="page-wrapper">
        <Helmet>
          <title>Deals Dashboard - CRMS admin Template</title>
          <meta name="description" content="Reactify Blank Page" />
        </Helmet>
        <div className="content container-fluid">
          <div className="crms-title row bg-white mb-4">
            <div className="col">
              <h3 className="page-title">
                <span className="page-title-icon bg-gradient-primary text-white me-2">
                  <i className="fas fa-table"></i>
                </span>{" "}
                <span>Deals Dashboard</span>
              </h3>
            </div>
            <div className="col text-end">
              <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
                <li className="breadcrumb-item">
                  <Link to="/">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Deals Dashboard</li>
              </ul>
            </div>
          </div>
          <div className="row graphs">
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">{t('dashboard.total_lead')}</h3>
                  <PieChart />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">{t('dashboard.product_yearly_sales')}</h3>
                  <HorizontalBarChart />
                </div>
              </div>
            </div>
          </div>
          <div className="row graphs">
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">{t('dashboard.sales_overview')}</h3>
                  <LineChart />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">{t('common.total')} {t('common.sales')}</h3>
                  <SingleChart />
                </div>
              </div>
            </div>
          </div>
          <div className="row graphs">
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">{t('dashboard.yearly_projects')}</h3>
                  <BarChart />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">{t('common.total')} {t('common.revenue')}</h3>
                  <TotalRevenuechart />
                </div>
              </div>
            </div>
          </div>
          <div className="row graphs">
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">{t('dashboard.sales_statistics')}</h3>
                  <Salesstatictschart />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">{t('dashboard.completed_tasks')}</h3>
                  <Completedtaskchart />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};
export default Dashboard;
