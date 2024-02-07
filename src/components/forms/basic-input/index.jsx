 import React, {useState} from 'react';
 import { Helmet } from "react-helmet";
 import { Link } from "react-router-dom";
 
const FormElements =()=> {
         return (
             <div className="page-wrapper">
             <Helmet>
                   <title>Form Basic Input - CRMS Admin Template</title>
                   <meta name="description" content="Login page"/>					
             </Helmet>
         <	div className="content container-fluid">
             {/* Page Header */}
             <div className="crms-title row bg-white mb-4">
                <div className="col  p-0">
                <h3 className="page-title">
                    <span className="page-title-icon bg-gradient-primary text-white me-2">
                    <i className="fa fa-object-group" aria-hidden="true" />
                    </span> Basic Inputs </h3>
                </div>
                <div className="col p-0 text-end">
                <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
                    <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                    <li className="breadcrumb-item active">Basic Inputs</li>
                </ul>
                </div>
            </div>
           {/* /Page Header */}
           <div className="row">
             <div className="col-lg-12">
               <div className="card">
                 <div className="card-header">
                   <h4 className="card-title mb-0">Basic Inputs</h4>
                 </div>
                 <div className="card-body">
                   <form action="#">
                     <div className="form-group row">
                       <label className="col-form-label col-md-2">Text Input</label>
                       <div className="col-md-10">
                         <input type="text" className="form-control" />
                       </div>
                     </div>
                     <div className="form-group row">
                       <label className="col-form-label col-md-2">Password</label>
                       <div className="col-md-10">
                         <input type="password" className="form-control" />
                       </div>
                     </div>
                     <div className="form-group row">
                       <label className="col-form-label col-md-2">Disabled Input</label>
                       <div className="col-md-10">
                         <input type="text" className="form-control" disabled="disabled" />
                       </div>
                     </div>
                     <div className="form-group row">
                       <label className="col-form-label col-md-2">Readonly Input</label>
                       <div className="col-md-10">
                         <input type="text" className="form-control" defaultValue="readonly" readOnly="readonly" />
                       </div>
                     </div>
                     <div className="form-group row">
                       <label className="col-form-label col-md-2">Placeholder</label>
                       <div className="col-md-10">
                         <input type="text" className="form-control" placeholder="Placeholder" />
                       </div>
                     </div>
                     <div className="form-group row">
                       <label className="col-form-label col-md-2">File Input</label>
                       <div className="col-md-10">
                         <input className="form-control" type="file" />
                       </div>
                     </div>
                     <div className="form-group row">
                       <label className="col-form-label col-md-2">Default Select</label>
                       <div className="col-md-10">
                         <select className="form-control">
                           <option>-- Select --</option>
                           <option>Option 1</option>
                           <option>Option 2</option>
                           <option>Option 3</option>
                           <option>Option 4</option>
                           <option>Option 5</option>
                         </select>
                       </div>
                     </div>
                     <div className="form-group row">
                       <label className="col-form-label col-md-2">Radio</label>
                       <div className="col-md-10">
                         <div className="radio">
                           <label>
                             <input type="radio" name="radio" /> Option 1
                           </label>
                         </div>
                         <div className="radio">
                           <label>
                             <input type="radio" name="radio" /> Option 2
                           </label>
                         </div>
                         <div className="radio">
                           <label>
                             <input type="radio" name="radio" /> Option 3
                           </label>
                         </div>
                       </div>
                     </div>
                     <div className="form-group row">
                       <label className="col-form-label col-md-2">Checkbox</label>
                       <div className="col-md-10">
                         <div className="checkbox">
                           <label>
                             <input type="checkbox" name="checkbox" /> Option 1
                           </label>
                         </div>
                         <div className="checkbox">
                           <label>
                             <input type="checkbox" name="checkbox" /> Option 2
                           </label>
                         </div>
                         <div className="checkbox">
                           <label>
                             <input type="checkbox" name="checkbox" /> Option 3
                           </label>
                         </div>
                       </div>
                     </div>
                     <div className="form-group row">
                       <label className="col-form-label col-md-2">Textarea</label>
                       <div className="col-md-10">
                         <textarea rows={5} cols={5} className="form-control" placeholder="Enter text here" defaultValue={""} />
                       </div>
                     </div>
                     <div className="form-group mb-0 row">
                       <label className="col-form-label col-md-2">Input Addons</label>
                       <div className="col-md-10">
                         <div className="input-group">
                             <span className="input-group-text">$</span>
                           <input className="form-control" type="text" />
                             <button className="btn btn-primary" type="button">Button</button>
                         </div>
                       </div>
                     </div>
                   </form>
                 </div>
               </div>
               <div className="card mb-0">
                 <div className="card-header">
                   <h4 className="card-title mb-0">Input Sizes</h4>
                 </div>
                 <div className="card-body">
                   <form action="#">
                     <div className="form-group row">
                       <label className="col-form-label col-md-2">Large Input</label>
                       <div className="col-md-10">
                         <input type="text" className="form-control form-control-lg" placeholder=".form-control-lg" />
                       </div>
                     </div>
                     <div className="form-group row">
                       <label className="col-form-label col-md-2">Default Input</label>
                       <div className="col-md-10">
                         <input type="text" className="form-control" placeholder=".form-control" />
                       </div>
                     </div>
                     <div className="form-group mb-0 row">
                       <label className="col-form-label col-md-2">Small Input</label>
                       <div className="col-md-10">
                         <input type="text" className="form-control form-control-sm" placeholder=".form-control-sm" />
                       </div>
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