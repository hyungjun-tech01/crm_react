import React from 'react';
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Table } from "antd";
import { itemRender, onShowSizeChange } from "../../paginationfunction"
import { iOutlinePlusCircle } from "react-icons/ai";
import "../../antdstyle.css"
import { FiEdit, FiPlusCircle, FiTrash2, FiXCircle } from 'react-icons/fi';
const Categories = () => {
  const data = [
    {
      id: 1,
      num: 1,
      Name: "Productivity",
      Date: "10/04/22",
      Added: "Admin",
      Status: "checkbox"
    },
    {
      id: 2,
      num: 2,
      Name: "Sales",
      Date: "10/04/22",
      Added: "Admin",
      Status: "checkbox"
    },
    {
      id: 3,
      num: 3,
      Name: "Marketing",
      Date: "10/04/22",
      Added: "Admin",
      Status: "checkbox"
    },
    {
      id: 4,
      num: 4,
      Name: "Management",
      Date: "10/04/22",
      Added: "Wegman",
      Status: "checkbox"
    }
  ]
  const columns = [
    {
      title: "#",
      dataIndex: "num",
      render: (text, record) => (
        <>{text}</>
      ),
      sorter: (a, b) => a.num.length - b.num.length,
    },
    {
      title: "Category Name",
      dataIndex: "Name",
      render: (text, record) => (
        <>{text}</>
      ),
      sorter: (a, b) => a.Name.length - b.Name.length,
    },
    {
      title: "Date",
      dataIndex: "Date",
      render: (text, record) => (
        <>{text}</>
      ),
      sorter: (a, b) => a.Date.length - b.Date.length,
    },
    {
      title: "Added By",
      dataIndex: "Added",
      render: (text, record) => (
        <>{text}</>
      ),
      sorter: (a, b) => a.Added.length - b.Added.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text, record) => {
        return (
         <div className="status-toggle">
           <input
             id={`rating${record?.id}`}
             className="check"
             type="checkbox"
           />
           <label
             htmlFor={`rating${record?.id}`}
             className="checktoggle checkbox-bg"
           >
             checkbox
           </label>
         </div>
       )},
      sorter: (a, b) => a.Status.length - b.Status.length,
    },
    {
      title: "Action",
      className: "text-end",
      dataIndex: "",
      render: (text, record) => (
        <div className="text-end">
          <a
            href="#"
            className="me-1 btn btn-sm bg-success-light"
            data-bs-toggle="modal"
            data-bs-target="#edit-blog-categories"
          >
            <FiEdit className="feather-edit-3 me-1" /> Edit
          </a>
          <a
            href="#"
            className="me-1 btn btn-sm bg-danger-light"
            data-bs-toggle="modal"
            data-bs-target="#deleteModal"
          >
            <FiTrash2 className="feather-trash-2 me-1" /> Delete
          </a>
        </div>
      ),
      sorter: (a, b) => a.star.length - b.star.length,
    }
  ];
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <Helmet>
          <title>Dashboard - CRMS admin Template</title>
          <meta name="description" content="Reactify Blank Page" />
        </Helmet>
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">Categories</h3>
              </div>
              <div className="col-auto text-end">
                <a
                  href="#"
                  className="btn btn-primary btn-blog mb-3"
                  data-bs-toggle="modal"
                  data-bs-target="#blog-categories"
                >
                  <FiPlusCircle /> Add New
                </a>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="card categories-table">
                <div className="card-body">
                  <div className="table-responsive">
                    <Table
                      className="table"
                      style={{ overflowX: "auto" }}
                      pagination={{
                        total: data.length,
                        showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger: true, onShowSizeChange: onShowSizeChange, itemRender: itemRender
                      }}
                      columns={columns}
                      dataSource={data}
                      rowKey={(record) => record.id}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* modal */}
        <div
          className="modal custom-modal fade bank-details"
          id="blog-categories"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <div className="form-header text-start mb-0">
                  <h4 className="mb-0 text-dark fw-bold">Add Category</h4>
                </div>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="bank-inner-details">
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label>
                          Category Name<span className="text-danger">*</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label>
                          Slug<span className="text-danger">*</span>
                        </label>
                        <input type="text" className="form-control" />
                        <small className="form-text text-muted">
                          {" "}
                          (If you leave it empty, it will be generated
                          automatically.)
                        </small>
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label>
                          Description (Meta Tag)
                          <span className="text-danger">*</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label>
                          Keywords (Meta Tag)<span className="text-danger">*</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label>
                          Order<span className="text-danger">*</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <div className="status-toggle">
                        <input
                          id="rating_5"
                          className="check"
                          type="checkbox"
                          defaultChecked=""
                        />
                        <label
                          htmlFor="rating_5"
                          className="checktoggle checkbox-bg "
                        >
                          checkbox
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer blog-categories-btn">
                <div className="bank-details-btn ">
                  <a
                    href="#"
                    data-bs-dismiss="modal"
                    className="btn btn-primary me-2"
                  >
                    Add Category
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* modal */}
        <div
          className="modal custom-modal fade bank-details"
          id="edit-blog-categories"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <div className="form-header text-start mb-0">
                  <h4 className="mb-0 text-dark fw-bold">Edit Category</h4>
                </div>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="bank-inner-details">
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label>
                          Category Name<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="Productivity"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label>
                          Slug<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="Productivity"
                        />
                        <small className="form-text text-muted">
                          {" "}
                          (If you leave it empty, it will be generated
                          automatically.)
                        </small>
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label>
                          Description (Meta Tag)
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="category Productivity"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label>
                          Keywords (Meta Tag)<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="category Productivity"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label>
                          Order<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={3}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <div className="status-toggle">
                        <input
                          id="rating_6"
                          className="check"
                          type="checkbox"
                          defaultChecked=""
                        />
                        <label
                          htmlFor="rating_6"
                          className="checktoggle checkbox-bg "
                        >
                          checkbox
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer blog-categories-btn">
                <div className="bank-details-btn ">
                  <a
                    href="#"
                    data-bs-dismiss="modal"
                    className="btn btn-primary me-2"
                  >
                    Add Category
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Modal */}
        <div
          className="modal fade contentmodal"
          id="deleteModal"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content doctor-profile">
              <div className="modal-header pb-0 border-bottom-0  justify-content-end">
                <button
                  type="button"
                  className="close-btn"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                    <i><FiXCircle className="feather-x-circle" /></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="delete-wrap text-center">
                  <div className="del-icon">
                  <i><FiXCircle className="feather-x-circle" /></i>
                  </div>
                  <h2>Sure you want to delete</h2>
                  <div className="submit-section">
                    <Link to="/categories" className="btn btn-success me-2">
                      Yes
                    </Link>
                    <a href="#" className="btn btn-danger" data-bs-dismiss="modal">
                      No
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Modal */}
      </div>
      {/* /Page Wrapper */}
      {/* /Main Wrapper */}
      {/* Modal */}
      <div className="modal fade confirmModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-3">
            <div className="modal-header border-bottom-0">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="text-center">
                <h5 className="mb-3">Confirm Save Changes</h5>
                <button
                  type="button"
                  className="btn btn-dark w-md"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary w-md"
                  data-bs-dismiss="modal"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  )
};
export default Categories;