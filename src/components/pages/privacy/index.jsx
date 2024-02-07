/**
 * PrivacyPolicy Page
 */
 import React from 'react';
 import { Helmet } from "react-helmet";
 import { Link } from "react-router-dom";
 
const PrivacyPolicy =()=> {
     return (
         <div className="page-wrapper">
         <Helmet>
           <title>Privacy Policy - CRMS admin Template</title>
           <meta name="description" content="Reactify Blank Page" />
         </Helmet>
         {/* Page Content */}
         <div className="content container-fluid">
           {/* Page Header */}
           <div className="crms-title row bg-white mb-4">
              <div className="col  p-0">
                <h3 className="page-title">
                  <span className="page-title-icon bg-gradient-primary text-white me-2">
                    <i className="fa fa-question-circle" aria-hidden="true" />
                  </span> Privacy Policy </h3>
              </div>
              <div className="col p-0 text-end">
                <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
                  <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                  <li className="breadcrumb-item active">Privacy Policy</li>
                </ul>
              </div>
            </div>
           {/* /Page Header */}
           <div className="card p-3 mb-0 privacy_policies">
              <div className="row">
                <div className="col-sm-12">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vel sodales mauris. Nunc accumsan mi massa, ut maximus magna ultricies et:</p>
                  <ol>
                    <li>Integer quam odio, ullamcorper id diam in, accumsan convallis libero. Duis at lacinia urna.</li>
                    <li>Mauris eget turpis sit amet purus pulvinar facilisis at sed lacus.</li>
                    <li>Quisque malesuada volutpat orci, accumsan scelerisque lorem pulvinar vitae.</li>
                    <li>Vestibulum sit amet sem aliquam, vestibulum nisi sed, sodales libero.</li>
                  </ol>
                  <h4>Aenean accumsan aliquam justo, et rhoncus est ullamcorper at</h4>
                  <p>Donec posuere dictum enim, vel sollicitudin orci tincidunt ac. Maecenas mattis ex eu elit tincidunt egestas. Vivamus posuere nunc vel metus bibendum varius. Vestibulum suscipit lacinia eros a aliquam. Sed dapibus arcu eget egestas hendrerit.</p>
                  <p>Vivamus consectetur metus at nulla efficitur mattis. Aenean egestas eu odio vestibulum vestibulum. Duis nulla lectus, lacinia vitae nibh vitae, sagittis interdum lacus. Mauris lacinia leo odio, eget finibus lectus pharetra ut. Nullam in semper enim, id gravida nulla.</p>
                  <p>Fusce gravida auctor justo, vel lobortis sem efficitur id. Cras eu eros vitae justo dictum tempor.</p>
                  <h4>Etiam sed fermentum lectus. Quisque vitae ipsum libero</h4>
                  <p>Phasellus sit amet vehicula arcu. Etiam pulvinar dui libero, vitae fringilla nulla convallis in. Fusce sagittis cursus nisl, at consectetur elit vestibulum vestibulum:</p>
                  <ul>
                    <li>Nunc pulvinar efficitur interdum.</li>
                    <li>Donec feugiat feugiat pulvinar.</li>
                    <li>Suspendisse eu risus feugiat, pellentesque arcu eu, molestie lorem. </li>
                    <li>Duis non leo commodo, euismod ipsum a, feugiat libero.</li>
                  </ul>
                  <h4>pulvinar</h4> 
                  <p>Sed sollicitudin, diam nec tristique tincidunt, nulla ligula facilisis nunc, non condimentum tortor leo id ex.</p>
                  <p>Vivamus consectetur metus at nulla efficitur mattis. Aenean egestas eu odio vestibulum vestibulum. Duis nulla lectus, lacinia vitae nibh vitae, sagittis interdum lacus. Mauris lacinia leo odio, eget finibus lectus pharetra ut. Nullam in semper enim, id gravida nulla.</p>
                  <p>Donec posuere dictum enim, vel sollicitudin orci tincidunt ac. Maecenas mattis ex eu elit tincidunt egestas. Vivamus posuere nunc vel metus bibendum varius. Vestibulum suscipit lacinia eros a aliquam. Sed dapibus arcu eget egestas hendrerit.Donec posuere dictum enim, vel sollicitudin orci tincidunt ac. Maecenas mattis ex eu elit tincidunt egestas. Vivamus posuere nunc vel metus bibendum varius. Vestibulum suscipit lacinia eros a aliquam. Sed dapibus arcu eget egestas hendrerit.</p>
                  <h4>efficitur</h4>
                  <p>Fusce gravida auctor justo, vel lobortis sem efficitur id. Cras eu eros vitae justo dictum tempor.</p>
                  <p className="mb-0"><strong>Vivamus posuere nunc vel metus bibendum varius. Vestibulum suscipit lacinia eros a aliquam. Sed dapibus arcu eget egestas hendrerit.Donec posuere dictum enim, vel sollicitudin orci tincidunt ac.</strong></p>
                </div>
              </div>
            </div>
         </div>
         {/* /Page Content */}
       </div>
     );
   }
 export default PrivacyPolicy;