import React from 'react';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "../../../assets/plugins/timeline/horizontal-timeline.js"
const Horizontaltimeline =()=>{   
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
            <span>Horizontal Timeline</span>
          </h3>
        </div>
        <div className="col text-end">
          <ul className="breadcrumb bg-white float-end m-0 ps-0 pe-0">
            <li className="breadcrumb-item">
              <Link to="/index">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Horizontal Timeline</li>
          </ul>
        </div>
      </div>
      {/* /Page Header */}
      <div className="row">
        {/* Timeline */}
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <div className="cd-horizontal-timeline loaded ">
                <div className="timeline">
                  <div className="events-wrapper">
                  <div className="events" style={{ width: 1800 }}>
                      <ol>
                        <li>
                          <a
                            href="#0"
                            data-date="16/01/2014"
                            className="selected"
                            style={{left:120}}
                          >
                            16 Jan
                          </a>
                        </li>
                        <li>
                          <a href="#0" data-date="28/02/2014" style={{left:300}}>
                            28 Feb
                          </a>
                        </li>
                        <li>
                          <a href="#0" data-date="20/04/2014" style={{left:480}}>
                            20 Mar
                          </a>
                        </li>
                        <li>
                          <a href="#0" data-date="20/05/2014" style={{left:600}}>
                            20 May
                          </a>
                        </li>
                        <li>
                          <a href="#0" data-date="09/07/2014" style={{left:780}}>
                            09 Jul
                          </a>
                        </li>
                        <li>
                          <a href="#0" data-date="30/08/2014" style={{left:960}}>
                            30 Aug
                          </a>
                        </li>
                        <li>
                          <a href="#0" data-date="15/09/2014" style={{left:1020}}>
                            15 Sep
                          </a>
                        </li>
                        <li>
                          <a href="#0" data-date="01/11/2014" style={{left:1200}}>
                            01 Nov
                          </a>
                        </li>
                        <li>
                          <a href="#0" data-date="10/12/2014" style={{left:1380}}>
                            10 Dec
                          </a>
                        </li>
                        <li>
                          <a href="#0" data-date="19/01/2015" style={{left:1500}}>
                            29 Jan
                          </a>
                        </li>
                        <li>
                          <a href="#0" data-date="03/03/2015" style={{left:1680}}>
                            3 Mar
                          </a>
                        </li>
                      </ol>
                      <span className="filling-line" aria-hidden="true" />
                    </div>
                    {/* events */}
                  </div>
                  <ul className="cd-timeline-navigation">
                    <li>
                      <a href="#0" className="prev inactive">
                        Prev
                      </a>
                    </li>
                    <li>
                      <a href="#0" className="next">
                        Next
                      </a>
                    </li>
                  </ul>
                  {/* cd-timeline-navigation */}
                </div>
                {/* timeline */}
                <div className="events-content">
                  <ol>
                    <li className="selected" data-date="16/01/2014">
                      <h3>
                        <small>Title 01</small>
                      </h3>
                      <p className="m-t-40">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Illum praesentium officia, fugit recusandae ipsa,
                        quia velit nulla adipisci? Consequuntur aspernatur at,
                        eaque hic repellendus sit dicta consequatur quae, ut
                        harum ipsam molestias maxime non nisi reiciendis
                        eligendi! Doloremque quia pariatur harum ea amet
                        quibusdam quisquam, quae, temporibus dolores porro
                        doloribus.
                      </p>
                    </li>
                    <li data-date="28/02/2014">
                      <h3>
                        {" "}
                        <small>Title 02</small>
                      </h3>
                      <p className="m-t-40">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Illum praesentium officia, fugit recusandae ipsa,
                        quia velit nulla adipisci? Consequuntur aspernatur at,
                        eaque hic repellendus sit dicta consequatur quae, ut
                        harum ipsam molestias maxime non nisi reiciendis
                        eligendi! Doloremque quia pariatur harum ea amet
                        quibusdam quisquam, quae, temporibus dolores porro
                        doloribus.
                      </p>
                    </li>
                    <li data-date="20/04/2014">
                      <h3>
                        <small>Title 03</small>
                      </h3>
                      <p className="m-t-40">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Illum praesentium officia, fugit recusandae ipsa,
                        quia velit nulla adipisci? Consequuntur aspernatur at,
                        eaque hic repellendus sit dicta consequatur quae, ut
                        harum ipsam molestias maxime non nisi reiciendis
                        eligendi! Doloremque quia pariatur harum ea amet
                        quibusdam quisquam, quae, temporibus dolores porro
                        doloribus.
                      </p>
                    </li>
                    <li data-date="20/05/2014">
                      <h3>
                        <small>Title 04</small>
                      </h3>
                      <p className="m-t-40">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Illum praesentium officia, fugit recusandae ipsa,
                        quia velit nulla adipisci? Consequuntur aspernatur at,
                        eaque hic repellendus sit dicta consequatur quae, ut
                        harum ipsam molestias maxime non nisi reiciendis
                        eligendi! Doloremque quia pariatur harum ea amet
                        quibusdam quisquam, quae, temporibus dolores porro
                        doloribus.
                      </p>
                    </li>
                    <li data-date="09/07/2014">
                      <h3>
                        <small>Title 05</small>
                      </h3>
                      <p className="m-t-40">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Illum praesentium officia, fugit recusandae ipsa,
                        quia velit nulla adipisci? Consequuntur aspernatur at,
                        eaque hic repellendus sit dicta consequatur quae, ut
                        harum ipsam molestias maxime non nisi reiciendis
                        eligendi! Doloremque quia pariatur harum ea amet
                        quibusdam quisquam, quae, temporibus dolores porro
                        doloribus.
                      </p>
                    </li>
                    <li data-date="30/08/2014">
                      <h3>
                        {" "}
                        <small>Title 06</small>
                      </h3>
                      <p className="m-t-40">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Illum praesentium officia, fugit recusandae ipsa,
                        quia velit nulla adipisci? Consequuntur aspernatur at,
                        eaque hic repellendus sit dicta consequatur quae, ut
                        harum ipsam molestias maxime non nisi reiciendis
                        eligendi! Doloremque quia pariatur harum ea amet
                        quibusdam quisquam, quae, temporibus dolores porro
                        doloribus.
                      </p>
                    </li>
                    <li data-date="15/09/2014">
                      <h3>
                        <small>Title 07</small>
                      </h3>
                      <p className="m-t-40">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Illum praesentium officia, fugit recusandae ipsa,
                        quia velit nulla adipisci? Consequuntur aspernatur at,
                        eaque hic repellendus sit dicta consequatur quae, ut
                        harum ipsam molestias maxime non nisi reiciendis
                        eligendi! Doloremque quia pariatur harum ea amet
                        quibusdam quisquam, quae, temporibus dolores porro
                        doloribus.
                      </p>
                    </li>
                    <li data-date="01/11/2014">
                      <h3>
                        {" "}
                        <small>Event List</small>
                      </h3>
                      <p className="m-t-40">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Illum praesentium officia, fugit recusandae ipsa,
                        quia velit nulla adipisci? Consequuntur aspernatur at,
                        eaque hic repellendus sit dicta consequatur quae, ut
                        harum ipsam molestias maxime non nisi reiciendis
                        eligendi! Doloremque quia pariatur harum ea amet
                        quibusdam quisquam, quae, temporibus dolores porro
                        doloribus.
                      </p>
                    </li>
                    <li data-date="10/12/2014">
                      <h3>
                        <small>Event Item</small>
                      </h3>
                      <p className="m-t-40">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Illum praesentium officia, fugit recusandae ipsa,
                        quia velit nulla adipisci? Consequuntur aspernatur at,
                        eaque hic repellendus sit dicta consequatur quae, ut
                        harum ipsam molestias maxime non nisi reiciendis
                        eligendi! Doloremque quia pariatur harum ea amet
                        quibusdam quisquam, quae, temporibus dolores porro
                        doloribus.
                      </p>
                    </li>
                    <li data-date="19/01/2015">
                      <h3>
                        <small>Event title</small>
                      </h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Illum praesentium officia, fugit recusandae ipsa,
                        quia velit nulla adipisci? Consequuntur aspernatur at,
                        eaque hic repellendus sit dicta consequatur quae, ut
                        harum ipsam molestias maxime non nisi reiciendis
                        eligendi! Doloremque quia pariatur harum ea amet
                        quibusdam quisquam, quae, temporibus dolores porro
                        doloribus.
                      </p>
                    </li>
                    <li data-date="03/03/2015">
                      <h3>
                        <small>Event title</small>
                      </h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Illum praesentium officia, fugit recusandae ipsa,
                        quia velit nulla adipisci? Consequuntur aspernatur at,
                        eaque hic repellendus sit dicta consequatur quae, ut
                        harum ipsam molestias maxime non nisi reiciendis
                        eligendi! Doloremque quia pariatur harum ea amet
                        quibusdam quisquam, quae, temporibus dolores porro
                        doloribus.
                      </p>
                    </li>
                  </ol>
                </div>
                {/* .events-content */}
              </div>
            </div>
          </div>
        </div>
        {/* /Ribbon */}
      </div>
    </div>
  </div>
  {/* /Page Wrapper */}
</>

)};
export default Horizontaltimeline;        