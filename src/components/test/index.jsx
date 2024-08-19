import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";
import TextEditor from "../common/editor";
// import { Editor } from "react-draft-wysiwyg";
import EmailSidebar from "../sidebar/emailsidebar";

const mailSend = () => {

}

const EmailTest = () => {
    return (
      <>
        <EmailSidebar />
        <HelmetProvider>
        <div className="page-wrapper">
          <Helmet>
            <title>Email Test</title>
            <meta name="description" content="Inbox" />
          </Helmet>
        </div>
        {/* Page Header */}
        <div className="page-header py-3 mb-0">
            <div className="row align-items-center">
            <div className="col">
                <h3 className="page-title">Inbox</h3>
            </div>
            <div className="col-auto float-end ml-auto">
                <button
                      className="add btn btn-gradient-primary font-weight-bold text-white todo-list-add-btn btn-rounded"
                      id="multi-company-query"
                      onClick={mailSend()}
                  >
                    Test
                </button>  
            </div>
            </div>
        </div>
        {/* /Page Header */}
        </HelmetProvider>    
      </>
      );
};
export default EmailTest;