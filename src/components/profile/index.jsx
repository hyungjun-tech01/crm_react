import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import {avatar02,avatar16} from "../imagepath"

const Profile =()=> {
    return (
      <div className="page-wrapper">
        <Helmet>
            <title>Profile - CRMS admin Template</title>
            <meta name="description" content="Reactify Blank Page" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          <div className="crms-title row bg-white">
            <div className="col  p-0">
              <h3 className="page-title m-0">
                <span className="page-title-icon bg-gradient-primary text-white me-2">
                  <i className="feather-user" />
                </span> Employee Profile </h3>
            </div>
            <div className="col p-0 text-end">
              <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
                <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                <li className="breadcrumb-item active">Employee Profile</li>
              </ul>
            </div>
          </div>
          {/* Page Header */}
          <div className="page-header pt-3 mb-0">
            <div className="card ">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="profile-view">
                      <div className="profile-img-wrap">
                        <div className="profile-img">
                          <a href="#"><img alt="" src={avatar02} /></a>
                        </div>
                      </div>
                      <div className="profile-basic">
                        <div className="row">
                          <div className="col-md-5">
                            <div className="profile-info-left">
                              <h3 className="user-name m-t-0 mb-0">John Doe</h3>
                              <h6 className="text-muted">UI/UX Design Team</h6>
                              <small className="text-muted">Web Designer</small>
                              <div className="staff-id">Employee ID : FT-0001</div>
                              <div className="small doj text-muted">Date of Join : 1st Jan 2013</div>
                              <div className="staff-msg"><a className="btn btn-custom" href="#">Send Message</a></div>
                            </div>
                          </div>
                          <div className="col-md-7">
                            <ul className="personal-info">
                              <li>
                                <div className="title">Phone:</div>
                                <div className="text"><a>9876543210</a></div>
                              </li>
                              <li>
                                <div className="title">Email:</div>
                                <div className="text"><a>johndoe@example.com</a></div>
                              </li>
                              <li>
                                <div className="title">Birthday:</div>
                                <div className="text">24th July</div>
                              </li>
                              <li>
                                <div className="title">Address:</div>
                                <div className="text">1861 Bayonne Ave, Manchester Township, NJ, 08759</div>
                              </li>
                              <li>
                                <div className="title">Gender:</div>
                                <div className="text">Male</div>
                              </li>
                              <li>
                                <div className="title">Reports to:</div>
                                <div className="text">
                                  <div className="avatar-box">
                                    <div className="avatar avatar-xs">
                                      <img src={avatar16} alt="" />
                                    </div>
                                  </div>
                                  <Link to="profile">
                                    Jeffery Lalor
                                  </Link>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="pro-edit"><a data-bs-target="#profile_info" data-bs-toggle="modal" className="edit-icon" href="#"><i className="fa fa-pencil" /></a></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-content p-0">
              {/* Profile Info Tab */}
              <div id="emp_profile" className="pro-overview tab-pane fade show active">
                <div className="row">
                  <div className="col-md-6 d-flex">
                    <div className="card profile-box flex-fill">
                      <div className="card-body">
                        <h3 className="card-title">Personal Informations <a href="#" className="edit-icon" data-bs-toggle="modal" data-bs-target="#personal_info_modal"><i className="fa fa-pencil" /></a></h3>
                        <ul className="personal-info">
                          <li>
                            <div className="title">Passport No.</div>
                            <div className="text">9876543210</div>
                          </li>
                          <li>
                            <div className="title">Passport Exp Date.</div>
                            <div className="text">9876543210</div>
                          </li>
                          <li>
                            <div className="title">Tel</div>
                            <div className="text"><a>9876543210</a></div>
                          </li>
                          <li>
                            <div className="title">Nationality</div>
                            <div className="text">Indian</div>
                          </li>
                          <li>
                            <div className="title">Religion</div>
                            <div className="text">Christian</div>
                          </li>
                          <li>
                            <div className="title">Marital status</div>
                            <div className="text">Married</div>
                          </li>
                          <li>
                            <div className="title">Employment of spouse</div>
                            <div className="text">No</div>
                          </li>
                          <li>
                            <div className="title">No. of children</div>
                            <div className="text">2</div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 d-flex">
                    <div className="card profile-box flex-fill">
                      <div className="card-body">
                        <h3 className="card-title">Emergency Contact <a href="#" className="edit-icon" data-bs-toggle="modal" data-bs-target="#emergency_contact_modal"><i className="fa fa-pencil" /></a></h3>
                        <h5 className="section-title">Primary</h5>
                        <ul className="personal-info">
                          <li>
                            <div className="title">Name</div>
                            <div className="text">John Doe</div>
                          </li>
                          <li>
                            <div className="title">Relationship</div>
                            <div className="text">Father</div>
                          </li>
                          <li>
                            <div className="title">Phone </div>
                            <div className="text">9876543210, 9876543210</div>
                          </li>
                        </ul>
                        <hr />
                        <h5 className="section-title">Secondary</h5>
                        <ul className="personal-info">
                          <li>
                            <div className="title">Name</div>
                            <div className="text">Karen Wills</div>
                          </li>
                          <li>
                            <div className="title">Relationship</div>
                            <div className="text">Brother</div>
                          </li>
                          <li>
                            <div className="title">Phone </div>
                            <div className="text">9876543210, 9876543210</div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 d-flex">
                    <div className="card profile-box flex-fill">
                      <div className="card-body">
                        <h3 className="card-title">Bank information</h3>
                        <ul className="personal-info">
                          <li>
                            <div className="title">Bank name</div>
                            <div className="text">ICICI Bank</div>
                          </li>
                          <li>
                            <div className="title">Bank account No.</div>
                            <div className="text">159843014641</div>
                          </li>
                          <li>
                            <div className="title">IFSC Code</div>
                            <div className="text">ICI24504</div>
                          </li>
                          <li>
                            <div className="title">PAN No</div>
                            <div className="text">TC000Y56</div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 d-flex">
                    <div className="card profile-box flex-fill">
                      <div className="card-body">
                        <h3 className="card-title">Family Informations <a href="#" className="edit-icon" data-bs-toggle="modal" data-bs-target="#family_info_modal"><i className="fa fa-pencil" /></a></h3>
                        <div className="table-responsive">
                          <table className="table table-nowrap">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Relationship</th>
                                <th>Date of Birth</th>
                                <th>Phone</th>
                                <th />
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Leo</td>
                                <td>Brother</td>
                                <td>Feb 16th, 2019</td>
                                <td>9876543210</td>
                                <td className="text-end">
                                  <div className="dropdown dropdown-action">
                                    <a aria-expanded="false" data-bs-toggle="dropdown" className="action-icon dropdown-toggle" href="#"><i className="material-icons">more_vert</i></a>
                                    <div className="dropdown-menu dropdown-menu-right">
                                      <a href="#" className="dropdown-item"><i className="fa fa-pencil m-r-5" /> Edit</a>
                                      <a href="#" className="dropdown-item"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 d-flex">
                    <div className="card profile-box flex-fill mb-0">
                      <div className="card-body">
                        <h3 className="card-title">Education Informations <a href="#" className="edit-icon" data-bs-toggle="modal" data-bs-target="#education_info"><i className="fa fa-pencil" /></a></h3>
                        <div className="experience-box">
                          <ul className="experience-list">
                            <li>
                              <div className="experience-user">
                                <div className="before-circle" />
                              </div>
                              <div className="experience-content">
                                <div className="timeline-content">
                                  <a href="#/" className="name">International College of Arts and Science (UG)</a>
                                  <div>Bsc Computer Science</div>
                                  <span className="time">2000 - 2003</span>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="experience-user">
                                <div className="before-circle" />
                              </div>
                              <div className="experience-content">
                                <div className="timeline-content">
                                  <a href="#/" className="name">International College of Arts and Science (PG)</a>
                                  <div>Msc Computer Science</div>
                                  <span className="time">2000 - 2003</span>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 d-flex">
                    <div className="card profile-box flex-fill mb-0">
                      <div className="card-body">
                        <h3 className="card-title">Experience <a href="#" className="edit-icon" data-bs-toggle="modal" data-bs-target="#experience_info"><i className="fa fa-pencil" /></a></h3>
                        <div className="experience-box">
                          <ul className="experience-list">
                            <li>
                              <div className="experience-user">
                                <div className="before-circle" />
                              </div>
                              <div className="experience-content">
                                <div className="timeline-content">
                                  <a href="#/" className="name">Web Designer at Zen Corporation</a>
                                  <span className="time">Jan 2013 - Present (5 years 2 months)</span>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="experience-user">
                                <div className="before-circle" />
                              </div>
                              <div className="experience-content">
                                <div className="timeline-content">
                                  <a href="#/" className="name">Web Designer at Ron-tech</a>
                                  <span className="time">Jan 2013 - Present (5 years 2 months)</span>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="experience-user">
                                <div className="before-circle" />
                              </div>
                              <div className="experience-content">
                                <div className="timeline-content">
                                  <a href="#/" className="name">Web Designer at Dalt Technology</a>
                                  <span className="time">Jan 2013 - Present (5 years 2 months)</span>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Profile Info Tab */}
            </div>
          </div>
          {/* /Page Header */}
        </div>
        {/* /Page Content */}
      </div>
    );
  }
export default Profile;
