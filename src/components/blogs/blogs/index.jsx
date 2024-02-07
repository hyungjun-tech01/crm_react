import React from 'react';
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { IMG01, IMG02, IMG03, IMG04, IMG05,IMG06,AVATHAR01,AVATHAR02,AVATHAR03,AVATHAR04,AVATHAR05,AVATHAR06 } from "./img"
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FiChevronLeft, FiChevronRight, FiEdit, FiEye, FiEyeOff, FiPlusCircle, FiTrash2, FiXCircle } from 'react-icons/fi';
const Blogs =()=>{
    return(
        <div className="page-wrapper">
    <Helmet>
      <title>Dashboard - CRMS admin Template</title>
      <meta name="description" content="Reactify Blank Page" />
  </Helmet>
        <div className="content container-fluid">
            {/* Page Header */}
            {/* Blog List */}
            <div className="row">
            <div className="col-md-9">
                <ul className="list-links mb-4">
                <li className="active">
                    <Link to="/blog">Active Blog</Link>
                </li>
                <li>
                    <Link to="/pending-blog">Pending Blog</Link>
                </li>
                </ul>
            </div>
            <div className="col-md-3 text-md-end">
                <Link to="/add-blog" className="btn btn-primary btn-blog mb-3">
                <FiPlusCircle /> Add New
                </Link>
            </div>
            </div>
            <div className="row">
            {/* Blog Post */}
            <div className="col-md-6 col-xl-4 col-sm-12 d-flex">
                <div className="blog grid-blog flex-fill">
                <div className="blog-image">
                    <Link to="/blog-details">
                    <img
                        className="img-fluid"
                        src={IMG01}
                        alt="Post Image"
                    />
                    </Link>
                    <div className="blog-views">
                    <FiEye className="feather-eye me-1" /> 225
                    </div>
                </div>
                <div className="blog-content">
                    <ul className="entry-meta meta-item">
                    <li>
                        <div className="post-author">
                        <Link to="/profile">
                            <img
                            src={AVATHAR01}
                            alt="Post Author"
                            />
                            <span>
                            <span className="post-title">Vincent</span>
                            <span className="post-date">
                                <i className="far fa-clock" /> 4 Dec 2022
                            </span>
                            </span>
                        </Link>
                        </div>
                    </li>
                    </ul>
                    <h3 className="blog-title">
                    <Link to="/blog-details">
                        3 Ways How CRM Data Builds Customer Journey
                    </Link>
                    </h3>
                    <p>
                    Lorem ipsum dolor sit amet, consectetur em adipiscing elit, sed do
                    eiusmod tempor.
                    </p>
                </div>
                <div className="row">
                    <div className="edit-options">
                    <div className="edit-delete-btn">
                        <Link to="/edit-blog" className="text-success">
                        <FiEdit className="feather-edit-3 me-1" /> Edit
                        </Link>
                        <a
                        href="#"
                        className="text-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteModal"
                        >
                        <FiTrash2 className="feather-trash-2 me-1" /> Delete
                        </a>
                    </div>
                    <div className="text-end inactive-style">
                        <a
                        href="#"
                        className="text-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteNotConfirmModal"
                        >
                        <FiEyeOff className="feather-eye-off me-1" /> Inactive
                        </a>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            {/* /Blog Post */}
            {/* Blog Post */}
            <div className="col-md-6 col-xl-4 col-sm-12 d-flex">
                <div className="blog grid-blog flex-fill">
                <div className="blog-image">
                    <Link to="/blog-details">
                    <img
                        className="img-fluid"
                        src={IMG02}
                        alt="Post Image"
                    />
                    </Link>
                    <div className="blog-views">
                    <FiEye className="feather-eye me-1" /> 132
                    </div>
                </div>
                <div className="blog-content">
                    <ul className="entry-meta meta-item">
                    <li>
                        <div className="post-author">
                        <Link to="/profile">
                            <img
                            src={AVATHAR02}
                            alt="Post Author"
                            />
                            <span>
                            <span className="post-title">Lois A</span>
                            <span className="post-date">
                                <i className="far fa-clock" /> 4 Dec 2022
                            </span>
                            </span>
                        </Link>
                        </div>
                    </li>
                    </ul>
                    <h3 className="blog-title">
                    <Link to="/blog-details">
                        Powerful Sales CRM Software Tips for 2022
                    </Link>
                    </h3>
                    <p>
                    Lorem ipsum dolor sit amet, consectetur em adipiscing elit, sed do
                    eiusmod tempor.
                    </p>
                </div>
                <div className="row">
                    <div className="edit-options">
                    <div className="edit-delete-btn">
                        <Link to="/edit-blog" className="text-success">
                        <FiEdit className="feather-edit-3 me-1" /> Edit
                        </Link>
                        <a
                        href="edit-blog"
                        className="text-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteModal"
                        >
                        <FiTrash2 className="feather-trash-2 me-1" /> Delete
                        </a>
                    </div>
                    <div className="text-end inactive-style">
                        <a
                        href="#"
                        className="text-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteNotConfirmModal"
                        >
                        <FiEyeOff className="feather-eye-off me-1" /> Inactive
                        </a>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            {/* /Blog Post */}
            {/* Blog Post */}
            <div className="col-md-6 col-xl-4 col-sm-12 d-flex">
                <div className="blog grid-blog flex-fill">
                <div className="blog-image">
                    <Link to="/blog-details">
                    <img
                        className="img-fluid"
                        src={IMG03}
                        alt="Post Image"
                    />
                    </Link>
                    <div className="blog-views">
                    <FiEye className="feather-eye me-1" /> 344
                    </div>
                </div>
                <div className="blog-content">
                    <ul className="entry-meta meta-item">
                    <li>
                        <div className="post-author">
                        <Link to="/profile">
                            <img
                            src={AVATHAR03}
                            alt="Post Author"
                            />
                            <span>
                            <span className="post-title">Levell Scott</span>
                            <span className="post-date">
                                <i className="far fa-clock" /> 4 Dec 2022
                            </span>
                            </span>
                        </Link>
                        </div>
                    </li>
                    </ul>
                    <h3 className="blog-title">
                    <Link to="/blog-details">
                        5 Powerful and Key CRM Trends and Statistics You Should Know in
                        2022
                    </Link>
                    </h3>
                    <p>
                    Lorem ipsum dolor sit amet, consectetur em adipiscing elit, sed do
                    eiusmod tempor.
                    </p>
                </div>
                <div className="row">
                    <div className="edit-options">
                    <div className="edit-delete-btn">
                        <Link to="/edit-blog" className="text-success">
                        <FiEdit className="feather-edit-3 me-1" /> Edit
                        </Link>
                        <a
                        href="edit-blog"
                        className="text-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteModal"
                        >
                        <FiTrash2 className="feather-trash-2 me-1" /> Delete
                        </a>
                    </div>
                    <div className="text-end inactive-style">
                        <a
                        href="#"
                        className="text-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteNotConfirmModal"
                        >
                        <FiEyeOff className="feather-eye-off me-1" /> Inactive
                        </a>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            {/* /Blog Post */}
            {/* Blog Post */}
            <div className="col-md-6 col-xl-4 col-sm-12 d-flex">
                <div className="blog grid-blog flex-fill">
                <div className="blog-image">
                    <Link to="/blog-details">
                    <img
                        className="img-fluid"
                        src={IMG04}
                        alt="Post Image"
                    />
                    </Link>
                    <div className="blog-views">
                    <FiEye className="feather-eye me-1" /> 215
                    </div>
                </div>
                <div className="blog-content">
                    <ul className="entry-meta meta-item">
                    <li>
                        <div className="post-author">
                        <Link to="/profile">
                            <img
                            src={AVATHAR04}
                            alt="Post Author"
                            />
                            <span>
                            <span className="post-title">Calvin</span>
                            <span className="post-date">
                                <i className="far fa-clock" /> 4 Dec 2022
                            </span>
                            </span>
                        </Link>
                        </div>
                    </li>
                    </ul>
                    <h3 className="blog-title">
                    <Link to="/blog-details">
                        The Best CRM for Real Estate Agencies in 2022{" "}
                    </Link>
                    </h3>
                    <p>
                    Lorem ipsum dolor sit amet, consectetur em adipiscing elit, sed do
                    eiusmod tempor.
                    </p>
                </div>
                <div className="row">
                    <div className="edit-options">
                    <div className="edit-delete-btn">
                        <Link to="/edit-blog" className="text-success">
                        <FiEdit className="feather-edit-3 me-1" /> Edit
                        </Link>
                        <a
                        href="edit-blog"
                        className="text-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteModal"
                        >
                        <FiTrash2 className="feather-trash-2 me-1" /> Delete
                        </a>
                    </div>
                    <div className="text-end inactive-style">
                        <a
                        href="#"
                        className="text-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteNotConfirmModal"
                        >
                        <FiEyeOff className="feather-eye-off me-1" /> Inactive
                        </a>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            {/* /Blog Post */}
            {/* Blog Post */}
            <div className="col-md-6 col-xl-4 col-sm-12 d-flex">
                <div className="blog grid-blog flex-fill">
                <div className="blog-image">
                    <Link to="/blog-details">
                    <img
                        className="img-fluid"
                        src={IMG05}
                        alt="Post Image"
                    />
                    </Link>
                    <div className="blog-views">
                    <FiEye className="feather-eye me-1" /> 285
                    </div>
                </div>
                <div className="blog-content">
                    <ul className="entry-meta meta-item">
                    <li>
                        <div className="post-author">
                        <Link to="/profile">
                            <img
                            src={AVATHAR05}
                            alt="Post Author"
                            />
                            <span>
                            <span className="post-title">Aaliyah </span>
                            <span className="post-date">
                                <i className="far fa-clock" /> 4 Dec 2022
                            </span>
                            </span>
                        </Link>
                        </div>
                    </li>
                    </ul>
                    <h3 className="blog-title">
                    <Link to="/blog-details">
                        Best Customer Relationship Management Software for Businesses
                    </Link>
                    </h3>
                    <p>
                    Lorem ipsum dolor sit amet, consectetur em adipiscing elit, sed do
                    eiusmod tempor.
                    </p>
                </div>
                <div className="row">
                    <div className="edit-options">
                    <div className="edit-delete-btn">
                        <Link to="/edit-blog" className="text-success">
                        <FiEdit className="feather-edit-3 me-1" /> Edit
                        </Link>
                        <a
                        href="edit-blog"
                        className="text-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteModal"
                        >
                        <FiTrash2 className="feather-trash-2 me-1" /> Delete
                        </a>
                    </div>
                    <div className="text-end inactive-style">
                        <a
                        href="#"
                        className="text-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteNotConfirmModal"
                        >
                        <FiEyeOff className="feather-eye-off me-1" /> Inactive
                        </a>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            {/* /Blog Post */}
            {/* Blog Post */}
            <div className="col-md-6 col-xl-4 col-sm-12 d-flex">
                <div className="blog grid-blog flex-fill">
                <div className="blog-image">
                    <Link to="/blog-details">
                    <img
                        className="img-fluid"
                        src={IMG06}
                        alt="Post Image"
                    />
                    </Link>
                    <div className="blog-views">
                    <FiEye className="feather-eye me-1" /> 654
                    </div>
                </div>
                <div className="blog-content">
                    <ul className="entry-meta meta-item">
                    <li>
                        <div className="post-author">
                        <Link to="/profile">
                            <img
                            src={AVATHAR06}
                            alt="Post Author"
                            />
                            <span>
                            <span className="post-title">Malynne</span>
                            <span className="post-date">
                                <i className="far fa-clock" /> 4 Dec 2022
                            </span>
                            </span>
                            </Link>
                        </div>
                    </li>
                    </ul>
                    <h3 className="blog-title">
                    <Link to="/blog-details">
                        Everything You Need To Know About CRM Systems in 2022
                    </Link>
                    </h3>
                    <p>
                    Lorem ipsum dolor sit amet, consectetur em adipiscing elit, sed do
                    eiusmod tempor.
                    </p>
                </div>
                <div className="row">
                    <div className="edit-options">
                    <div className="edit-delete-btn">
                        <Link to="/edit-blog" className="text-success">
                        <FiEdit className="feather-edit-3 me-1" /> Edit
                        </Link>
                        <a
                        href="edit-blog"
                        className="text-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteModal"
                        >
                        <FiTrash2 className="feather-trash-2 me-1" /> Delete
                        </a>
                    </div>
                    <div className="text-end inactive-style">
                        <a
                        href="#"
                        className="text-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteNotConfirmModal"
                        >
                        <FiEyeOff className="feather-eye-off me-1" /> Inactive
                        </a>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            {/* /Blog Post */}
            </div>
            {/* Pagination */}
            <div className="row ">
            <div className="col-md-12">
                <div className="pagination-tab  d-flex justify-content-center">
                <ul className="pagination mb-0">
                    <li className="page-item disabled">
                    <a className="page-link" href="#" tabIndex={-1}>
                        <FiChevronLeft className="feather-chevron-left me-2" />
                        Previous
                    </a>
                    </li>
                    <li className="page-item">
                    <a className="page-link" href="#">
                        1
                    </a>
                    </li>
                    <li className="page-item active">
                    <a className="page-link" href="#">
                        2 <span className="sr-only">(current)</span>
                    </a>
                    </li>
                    <li className="page-item">
                    <a className="page-link" href="#">
                        3
                    </a>
                    </li>
                    <li className="page-item">
                    <a className="page-link" href="#">
                        4
                    </a>
                    </li>
                    <li className="page-item">
                    <a className="page-link" href="#">
                        Next
                        <FiChevronRight className="feather-chevron-right ml-2" />
                    </a>
                    </li>
                </ul>
                </div>
            </div>
            </div>
            {/* /Pagination */}
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
                        <Link to="/blog" className="btn btn-success me-2">
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
        </div>
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

        </div>
    )
};
 export default Blogs;