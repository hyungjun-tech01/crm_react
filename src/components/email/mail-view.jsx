import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import {avatar02,Placeholder} from "../imagepath"
import EmailSidebar from "../sidebar/emailsidebar";


const MailView =()=> {    
    return (
    <>  <EmailSidebar />
       <div className="page-wrapper">
        <Helmet>
          <title>Mail view - CRMS Admin Template</title>
          <meta name="description" content="Inbox"/>					
        </Helmet>
              {/* Page Content */}
      <div className="content container-fluid">
        <div className="crms-title row bg-white">
          <div className="col  p-0">
            <h3 className="page-title m-0">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                <i className="fa fa-envelope menu-icon" aria-hidden="true" />
              </span> View Message </h3>
          </div>
          <div className="col p-0 text-end">
            <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item active">Message</li>
            </ul>
          </div>
        </div>
        {/* Page Header */}
        <div className="page-header py-3 mb-0">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">View Message</h3>
            </div>
            <div className="col-auto float-end ml-auto">
              <a href="#" data-bs-toggle="modal" data-bs-target="#compose-mail" className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded"><i className="fa fa-plus" /> Compose</a>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row">
          <div className="col-sm-12">
            <div className="card mb-0">
              <div className="card-body">
                <div className="mailview-content">
                  <div className="mailview-header">
                    <div className="row">
                      <div className="col-sm-9">
                        <div className="text-ellipsis m-b-10">
                          <span className="mail-view-title">CRMS Bootstrap Admin Template</span>
                        </div>
                      </div>
                      <div className="col-sm-3">
                        <div className="mail-view-action">
                          <div className="btn-group">
                            <button type="button" className="btn btn-white btn-sm" data-bs-toggle="tooltip" title="Delete"> <i className="fa fa-trash-o" /></button>
                            <button type="button" className="btn btn-white btn-sm" data-bs-toggle="tooltip" title="Reply"> <i className="fa fa-reply" /></button>
                            <button type="button" className="btn btn-white btn-sm" data-bs-toggle="tooltip" title="Forward"> <i className="fa fa-share" /></button>
                          </div>
                          <button type="button" className="btn btn-white btn-sm" data-bs-toggle="tooltip" title="Print"> <i className="fa fa-print" /></button>
                        </div>
                      </div>
                    </div>
                    <div className="sender-info">
                      <div className="sender-img">
                        <img width={40} alt="" src={avatar02} className="rounded-circle" />
                      </div>
                      <div className="receiver-details float-start">
                        <span className="sender-name">John Doe (johnjoe@example.com)</span>
                        <span className="receiver-name">
                          to
                          <span>me</span>, <span>Richard</span>, <span>Paul</span>
                        </span>	
                      </div>	
                      <div className="mail-sent-time">
                        <span className="mail-time">18 Feb 2019 9:42 AM</span>
                      </div>
                      <div className="clearfix" />
                    </div>
                  </div>
                  <div className="mailview-inner">
                    <p>Hello Richard,</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <p>Thanks,<br />
                      John Doe</p>
                  </div>
                </div>
                <div className="mail-attachments">
                  <p><i className="fa fa-paperclip" /> 2 Attachments - <a href="#">View all</a> | <a href="#">Download all</a></p>
                  <ul className="attachments clearfix">
                    <li>
                      <div className="attach-file"><i className="fa fa-file-pdf-o" /></div>
                      <div className="attach-info"> <a href="#" className="attach-filename">daily_meeting.pdf</a> <div className="attach-fileize"> 842 KB</div></div>
                    </li>
                    <li>
                      <div className="attach-file"><i className="fa fa-file-word-o" /></div>
                      <div className="attach-info"> <a href="#" className="attach-filename">documentation.docx</a> <div className="attach-fileize"> 2,305 KB</div></div>
                    </li>
                    <li>
                      <div className="attach-file"><img src={Placeholder} alt="Attachment" /></div>
                      <div className="attach-info"> <a href="#" className="attach-filename">webdesign.png</a> <div className="attach-fileize"> 1.42 MB</div></div>
                    </li>
                    <li>
                      <div className="attach-file"><img src={Placeholder} alt="Attachment" /></div>
                      <div className="attach-info"> <a href="#" className="attach-filename">webdevelopment.png</a> <div className="attach-fileize"> 1.1 MB</div></div>
                    </li>
                  </ul>
                </div>
                <div className="mailview-footer">
                  <div className="row">
                    <div className="col-sm-6 left-action">
                      <button type="button" className="btn btn-white"><i className="fa fa-reply" /> Reply</button>
                      <button type="button" className="btn btn-white"><i className="fa fa-share" /> Forward</button>
                    </div>
                    <div className="col-sm-6 right-action">
                      <button type="button" className="btn btn-white"><i className="fa fa-print" /> Print</button>
                      <button type="button" className="btn btn-white"><i className="fa fa-trash-o" /> Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
       {/*modal section starts here*/}
       <div className="modal fade right" id="compose-mail">
        <div className="modal-dialog">
          <button type="button" className="close md-close" data-bs-dismiss="modal">×</button>
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h4 className="modal-title">Compose New Mail</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            {/* Modal body */}
            <div className="modal-body">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card mb-0">
                    <div className="card-body">
                      <form>
                        <div className="form-group">
                          <input type="email" placeholder="To" className="form-control" />
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <input type="email" placeholder="Cc" className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <input type="email" placeholder="Bcc" className="form-control" />
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <input type="text" placeholder="Subject" className="form-control" />
                        </div>
                        <div className="form-group">
                          <textarea rows={4} className="form-control" placeholder="Enter your message here" defaultValue={""} />
                        </div>
                        <div className="form-group mb-0">
                          <div className="text-center">
                            <button className="btn btn-primary"><span>Send</span> <i className="fa fa-send m-l-5" /></button>
                            <button className="btn btn-success m-l-5" type="button"><span>Draft</span> <i className="fa fa-floppy-o m-l-5" /></button>
                            <button className="btn btn-danger m-l-5" type="button"><span>Delete</span> <i className="fa fa-trash-o m-l-5" /></button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      </>
    );
  }
export default MailView;
