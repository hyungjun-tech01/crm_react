import React,{useState} from 'react';
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Select from 'react-select';
import TextEditor from '../../common/editor';
import ReactTagsInput from '../tags.jsx';
// import { Editor } from "react-draft-wysiwyg";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const	category=[
            {label : "Productivity",value : 1},
            {label : "Sales",value : 2},
            {label : "Marketing",value : 3},
        ];
const AddBlog =()=>{
  const [selectedOption, setSelectedOption] = useState(null);
    return(
<>
  {/* Page Wrapper */}
  <div className="page-wrapper">
  <Helmet>
      <title>Dashboard - CRMS admin Template</title>
      <meta name="description" content="Reactify Blank Page" />
  </Helmet>
    <div className="content container-fluid">
      <div className="row">
        <div className="col-xl-8 offset-xl-2">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">Add Post</h3>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="card">
            <div className="card-body">
              <div className="bank-inner-details">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>
                        Title<span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group modal-select-box">
                      <label>Category</label>
                      <Select
                          placeholder = "Select"
                          defaultValue={selectedOption}
                          onChange={setSelectedOption}
                          options={category}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Tag</label>
                      <ReactTagsInput key='tag1' />   
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Blog Image</label>
                      <div className="change-photo-btn">
                        <div>
                          <p>Add Image</p>
                        </div>
                        <input type="file" className="upload" />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Description</label>
                      {/* <Editor
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                      /> */}
                      <TextEditor/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" blog-categories-btn pt-0">
              <div className="bank-details-btn ">
                <Link to="/blog" className="btn btn-primary me-2">
                  Add Post
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
export default AddBlog;