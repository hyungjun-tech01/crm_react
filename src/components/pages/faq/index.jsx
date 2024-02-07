import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const FAQ =()=> {
    return (
      <div className="page-wrapper">
      <Helmet>
        <title>Faq - CRMS admin Template</title>
        <meta name="description" content="Reactify Blank Page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        <div className="crms-title row bg-white mb-4">
          <div className="col  p-0">
            <h3 className="page-title">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                <i className="fa fa-question-circle" aria-hidden="true" />
              </span> Faq </h3>
          </div>
          <div className="col p-0 text-end">
            <ul className="breadcrumb bg-white float-end m-0 pl-0 pr-0">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item active">Faq</li>
            </ul>
          </div>
        </div>
        <div className="faq-card">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                <a className="collapsed" data-bs-toggle="collapse" href="#collapseOne">Anim pariatur cliche reprehenderit?</a>
              </h4>
            </div>
            <div id="collapseOne" className="card-collapse collapse">
              <div className="card-body">
                <p>Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                <p>Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                <a className="collapsed" data-bs-toggle="collapse" href="#collapseTwo">Parsnip lotus root celery?</a>
              </h4>
            </div>
            <div id="collapseTwo" className="card-collapse collapse">
              <div className="card-body">
                <p>Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                <p>Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                <a className="collapsed" data-bs-toggle="collapse" href="#collapseThree">Ad vegan excepteur butcher ?</a>
              </h4>
            </div>
            <div id="collapseThree" className="card-collapse collapse">
              <div className="card-body">
                <p>Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                <p>Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                <a className="collapsed" data-bs-toggle="collapse" href="#collapseFour">Ad vegan excepteur butcher vice lomo?</a>
              </h4>
            </div>
            <div id="collapseFour" className="card-collapse collapse">
              <div className="card-body">
                <p>Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                <p>Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
              </div>
            </div>
          </div>
          <div className="card mb-0">
            <div className="card-header">
              <h4 className="card-title">
                <a className="collapsed" data-bs-toggle="collapse" href="#collapseFive">Cupidatat skateboard dolor brunch?</a>
              </h4>
            </div>
            <div id="collapseFive" className="card-collapse collapse">
              <div className="card-body">
                <p>Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                <p>Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
export default FAQ;
