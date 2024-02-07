/**
 * Form Elemets
 */
 import React from 'react';
 import { Helmet } from "react-helmet";
 import { Link } from "react-router-dom";
 import InputMask from 'react-input-mask';
 
const FormElements =()=> {
		 return (
			 <div className="page-wrapper">
			 <Helmet>
				   <title>Form Mask - CRMS Admin Template</title>
				   <meta name="description" content="Login page"/>					
			 </Helmet>
			 <div className="content container-fluid">
			   {/* Page Header */}
               <div className="crms-title row bg-white mb-4">
                    <div className="col  p-0">
                    <h3 className="page-title">
                        <span className="page-title-icon bg-gradient-primary text-white me-2">
                        <i className="fa fa-object-group" aria-hidden="true" />
                        </span> Form Mask</h3>
                    </div>
                    <div className="col p-0 text-end">
                    <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
                        <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                        <li className="breadcrumb-item active">Form Mask</li>
                    </ul>
                    </div>
                </div>
			   {/* /Page Header */}
			   <div className="row">
				 <div className="col-sm-12">
				   <div className="card mb-0">
					 <div className="card-header">
					   <h4 className="card-title mb-0">Form Mask</h4>
					   <p className="card-text pt-3">Input masks can be used to force the user to enter data conform a specific format. Unlike validation, the user can't enter any other key than the ones specified by the mask.</p>
					 </div>
					 <div className="card-body">
					   <form action="#">
						 <div className="form-group">
						   <label>Phone</label>
						   <InputMask className="form-control" mask="(999) 999-9999" ></InputMask>
						   <span className="form-text text-muted">(999) 999-9999</span>
						 </div>
						 <div className="form-group">
						   <label>Date</label>
						   <InputMask className="form-control" mask="99/99/9999" ></InputMask>
						   <span className="form-text text-muted">dd/mm/yyyy</span>
						 </div>
						 <div className="form-group">
						   <label>SSN field 1</label>
						   <InputMask className="form-control" mask="999-99-9999" ></InputMask>
						   <span className="form-text text-muted">e.g "999-99-9999"</span>
						 </div>
						 <div className="form-group">
						   <label>Phone field + ext.</label>
						   <InputMask className="form-control" mask="(999) 999-9999? x99999" ></InputMask>
						   <span className="form-text text-muted">+40 999 999 999</span>
						 </div>
						 <div className="form-group">
						   <label>Product Key</label>
						   <InputMask className="form-control" mask="a*-999-a999" ></InputMask>
						   <span className="form-text text-muted">e.g a*-999-a999</span>
						 </div>
						 <div className="form-group">
						   <label>Currency</label>
						   <InputMask className="form-control" mask="999,999,999.99" ></InputMask>
						   <span className="form-text text-muted">$ 999,999,999.99</span>
						 </div>
						 <div className="form-group">
						   <label>Eye Script</label>
						   <InputMask className="form-control" mask="~9.99 ~9.99 999" ></InputMask>
						   <span className="form-text text-muted">~9.99 ~9.99 999</span>
						 </div>
						 <div className="form-group">
						   <label>Percent</label>
						   <InputMask className="form-control" mask="99%" ></InputMask>
						   <span className="form-text text-muted">e.g "99%"</span>
						 </div>
						 <div className="form-group mb-0">
						   <label>Credit Card Number</label>
						   <InputMask className="form-control" mask="9999 9999 9999 9999" ></InputMask>
						   <span className="form-text text-muted">e.g "999.999.999.9999"</span>
						 </div>
					   </form>
					 </div>
				   </div>
				 </div>
			   </div>
			 </div>			
		   </div>
		 );
	 }
 export default FormElements;