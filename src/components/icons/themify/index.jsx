import React from "react";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import * as MaterialIcon from "@mui/icons-material";
const ThemifyIcons = () => {
  return (
    <>
      {/* Page Wrapper */}
      <HelmetProvider>
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
                  <span>Themify Icons</span>
                </h3>
              </div>
              <div className="col text-end">
                <ul className="breadcrumb bg-white float-end m-0 ps-0 pe-0">
                  <li className="breadcrumb-item">
                    <Link to="/index">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Themify Icons</li>
                </ul>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              {/* Chart */}
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Themify Icon</div>
                  </div>
                  <div className="card-body">
                    <div className="icons-items">
                      <ul className="icons-list">
                        <li>
                          <MaterialIcon.Http />
                        </li>
                        <li>
                          <MaterialIcon.Https />
                        </li>
                        <li>
                          <MaterialIcon.Image />
                        </li>
                        <li>
                          <MaterialIcon.ImageAspectRatio />
                        </li>
                        <li>
                          <MaterialIcon.ImportContacts />
                        </li>
                        <li>
                          <MaterialIcon.ImportExport />
                        </li>
                        <li>
                          <MaterialIcon.ImportantDevices />
                        </li>
                        <li>
                          <MaterialIcon.Inbox />
                        </li>
                        <li>
                          <MaterialIcon.IndeterminateCheckBox />
                        </li>
                        <li>
                          <MaterialIcon.Info />
                        </li>
                        <li>
                          <MaterialIcon.InfoOutlined />
                        </li>
                        <li>
                          <MaterialIcon.Input />
                        </li>
                        <li>
                          <MaterialIcon.InsertChart />
                        </li>
                        <li>
                          <MaterialIcon.InsertComment />
                        </li>
                        <li>
                          <MaterialIcon.InsertDriveFile />
                        </li>
                        <li>
                          <MaterialIcon.InsertEmoticon />
                        </li>
                        <li>
                          <MaterialIcon.InsertInvitation />
                        </li>
                        <li>
                          <MaterialIcon.InsertLink />
                        </li>
                        <li>
                          <MaterialIcon.InsertPhoto />
                        </li>
                        <li>
                          <MaterialIcon.InvertColors />
                        </li>
                        <li>
                          <MaterialIcon.InvertColorsOff />
                        </li>
                        <li>
                          <MaterialIcon.Iso />
                        </li>
                        <li>
                          <MaterialIcon.Keyboard />
                        </li>
                        <li>
                          <MaterialIcon.KeyboardArrowDown />
                        </li>
                        <li>
                          <MaterialIcon.KeyboardArrowLeft />
                        </li>
                        <li>
                          <MaterialIcon.KeyboardArrowRight />
                        </li>
                        <li>
                          <MaterialIcon.KeyboardArrowUp />
                        </li>
                        <li>
                          <MaterialIcon.KeyboardBackspace />
                        </li>
                        <li>
                          <MaterialIcon.KeyboardCapslock />
                        </li>
                        <li>
                          <MaterialIcon.KeyboardHide />
                        </li>
                        <li>
                          <MaterialIcon.KeyboardReturn />
                        </li>
                        <li>
                          <MaterialIcon.KeyboardTab />
                        </li>
                        <li>
                          <MaterialIcon.KeyboardVoice />
                        </li>
                        <li>
                          <MaterialIcon.Kitchen />
                        </li>
                        <li>
                          <MaterialIcon.Label />
                        </li>
                        <li>
                          <MaterialIcon.LabelOutlined />
                        </li>
                        <li>
                          <MaterialIcon.Landscape />
                        </li>
                        <li>
                          <MaterialIcon.Language />
                        </li>
                        <li>
                          <MaterialIcon.Laptop />
                        </li>
                        <li>
                          <MaterialIcon.LaptopChromebook />
                        </li>
                        <li>
                          <MaterialIcon.LaptopMac />
                        </li>
                        <li>
                          <MaterialIcon.LaptopWindows />
                        </li>
                        <li>
                          <MaterialIcon.LastPage />
                        </li>
                        <li>
                          <MaterialIcon.Launch />
                        </li>
                        <li>
                          <MaterialIcon.Layers />
                        </li>
                        <li>
                          <MaterialIcon.LayersClear />
                        </li>
                        <li>
                          <MaterialIcon.LeakAdd />
                        </li>
                        <li>
                          <MaterialIcon.LeakRemove />
                        </li>
                        <li>
                          <MaterialIcon.Lens />
                        </li>
                        <li>
                          <MaterialIcon.LibraryAdd />
                        </li>
                        <li>
                          <MaterialIcon.LibraryBooks />
                        </li>
                        <li>
                          <MaterialIcon.LibraryMusic />
                        </li>
                        <li>
                          <MaterialIcon.LightbulbOutlined />
                        </li>
                        <li>
                          <MaterialIcon.LineStyle />
                        </li>
                        <li>
                          <MaterialIcon.LineWeight />
                        </li>
                        <li>
                          <MaterialIcon.LinearScale />
                        </li>
                        <li>
                          <MaterialIcon.Link />
                        </li>
                        <li>
                          <MaterialIcon.LinkedCamera />
                        </li>
                        <li>
                          <MaterialIcon.List />
                        </li>
                        <li>
                          <MaterialIcon.LiveHelp />
                        </li>
                        <li>
                          <MaterialIcon.LiveTv />
                        </li>
                        <li>
                          <MaterialIcon.LocalActivity />
                        </li>
                        <li>
                          <MaterialIcon.LocalAirport />
                        </li>
                        <li>
                          <MaterialIcon.LocalAtm />
                        </li>
                        <li>
                          <MaterialIcon.LocalBar />
                        </li>
                        <li>
                          <MaterialIcon.LocalCafe />
                        </li>
                        <li>
                          <MaterialIcon.LocalCarWash />
                        </li>
                        <li>
                          <MaterialIcon.LocalConvenienceStore />
                        </li>
                        <li>
                          <MaterialIcon.LocalDining />
                        </li>
                        <li>
                          <MaterialIcon.LocalDrink />
                        </li>
                        <li>
                          <MaterialIcon.LocalFlorist />
                        </li>
                        <li>
                          <MaterialIcon.LocalGasStation />
                        </li>
                        <li>
                          <MaterialIcon.LocalGroceryStore />
                        </li>
                        <li>
                          <MaterialIcon.LocalHospital />
                        </li>
                        <li>
                          <MaterialIcon.LocalHotel />
                        </li>
                        <li>
                          <MaterialIcon.LocalLaundryService />
                        </li>
                        <li>
                          <MaterialIcon.LocalLibrary />
                        </li>
                        <li>
                          <MaterialIcon.LocalMall />
                        </li>
                        <li>
                          <MaterialIcon.LocalMovies />
                        </li>
                        <li>
                          <MaterialIcon.LocalOffer />
                        </li>
                        <li>
                          <MaterialIcon.LocalParking />
                        </li>
                        <li>
                          <MaterialIcon.LocalPharmacy />
                        </li>
                        <li>
                          <MaterialIcon.LocalPhone />
                        </li>
                        <li>
                          <MaterialIcon.LocalPizza />
                        </li>
                        <li>
                          <MaterialIcon.LocalPlay />
                        </li>
                        <li>
                          <MaterialIcon.LocalPostOffice />
                        </li>
                        <li>
                          <MaterialIcon.LocalPrintshop />
                        </li>
                        <li>
                          <MaterialIcon.LocalSee />
                        </li>
                        <li>
                          <MaterialIcon.LocalShipping />
                        </li>
                        <li>
                          <MaterialIcon.LocalTaxi />
                        </li>
                        <li>
                          <MaterialIcon.LocationCity />
                        </li>
                        <li>
                          <MaterialIcon.LocationDisabled />
                        </li>
                        <li>
                          <MaterialIcon.LocationOff />
                        </li>
                        <li>
                          <MaterialIcon.LocationOn />
                        </li>
                        <li>
                          <MaterialIcon.LocationSearching />
                        </li>
                        <li>
                          <MaterialIcon.Lock />
                        </li>
                        <li>
                          <MaterialIcon.LockOpen />
                        </li>
                        <li>
                          <MaterialIcon.LockOutlined />
                        </li>
                        <li>
                          <MaterialIcon.Looks />
                        </li>
                        <li>
                          <MaterialIcon.Looks3 />
                        </li>
                        <li>
                          <MaterialIcon.Looks4 />
                        </li>
                        <li>
                          <MaterialIcon.Looks5 />
                        </li>
                        <li>
                          <MaterialIcon.Looks6 />
                        </li>
                        <li>
                          <MaterialIcon.LooksOne />
                        </li>
                        <li>
                          <MaterialIcon.LooksTwo />
                        </li>
                        <li>
                          <MaterialIcon.Loop />
                        </li>
                        <li>
                          <MaterialIcon.Loupe />
                        </li>
                        <li>
                          <MaterialIcon.LowPriority />
                        </li>
                        <li>
                          <MaterialIcon.Loyalty />
                        </li>
                        <li>
                          <MaterialIcon.Mail />
                        </li>
                        <li>
                          <MaterialIcon.MailOutline />
                        </li>
                        <li>
                          <MaterialIcon.Map />
                        </li>
                        <li>
                          <MaterialIcon.Markunread />
                        </li>
                        <li>
                          <MaterialIcon.MarkunreadMailbox />
                        </li>
                        <li>
                          <MaterialIcon.Memory />
                        </li>
                        <li>
                          <MaterialIcon.Menu />
                        </li>
                        <li>
                          <MaterialIcon.Message />
                        </li>
                        <li>
                          <MaterialIcon.Mic />
                        </li>
                        <li>
                          <MaterialIcon.MicNone />
                        </li>
                        <li>
                          <MaterialIcon.MicOff />
                        </li>
                        <li>
                          <MaterialIcon.Mms />
                        </li>
                        <li>
                          <MaterialIcon.ModeComment />
                        </li>
                        <li>
                          <MaterialIcon.ModeEdit />
                        </li>
                        <li>
                          <MaterialIcon.MonetizationOn />
                        </li>
                        <li>
                          <MaterialIcon.MoneyOff />
                        </li>
                        <li>
                          <MaterialIcon.MonochromePhotos />
                        </li>
                        <li>
                          <MaterialIcon.Mood />
                        </li>
                        <li>
                          <MaterialIcon.MoodBad />
                        </li>
                        <li>
                          <MaterialIcon.More />
                        </li>
                        <li>
                          <MaterialIcon.MoreHoriz />
                        </li>
                        <li>
                          <MaterialIcon.MoreVert />
                        </li>
                        <li>
                          <MaterialIcon.Mouse />
                        </li>
                        <li>
                          <MaterialIcon.MoveToInbox />
                        </li>
                        <li>
                          <MaterialIcon.Movie />
                        </li>
                        <li>
                          <MaterialIcon.MovieCreation />
                        </li>
                        <li>
                          <MaterialIcon.MovieFilter />
                        </li>
                        <li>
                          <MaterialIcon.MultilineChart />
                        </li>
                        <li>
                          <MaterialIcon.MusicNote />
                        </li>
                        <li>
                          <MaterialIcon.MusicVideo />
                        </li>
                        <li>
                          <MaterialIcon.MyLocation />
                        </li>
                        <li>
                          <MaterialIcon.Nature />
                        </li>
                        <li>
                          <MaterialIcon.NaturePeople />
                        </li>
                        <li>
                          <MaterialIcon.NavigateBefore />
                        </li>
                        <li>
                          <MaterialIcon.NavigateNext />
                        </li>
                        <li>
                          <MaterialIcon.Navigation />
                        </li>
                        <li>
                          <MaterialIcon.NearMe />
                        </li>
                        <li>
                          <MaterialIcon.NetworkCell />
                        </li>
                        <li>
                          <MaterialIcon.NetworkCheck />
                        </li>
                        <li>
                          <MaterialIcon.NetworkLocked />
                        </li>
                        <li>
                          <MaterialIcon.NetworkWifi />
                        </li>
                        <li>
                          <MaterialIcon.NewReleases />
                        </li>
                        <li>
                          <MaterialIcon.NextWeek />
                        </li>
                        <li>
                          <MaterialIcon.Nfc />
                        </li>
                        <li>
                          <MaterialIcon.NoEncryption />
                        </li>
                        <li>
                          <MaterialIcon.NoSim />
                        </li>
                        <li>
                          <MaterialIcon.NotInterested />
                        </li>
                        <li>
                          <MaterialIcon.Note />
                        </li>
                        <li>
                          <MaterialIcon.NoteAdd />
                        </li>
                        <li>
                          <MaterialIcon.Notifications />
                        </li>
                        <li>
                          <MaterialIcon.NotificationsActive />
                        </li>
                        <li>
                          <MaterialIcon.NotificationsNone />
                        </li>
                        <li>
                          <MaterialIcon.NotificationsOff />
                        </li>
                        <li>
                          <MaterialIcon.NotificationsPaused />
                        </li>
                        <li>
                          <MaterialIcon.OfflinePin />
                        </li>
                        <li>
                          <MaterialIcon.OndemandVideo />
                        </li>
                        <li>
                          <MaterialIcon.Opacity />
                        </li>
                        <li>
                          <MaterialIcon.OpenInBrowser />
                        </li>
                        <li>
                          <MaterialIcon.OpenInNew />
                        </li>
                        <li>
                          <MaterialIcon.OpenWith />
                        </li>
                        <li>
                          <MaterialIcon.Pages />
                        </li>
                        <li>
                          <MaterialIcon.Pageview />
                        </li>
                        <li>
                          <MaterialIcon.Palette />
                        </li>
                        <li>
                          <MaterialIcon.PanTool />
                        </li>
                        <li>
                          <MaterialIcon.Panorama />
                        </li>
                        <li>
                          <MaterialIcon.PanoramaFishEye />
                        </li>
                        <li>
                          <MaterialIcon.PanoramaHorizontal />
                        </li>
                        <li>
                          <MaterialIcon.PanoramaVertical />
                        </li>
                        <li>
                          <MaterialIcon.PanoramaWideAngle />
                        </li>
                        <li>
                          <MaterialIcon.PartyMode />
                        </li>
                        <li>
                          <MaterialIcon.Pause />
                        </li>
                        <li>
                          <MaterialIcon.PauseCircleFilled />
                        </li>
                        <li>
                          <MaterialIcon.PauseCircleOutline />
                        </li>
                        <li>
                          <MaterialIcon.Payment />
                        </li>
                        <li>
                          <MaterialIcon.People />
                        </li>
                        <li>
                          <MaterialIcon.PeopleOutline />
                        </li>
                        <li>
                          <MaterialIcon.PermCameraMic />
                        </li>
                        <li>
                          <MaterialIcon.PermContactCalendar />
                        </li>
                        <li>
                          <MaterialIcon.PermDataSetting />
                        </li>
                        <li>
                          <MaterialIcon.PermDeviceInformation />
                        </li>
                        <li>
                          <MaterialIcon.PermIdentity />
                        </li>
                        <li>
                          <MaterialIcon.PermMedia />
                        </li>
                        <li>
                          <MaterialIcon.PermPhoneMsg />
                        </li>
                        <li>
                          <MaterialIcon.PermScanWifi />
                        </li>
                        <li>
                          <MaterialIcon.Person />
                        </li>
                        <li>
                          <MaterialIcon.PersonAdd />
                        </li>
                        <li>
                          <MaterialIcon.PersonOutline />
                        </li>
                        <li>
                          <MaterialIcon.PersonPin />
                        </li>
                        <li>
                          <MaterialIcon.PersonPinCircle />
                        </li>
                        <li>
                          <MaterialIcon.PersonalVideo />
                        </li>
                        <li>
                          <MaterialIcon.Pets />
                        </li>
                        <li>
                          <MaterialIcon.Phone />
                        </li>
                        <li>
                          <MaterialIcon.PhoneAndroid />
                        </li>
                        <li>
                          <MaterialIcon.PhoneBluetoothSpeaker />
                        </li>
                        <li>
                          <MaterialIcon.TwoWheeler />
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Chart */}
            </div>
          </div>
        </div>
      </HelmetProvider>
      {/* /Page Wrapper */}
    </>
  );
};
export default ThemifyIcons;
