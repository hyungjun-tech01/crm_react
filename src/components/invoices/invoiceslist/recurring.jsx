import React from 'react';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {IMG06, IMG07, IMG08, IMG09, IMG10} from "./img";
import Breadcrumb from './common.jsx'
import { Table } from "antd";
import {itemRender,onShowSizeChange} from "../../paginationfunction"
import "../../antdstyle.css"
const recurringInvoices =()=>{
    const data =[
        {
          id:1,
            Invoice: "IN093439#@09",
            on: "16 Mar 2022",
            to: "Barbara Moore",
            Amount: "$1,54,220",
            Paid: "23 Mar 2022",
            Next: "28 Mar 2022",
            Frequency: "14 Months",
            Status: "Active",
            image:IMG06,
            className:"badge bg-success-dark"
          },
        {
          id:2,
          Invoice: "IN093439#@10",
          on: "14 Mar 2022",
          to: "Karlene Chaidez",
          Amount: "$1,222",
          Paid: "18 Mar 2022",
          Next: "20 Mar 2022",
          Frequency: "12 Months",
          Status: "Expired",
          image:IMG07,
          className:"badge bg-danger-dark"
        },
        {
          id:3,
          Invoice: "IN093439#@11",
          on: "7 Mar 2022",
          to: "Russell Copeland",
          Amount: "$3,470",
          Paid: "10 Mar 2022",
          Next: "18 Mar 2022",
          Frequency: "08 Months",
          Status: "Active",
          image:IMG08,
          className:"badge bg-success-dark"
        },
        {
          id:4,
          Invoice: "IN093439#@12",
          on: "24 Mar 2022",
          to: "Joseph Collins",
          Amount: "$8,265",
          Paid: "30 Mar 2022",
          Next: "22 Mar 2022",
          Frequency: "10 Months",
          Status: "Expired",
          image:IMG09,
          className:"badge bg-danger-dark"
        },
        {
          id:5,
          Invoice: "IN093439#@13",
          on: "17 Mar 2022",
          to: "Jennifer Floyd",
          Amount: "$5,200",
          Paid: "20 Mar 2022",
          Next: "31 Mar 2022",
          Frequency: "03 Months",  
          Status: "Active",
          image:IMG10,
          className:"badge bg-success-dark"
        }
       ];
       const columns = [
     
        {
          title: "Invoice number",
          dataIndex: "Invoice",
          render: (text, record) => (
            <><Link to="/view-invoice" className="invoice-link">{text}</Link></>
            ),
          sorter: (a, b) => a.Invoice.length - b.Invoice.length,
        },
  
        {
          title: "Created on",
          dataIndex: "on",
          render: (text, record) => (
            <>{text}</>
            ),
          sorter: (a, b) => a.on.length - b.on.length,
        },
        {
          title: "Invoice to",
          dataIndex: "to",
          render: (text, record) => (
            <><Link to="/profile">
            <img
            className="avatar avatar-sm me-2 avatar-img rounded-circle"
            src={record.image}
            alt="User Image"
            />{" "}
            {text}
        </Link></>
            ),
          sorter: (a, b) => a.to.length - b.to.length,
        },
        {
          title: "Amount",
          dataIndex: "Amount",
          render: (text, record) => (
            <><div className="text-primary">{text}</div></>
            ),
          sorter: (a, b) => a.Amount.length - b.Amount.length,
        },
        {
          title: "Last invoice",
          dataIndex: "Paid",
          render: (text, record) => (
            <>{text}</>
            ),
          sorter: (a, b) => a.Paid.length - b.Paid.length,
        },
        {
          title: "Next invoice",
          dataIndex: "Next",
          render: (text, record) => (
            <>{text}</>
            ),
          sorter: (a, b) => a.Next.length - b.Next.length,
        },
        {
          title: "Frequency",
          dataIndex: "Frequency",
          render: (text, record) => (
            <>{text}</>
            ),
          sorter: (a, b) => a.Frequency.length - b.Frequency.length,
        },
        {
          title: "Status",
          dataIndex: "Status",
          render: (text, record) => (
            <> <span className={record.className}>{text}</span></>
            ),
          sorter: (a, b) => a.Status.length - b.Status.length,
        },
        {
          title: "Action",
          className:"text-end",
          render: (text, record) => (
            <div className="text-end">
            <Link to="/edit-invoice"
            className="btn btn-sm btn-white text-success me-2"
            >
            <i className="fa fa-edit me-1" /> Edit
            </Link>
            <a
            className="btn btn-sm btn-white text-danger"
            href="#"
            data-bs-toggle="modal"
            data-bs-target="#delete_paid"
            >
            <i className="fa fa-trash me-1" />
            Delete
            </a>
        </div>
            ),
          }
      ];
      const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
        },
        getCheckboxProps: record => ({
          disabled: record.name === "Disabled User", // Column configuration not to be checked
          name: record.name,
          className: "checkbox-red"
        })
      };
    return(
<>
  {/* Page Wrapper */}
  <div className="page-wrapper">
      <Helmet>
      <title>Invoice- CRMS admin Template</title>
      <meta name="description" content="Reactify Blank Page" />
  </Helmet>
    {/* Page Content */}
    <div className="content container-fluid">
        <Breadcrumb/>
        <>
        <div className="row">
            <div className="col-sm-12">
            <div className="card card-table">
                <div className="card-body p-4">
                <div className="table-responsive">
                <Table
                  rowSelection={rowSelection}
                  pagination= { {total : data.length,
                    showTotal : (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                    showSizeChanger : true,onShowSizeChange: onShowSizeChange ,itemRender : itemRender } }
                  className="table table-striped table-nowrap custom-table mb-0 datatable dataTable no-footer"
                  style={{ overflowX: "auto" }}
                  columns={columns}
                  dataSource={data}
                  rowKey={(record) => record.id} />
                </div>
                </div>
            </div>
            </div>
        </div>
        </>

    </div>
    {/* /Page Content */}
  </div>
  {/* /Page Wrapper */}
</>
)};
export default recurringInvoices;