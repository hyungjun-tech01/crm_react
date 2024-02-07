import React from 'react';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import TextEditor from '../../common/editor';
// import { Editor } from "react-draft-wysiwyg";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const Texteditor =()=>{
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
            <span>Text Editor</span>
          </h3>
        </div>
        <div className="col text-end">
          <ul className="breadcrumb bg-white float-end m-0 ps-0 pe-0">
            <li className="breadcrumb-item">
              <Link to="/index">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Text Editor</li>
          </ul>
        </div>
      </div>
      {/* /Page Header */}
      <div className="row">
        {/* Editor */}
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Editor</h5>
            </div>
            <div className="card-body">
            {/* <Editor
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
            /> */}
            <TextEditor/>
            </div>
          </div>
        </div>
        {/* /Editor */}
      </div>
    </div>
  </div>
  {/* /Page Wrapper */}
</>

)};
export default Texteditor;        