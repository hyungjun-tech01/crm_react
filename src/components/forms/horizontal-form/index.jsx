/**
 * Form Elemets
 */
 import React, { useState } from 'react';
 import { Helmet } from "react-helmet";
 import { Link } from "react-router-dom";
 import Select from 'react-select';
 
			const blood_group_list=[
                {label : "A+",value : 1},
                {label : "O+",value : 2},
                {label : "B+",value : 3},
                {label : "AB+",value : 4},
            ];
			const country_list=[
                {label : "USA",value : 1},
                {label : "France",value : 2},
                {label : "India",value : 3},
                {label : "Spain",value : 4},
            ];
			const state_list=[
                {label : "California",value : 1},
                {label : "Texas",value : 2},
                {label : "Tamilnadu",value : 3},
                {label : "Florida",value : 4},
            ];

		const FormElements =()=> {
			const [selectedOption, setSelectedOption] = useState(null);
		 return (
			 <div className="page-wrapper">
			 <Helmet>
				   <title>Horizontal Form - CRMS Admin Template</title>
				   <meta name="description" content="Login page"/>					
			 </Helmet>
		 <div className="content container-fluid">
		   {/* Page Header */}
		   <div className="crms-title row bg-white mb-4">
				<div className="col  p-0">
				<h3 className="page-title">
					<span className="page-title-icon bg-gradient-primary text-white me-2">
					<i className="fa fa-object-group" aria-hidden="true" />
					</span> Horizontal Form </h3>
				</div>
				<div className="col p-0 text-end">
				<ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
					<li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
					<li className="breadcrumb-item active">Horizontal Form</li>
				</ul>
				</div>
			</div>
		   {/* /Page Header */}
		   <div className="row">
			 <div className="col-xl-6 d-flex">
			   <div className="card flex-fill">
				 <div className="card-header">
				   <h4 className="card-title mb-0">Basic Form</h4>
				 </div>
				 <div className="card-body">
				   <form action="#">
					 <div className="form-group row">
					   <label className="col-lg-3 col-form-label">First Name</label>
					   <div className="col-lg-9">
						 <input type="text" className="form-control" />
					   </div>
					 </div>
					 <div className="form-group row">
					   <label className="col-lg-3 col-form-label">Last Name</label>
					   <div className="col-lg-9">
						 <input type="text" className="form-control" />
					   </div>
					 </div>
					 <div className="form-group row">
					   <label className="col-lg-3 col-form-label">Email Address</label>
					   <div className="col-lg-9">
						 <input type="email" className="form-control" />
					   </div>
					 </div>
					 <div className="form-group row">
					   <label className="col-lg-3 col-form-label">Username</label>
					   <div className="col-lg-9">
						 <input type="text" className="form-control" />
					   </div>
					 </div>
					 <div className="form-group row">
					   <label className="col-lg-3 col-form-label">Password</label>
					   <div className="col-lg-9">
						 <input type="password" className="form-control" />
					   </div>
					 </div>
					 <div className="form-group row">
					   <label className="col-lg-3 col-form-label">Repeat Password</label>
					   <div className="col-lg-9">
						 <input type="password" className="form-control" />
					   </div>
					 </div>
					 <div className="text-end">
					   <button type="submit" className="btn btn-primary">Submit</button>
					 </div>
				   </form>
				 </div>
			   </div>
			 </div>
			 <div className="col-xl-6 d-flex">
			   <div className="card flex-fill">
				 <div className="card-header">
				   <h4 className="card-title mb-0">Address Form</h4>
				 </div>
				 <div className="card-body">
				   <form action="#">
					 <div className="form-group row">
					   <label className="col-lg-3 col-form-label">Address 1</label>
					   <div className="col-lg-9">
						 <input type="text" className="form-control" />
					   </div>
					 </div>
					 <div className="form-group row">
					   <label className="col-lg-3 col-form-label">Address 2</label>
					   <div className="col-lg-9">
						 <input type="text" className="form-control" />
					   </div>
					 </div>
					 <div className="form-group row">
					   <label className="col-lg-3 col-form-label">City</label>
					   <div className="col-lg-9">
						 <input type="text" className="form-control" />
					   </div>
					 </div>
					 <div className="form-group row">
					   <label className="col-lg-3 col-form-label">State</label>
					   <div className="col-lg-9">
						 <input type="text" className="form-control" />
					   </div>
					 </div>
					 <div className="form-group row">
					   <label className="col-lg-3 col-form-label">Country</label>
					   <div className="col-lg-9">
						 <input type="text" className="form-control" />
					   </div>
					 </div>
					 <div className="form-group row">
					   <label className="col-lg-3 col-form-label">Postal Code</label>
					   <div className="col-lg-9">
						 <input type="text" className="form-control" />
					   </div>
					 </div>
					 <div className="text-end">
					   <button type="submit" className="btn btn-primary">Submit</button>
					 </div>
				   </form>
				 </div>
			   </div>
			 </div>
		   </div>
		   <div className="row">
			 <div className="col-md-12">
			   <div className="card">
				 <div className="card-header">
				   <h4 className="card-title mb-0">Two Column Horizontal Form</h4>
				 </div>
				 <div className="card-body">
				   <h4 className="card-title">Personal Information</h4>
				   <form action="#">
					 <div className="row">
					   <div className="col-xl-6">
						 <div className="form-group row">
						   <label className="col-lg-3 col-form-label">First Name</label>
						   <div className="col-lg-9">
							 <input type="text" className="form-control" />
						   </div>
						 </div>
						 <div className="form-group row">
						   <label className="col-lg-3 col-form-label">Last Name</label>
						   <div className="col-lg-9">
							 <input type="text" className="form-control" />
						   </div>
						 </div>
						 <div className="form-group row">
						   <label className="col-lg-3 col-form-label">Gender</label>
						   <div className="col-lg-9">
							 <div className="form-check form-check-inline">
							   <input className="form-check-input" type="radio" name="gender" id="gender_male" defaultValue="option1" defaultChecked />
							   <label className="form-check-label" htmlFor="gender_male">
								 Male
							   </label>
							 </div>
							 <div className="form-check form-check-inline">
							   <input className="form-check-input" type="radio" name="gender" id="gender_female" defaultValue="option2" />
							   <label className="form-check-label" htmlFor="gender_female">
								 Female
							   </label>
							 </div>
						   </div>
						 </div>
						 <div className="form-group row">
						   <label className="col-lg-3 col-form-label">Blood Group</label>
						   <div className="col-lg-9">
                               <Select
                                    placeholder = "Select"
									defaultValue={selectedOption}
                                    onChange={setSelectedOption}
                                    options={blood_group_list}
                                />
						   </div>
						 </div>
					   </div>
					   <div className="col-xl-6">
						 <div className="form-group row">
						   <label className="col-lg-3 col-form-label">Username</label>
						   <div className="col-lg-9">
							 <input type="text" className="form-control" />
						   </div>
						 </div>
						 <div className="form-group row">
						   <label className="col-lg-3 col-form-label">Email</label>
						   <div className="col-lg-9">
							 <input type="text" className="form-control" />
						   </div>
						 </div>
						 <div className="form-group row">
						   <label className="col-lg-3 col-form-label">Password</label>
						   <div className="col-lg-9">
							 <input type="password" className="form-control" />
						   </div>
						 </div>
						 <div className="form-group row">
						   <label className="col-lg-3 col-form-label">Repeat Password</label>
						   <div className="col-lg-9">
							 <input type="password" className="form-control" />
						   </div>
						 </div>
					   </div>
					 </div>
					 <h4 className="card-title">Address</h4>
					 <div className="row">
					   <div className="col-xl-6">
						 <div className="form-group row">
						   <label className="col-lg-3 col-form-label">Address Line 1</label>
						   <div className="col-lg-9">
							 <input type="text" className="form-control" />
						   </div>
						 </div>
						 <div className="form-group row">
						   <label className="col-lg-3 col-form-label">Address Line 2</label>
						   <div className="col-lg-9">
							 <input type="text" className="form-control" />
						   </div>
						 </div>
						 <div className="form-group row">
						   <label className="col-lg-3 col-form-label">State</label>
						   <div className="col-lg-9">
							 <input type="text" className="form-control" />
						   </div>
						 </div>
					   </div>
					   <div className="col-xl-6">
						 <div className="form-group row">
						   <label className="col-lg-3 col-form-label">City</label>
						   <div className="col-lg-9">
							 <input type="text" className="form-control" />
						   </div>
						 </div>
						 <div className="form-group row">
						   <label className="col-lg-3 col-form-label">Country</label>
						   <div className="col-lg-9">
							 <input type="text" className="form-control" />
						   </div>
						 </div>
						 <div className="form-group row">
						   <label className="col-lg-3 col-form-label">Postal Code</label>
						   <div className="col-lg-9">
							 <input type="text" className="form-control" />
						   </div>
						 </div>
					   </div>
					 </div>
					 <div className="text-end">
					   <button type="submit" className="btn btn-primary">Submit</button>
					 </div>
				   </form>
				 </div>
			   </div>
			 </div>
		   </div>
		   <div className="row">
			 <div className="col-md-12">
			   <div className="card mb-0">
				 <div className="card-header">
				   <h4 className="card-title mb-0">Two Column Horizontal Form</h4>
				 </div>
				 <div className="card-body">
				   <form action="#">
					 <div className="row">
					   <div className="col-xl-6">
						 <h4 className="card-title">Personal Details</h4>
						 <div className="form-group row">
						   <label className="col-lg-3 col-form-label">First Name</label>
						   <div className="col-lg-9">
							 <input type="text" className="form-control" />
						   </div>
						 </div>
						 <div className="form-group row">
						   <label className="col-lg-3 col-form-label">Last Name</label>
						   <div className="col-lg-9">
							 <input type="text" className="form-control" />
						   </div>
						 </div>
						 <div className="form-group row">
						   <label className="col-lg-3 col-form-label">Password</label>
						   <div className="col-lg-9">
							 <input type="password" className="form-control" />
						   </div>
						 </div>
						 <div className="form-group row">
						   <label className="col-lg-3 col-form-label">State</label>
						   <div className="col-lg-9">                            
                               <Select
                                    placeholder = "Select State"
                                    options={state_list}
									 defaultValue={selectedOption}
                                    onChange={setSelectedOption}
                                />
						   </div>
						 </div>
						 <div className="form-group row">
						   <label className="col-lg-3 col-form-label">About</label>
						   <div className="col-lg-9">
							 <textarea rows={4} cols={5} className="form-control" placeholder="Enter message" defaultValue={""} />
						   </div>
						 </div>
					   </div>
					   <div className="col-xl-6">
						 <h4 className="card-title">Personal details</h4>
						 <div className="row">
						   <label className="col-lg-3 col-form-label">Name</label>
						   <div className="col-lg-9">
							 <div className="row">
							   <div className="col-md-6">
								 <div className="form-group">
								   <input type="text" placeholder="First Name" className="form-control" />
								 </div>
							   </div>
							   <div className="col-md-6">
								 <div className="form-group">
								   <input type="text" placeholder="Last Name" className="form-control" />
								 </div>
							   </div>
							 </div>
						   </div>
						 </div>
						 <div className="form-group row">
						   <label className="col-lg-3 col-form-label">Email</label>
						   <div className="col-lg-9">
							 <input type="text" className="form-control" />
						   </div>
						 </div>
						 <div className="form-group row">
						   <label className="col-lg-3 col-form-label">Phone</label>
						   <div className="col-lg-9">
							 <input type="text" className="form-control" />
						   </div>
						 </div>
						 <div className="form-group row">
						   <label className="col-lg-3 col-form-label">Address</label>
						   <div className="col-lg-9">
							 <input type="text" className="form-control m-b-20" />
							 <div className="row">
							   <div className="col-md-6">
								 <div className="form-group">                            
                                    <Select
                                        placeholder = "Select Country"
                                        options={country_list}
										defaultValue={selectedOption}
										onChange={setSelectedOption}
                                    />
								 </div>
								 <div className="form-group">
								   <input type="text" placeholder="ZIP code" className="form-control" />
								 </div>
							   </div>
							   <div className="col-md-6">
								 <div className="form-group">
								   <input type="text" placeholder="State/Province" className="form-control" />
								 </div>
								 <div className="form-group">
								   <input type="text" placeholder="City" className="form-control" />
								 </div>
							   </div>
							 </div>
						   </div>
						 </div>
					   </div>
					 </div>
					 <div className="text-end">
					   <button type="submit" className="btn btn-primary">Submit</button>
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