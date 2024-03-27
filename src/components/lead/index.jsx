import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Table } from "antd";
import { Link } from "react-router-dom";
import Select from "react-select";
import { useCookies } from "react-cookie";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import "../antdstyle.css";
import LeadsDetailsModel from "./LeadsDetailsModel";
import { BiUser } from "react-icons/bi";
import { CompanyRepo } from "../../repository/company";
import { LeadKeyManItems, LeadRepo } from "../../repository/lead";
import { atomAllCompanies, atomAllLeads, defaultLead } from "../../atoms/atoms";

const Lead = () => {
  const allCompnayData = useRecoilValue(atomAllCompanies);
  const allLeadData = useRecoilValue(atomAllLeads);
  const { loadAllCompanies } = useRecoilValue(CompanyRepo);
  const { loadAllLeads, modifyLead, setCurrentLead } = useRecoilValue(LeadRepo);
  const [ cookies ] = useCookies(["myLationCrmUserName"]);

  const [ leadChange, setLeadChange ] = useState(null);
  const [ companyData, setCompanyData ] = useState([]);

  // --- Functions used for Table ------------------------------
  const handleClickLeadName = useCallback((id) => {
      console.log("[Lead] set current lead : ", id);
      setCurrentLead(id);
  }, [setCurrentLead]);

  // --- Functions used for Add New Lead ------------------------------
  const handleAddNewLeadClicked = useCallback(() => {
    initializeLeadTemplate();
  }, []);

  const initializeLeadTemplate = useCallback(() => {
    setLeadChange({ ...defaultLead });
    document.querySelector("#add_new_lead_form").reset();
  }, []);

  const handleLeadChange = useCallback((e) => {
    const modifiedData = {
      ...leadChange,
      [e.target.name]: e.target.value,
    };
    setLeadChange(modifiedData);
  }, [leadChange]);

  const handleAddNewLead = useCallback((event)=>{
    // Check data if they are available
    if(leadChange.lead_name === null
      || leadChange.lead_name === ''
      || leadChange.company_code === null)
    {
      console.log("Company Name must be available!");
      return;
    };

    const newLeadData = {
      ...leadChange,
      action_type: 'ADD',
      lead_number: '99999',// Temporary
      counter: 0,
      modify_user: cookies.myLationCrmUserName,
    };
    console.log(`[ handleAddNewLead ]`, newLeadData);
    const result = modifyLead(newLeadData);
    if(result){
      initializeLeadTemplate();
      //close modal ?
    };
  },[cookies.myLationCrmUserName, initializeLeadTemplate, leadChange, modifyLead]);

  // --- Funtions for Select ---------------------------------
  const handleSelectCompany = useCallback((value)=>{
    const selected = value.value;
    const tempLeadChange = {
      ...leadChange,
      company_code: selected.company_code,
      company_name: selected.company_name,
      company_name_en: selected.company_name_en,
      company_zip_code: (leadChange.company_zip_code !== null ? leadChange.company_zip_code : selected.company_zip_code),
      company_address: (leadChange.company_address !== null ? leadChange.company_address : selected.company_address),
    };
    setLeadChange(tempLeadChange);
  }, [leadChange]);

  const handleSelectKeyMan = useCallback((value) => {
    const selected = value.value;
    const tempLeadChange = {
      ...leadChange,
      is_keyman : selected
    };
    setLeadChange(tempLeadChange);
  },[leadChange]);

  const columns = [
    {
      title: "Full Name",
      dataIndex: "lead_name",
      render: (text, record) => (
        <>
          <a href="#">
            <span className="person-circle-a person-circle">
              {text.charAt(0)}
            </span>
          </a>
          <a href="#" data-bs-toggle="modal" data-bs-target="#leads-details" onClick={()=>{handleClickLeadName(record.lead_code);}}>
            {text}
          </a>
        </>
      ),
      sorter: (a, b) => a.lead_name.length - b.lead_name.length,
    },
    {
      title: "Title",
      dataIndex: "position",
      sorter: (a, b) => a.position.length - b.position.length,
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: (a, b) => a.department.length - b.department.length,
    },
    {
      title: "Company",
      dataIndex: "company_name",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => a.company_name.length - b.company_name.length,
    },
    {
      title: "Mobile",
      dataIndex: "mobile_number",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => a.mobile_number.length - b.mobile_number.length,
    },
    {
      title: "Email Address",
      dataIndex: "email",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Lead Status",
      dataIndex: "status",
      render: (text, record) => <label>{text}</label>,
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: "Lead Modified",
      dataIndex: "modify_date",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => a.modify_date - b.modify_date,
    },
    {
      title: "Lead Sales",
      dataIndex: "sales_resource",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => a.owner.length - b.owner.length,
    },
    // {
    //   title: "",
    //   dataIndex: "star",
    //   render: (text, record) => (
    //     <i className="fa fa-star" aria-hidden="true" />
    //   ),
    //   sorter: (a, b) => a.status.length - b.status.length,
    // },

    {
      title: "Actions",
      dataIndex: "status_",
      render: (text, record) => (
        <div className="dropdown dropdown-action">
          <a
            href="#"
            className="action-icon dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="material-icons">more_vert</i>
          </a>
          <div className="dropdown-menu dropdown-menu-right">
            <a className="dropdown-item" href="#">
              Edit This Lead
            </a>
            <a className="dropdown-item" href="#">
              Change Lead Image
            </a>
            <a className="dropdown-item" href="#">
              Delete This Lead
            </a>
            <a className="dropdown-item" href="#">
              Email This Lead
            </a>
            <a className="dropdown-item" href="#">
              Clone This Lead
            </a>
            <a className="dropdown-item" href="#">
              Change Record Owner
            </a>
            <a className="dropdown-item" href="#">
              Generate Merge Document
            </a>
            <a className="dropdown-item" href="#">
              Change Lead to Contact
            </a>
            <a className="dropdown-item" href="#">
              Convert Lead
            </a>
            <a className="dropdown-item" href="#">
              Print This Lead
            </a>
            <a className="dropdown-item" href="#">
              Merge Into Lead
            </a>
            <a className="dropdown-item" href="#">
              SmartMerge Lead
            </a>
            <a className="dropdown-item" href="#">
              Add Activity Set To Lead
            </a>
            <a className="dropdown-item" href="#">
              Add New Event For Lead
            </a>
          </div>
        </div>
      ),
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
      className: "checkbox-red",
    }),
  };

  useEffect(() => {
    if (allCompnayData.length === 0) {
      loadAllCompanies();
    } else {
      const companySubSet = allCompnayData.map((data) => ({
        value: {
          company_code: data.company_code,
          company_name: data.company_name,
          company_name_en: data.company_name_en,
          company_zip_code: data.company_zip_code,
          company_address: data.company_address,
        },
        label: data.company_name,
      }));
      setCompanyData(companySubSet);
    };
    if (allLeadData.length === 0) {
      loadAllLeads();
    };
    initializeLeadTemplate();
  }, [allCompnayData, allLeadData]);

  return (
    <HelmetProvider>
      <div className="page-wrapper">
        <Helmet>
          <title>Leads - CRMS admin Template</title>
          <meta name="description" content="Reactify Blank Page" />
        </Helmet>
        <div className="content container-fluid">
          <div className="crms-title row bg-white">
            <div className="col">
              <h3 className="page-title m-0">
                <span className="page-title-icon bg-gradient-primary text-white me-2">
                  {/* <i className="feather-user" /> */}
                  <i>
                    <BiUser />
                  </i>
                </span>{" "}
                Leads{" "}
              </h3>
            </div>
            <div className="col text-end">
              <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
                <li className="breadcrumb-item">
                  <Link to="/">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Leads</li>
              </ul>
            </div>
          </div>
          {/* Page Header */}
          <div className="page-header pt-3 mb-0 ">
            <div className="row">
              <div className="col">
                <div className="dropdown">
                  <a
                    className="dropdown-toggle recently-viewed"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {" "}
                    All Leads
                  </a>
                  <div className="dropdown-menu">
                    <a className="dropdown-item" href="#">
                      Recently Viewed
                    </a>
                    <a className="dropdown-item" href="#">
                      Items I'm following
                    </a>
                    <a className="dropdown-item" href="#">
                      All Leads
                    </a>
                    <a className="dropdown-item" href="#">
                      All Closed Leads
                    </a>
                    <a className="dropdown-item" href="#">
                      All Open Leads
                    </a>
                    <a className="dropdown-item" href="#">
                      Converted Leads
                    </a>
                    <a className="dropdown-item" href="#">
                      My Open Leads
                    </a>
                    <a className="dropdown-item" href="#">
                      Todays Leads
                    </a>
                  </div>
                </div>
              </div>
              <div className="col text-end">
                <ul className="list-inline-item pl-0">
                  <li className="dropdown list-inline-item add-lists">
                    <a
                      className="dropdown-toggle recently-viewed pr-2"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="nav-profile-text">
                        <i className="fa fa-cog" aria-hidden="true" />
                      </div>
                    </a>
                    <div className="dropdown-menu">
                      <a className="dropdown-item" href="#">
                        Choose Columns
                      </a>
                      <a className="dropdown-item" href="#">
                        Group Columns
                      </a>
                      <a className="dropdown-item" href="#">
                        Sharing Settings
                      </a>
                      <a className="dropdown-item" href="#">
                        Rename
                      </a>
                      <a className="dropdown-item" href="#">
                        Clone
                      </a>
                      <a className="dropdown-item" href="#">
                        Delete
                      </a>
                    </div>
                  </li>
                  <li className="nav-item dropdown list-inline-item add-lists">
                    <Link
                      className="nav-link dropdown-toggle"
                      id="profileDropdown"
                      to="#"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="nav-profile-text">
                        <i className="fa fa-th" aria-hidden="true"></i>
                      </div>
                    </Link>
                    <div
                      className="dropdown-menu navbar-dropdown"
                      aria-labelledby="profileDropdown"
                    >
                      <Link className="dropdown-item" to="/projects">
                        List View
                      </Link>
                      <Link className="dropdown-item" to="/leads-kanban-view">
                        Kanban View
                      </Link>
                      <Link
                        className="dropdown-item"
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#add-new-list"
                      >
                        Add New List View
                      </Link>
                    </div>
                  </li>
                  <li className="list-inline-item">
                    <button
                      className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded"
                      id="add-task"
                      data-bs-toggle="modal"
                      data-bs-target="#add_lead"
                      onClick={handleAddNewLeadClicked}
                    >
                      New Lead
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          <div className="row">
            <div className="col-md-12">
              <div className="card mb-0">
                <div className="card-body">
                  <div className="table-responsive">
                    <Table
                      rowSelection={rowSelection}
                      className="table table-striped table-nowrap custom-table mb-0 datatable dataTable no-footer"
                      pagination={{
                        total: allLeadData.length,
                        showTotal: (total, range) =>
                          `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                      }}
                      style={{ overflowX: "auto" }}
                      columns={columns}
                      dataSource={allLeadData}
                      rowKey={(record) => record.lead_number}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*modal section starts here*/}
        <div className="modal fade" id="add-new-list">
          <div className="modal-dialog">
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header">
                <h4 className="modal-title">Add New List View</h4>
                <button type="button" className="close" data-bs-dismiss="modal">
                  ×
                </button>
              </div>
              {/* Modal body */}
              <div className="modal-body">
                <form className="forms-sample">
                  <div className="form-group row">
                    <label
                      htmlFor="view-name"
                      className="col-sm-4 col-form-label"
                    >
                      New View Name
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        id="view-name"
                        placeholder="New View Name"
                      />
                    </div>
                  </div>
                  <div className="form-group row pt-4">
                    <label className="col-sm-4 col-form-label">
                      Sharing Settings
                    </label>
                    <div className="col-sm-8">
                      <div className="form-group">
                        <div className="form-check">
                          <label className="form-check-label">
                            <input
                              type="radio"
                              className="form-check-input"
                              name="optionsRadios"
                              id="optionsRadios1"
                              defaultValue
                            />{" "}
                            Just For Me <i className="input-helper" />
                          </label>
                        </div>
                        <br />
                        <div className="form-check">
                          <label className="form-check-label">
                            <input
                              type="radio"
                              className="form-check-input"
                              name="optionsRadios"
                              id="optionsRadios2"
                              defaultValue="option2"
                              defaultChecked
                            />{" "}
                            Share Filter with Everyone{" "}
                            <i className="input-helper" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-gradient-primary me-2"
                    >
                      Submit
                    </button>
                    <button className="btn btn-light">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* Modal */}
        <div
          className="modal right fade"
          id="add_lead"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog" role="document">
            <button
              type="button"
              className="close md-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title text-center">
                  <b>Add Lead</b>
                </h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <form id="add_new_lead_form">
                      <h4>Lead Information</h4>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Name <span className="text-danger">*</span></label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            name="lead_name"
                            onChange={handleLeadChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">is Keyman</label>
                          <Select options={LeadKeyManItems} onChange={handleSelectKeyMan} />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Lead Status</label>
                          <select className="form-control">
                            <option>Select</option>
                            <option>Open - Contacted</option>
                            <option>Open - Not Contacted</option>
                          </select>
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">
                            User Responsible
                          </label>
                          <select className="form-control">
                            <option>Select</option>
                            <option>John Doe</option>
                          </select>
                        </div>
                      </div>
                      {/* <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Lead Rating</label>
                          <input
                            type="number"
                            className="form-control"
                            name="rating"
                            placeholder="Rating"
                          />
                        </div>
                      </div> */}
                      <h4>Company Information</h4>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Organization</label>
                          <Select options={companyData} onChange={handleSelectCompany} />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Title</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Title"
                            name="position"
                            onChange={handleLeadChange}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Department</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Department"
                            name="department"
                            onChange={handleLeadChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Group</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Group"
                            name="group_"
                            onChange={handleLeadChange}
                          />
                        </div>
                      </div>
                      
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Region </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Region"
                            name="region"
                            onChange={handleLeadChange}
                          />
                        </div>
                      </div>
                      <h4>Contact Information</h4>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Mobile</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Mobile"
                            name="mobile_number"
                            onChange={handleLeadChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Email</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Email"
                            name="email"
                            onChange={handleLeadChange}
                          />
                        </div>
                        {/* <div className="col-sm-6">
                          <label className="col-form-label">
                            Email Opted out
                          </label>
                          <div>
                            <label className="container-checkbox">
                              <input type="checkbox" />
                              <span className="checkmark" />
                            </label>
                          </div>
                        </div> */}
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Phone</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Phone"
                            name="company_phone_number"
                            onChange={handleLeadChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">Fax</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Fax"
                            name="company_fax_number"
                            onChange={handleLeadChange}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Website</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Website"
                            name="homepage"
                            onChange={handleLeadChange}
                          />
                        </div>
                      </div>
                      {/* <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Sales Resource</label>
                          <select className="form-control">
                            <option>Web</option>
                            <option>Phone Enquiry</option>
                            <option>Partner Referral</option>
                            <option>Purchased List</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div> */}
                      {/* <h4>Address Information</h4>
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <label className="col-form-label">
                            Mailing Address
                          </label>
                          <textarea
                            className="form-control"
                            rows={3}
                            name="address"
                            placeholder="Address"
                            defaultValue={""}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="City"
                            name="city"
                          />
                        </div>
                        <div className="col-sm-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="State/Provience"
                            name="state"
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Postal Code"
                            name="postal"
                          />
                        </div>
                        <div className="col-sm-6">
                          <select className="form-control">
                            <option>India</option>
                            <option>US</option>
                            <option>Japan</option>
                          </select>
                        </div>
                      </div> */}
                      <h4>Additional Information</h4>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">
                            Sales Resource{" "}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Sales Resource"
                            name="sales_resource"
                            onChange={handleLeadChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="col-form-label">
                            Application Engineer
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Application Engineer"
                            name="application_engineer"
                            onChange={handleLeadChange}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <label className="col-form-label">Status</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            placeholder="Status"
                            defaultValue={""}
                            name="status"
                            onChange={handleLeadChange}
                          />
                        </div>
                      </div>
                      {/* <h4>Tag Information</h4>
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <label className="col-form-label">Tag List</label>
                          <input
                            type="text"
                            className="form-control"
                            name="tag-name"
                            placeholder="Tag List"
                          />
                        </div>
                      </div>
                      <h4>Permissions</h4>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label className="col-form-label">Permission</label>
                          <select className="form-control">
                            <option>Task Visibility</option>
                            <option>Private Task</option>
                          </select>
                        </div>
                      </div> */}
                      <div className="text-center py-3">
                        <button
                          type="button"
                          className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
                          onClick={handleAddNewLead}
                        >
                          Save
                        </button>
                        &nbsp;&nbsp;
                        <button
                          type="button"
                          className="btn btn-secondary btn-rounded"
                          data-bs-dismiss="modal"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            {/* modal-content */}
          </div>
          {/* modal-dialog */}
        </div>
        {/* modal */}
        <LeadsDetailsModel />
      </div>
    </HelmetProvider>
  );
};
export default Lead;
