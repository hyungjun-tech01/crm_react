import React from "react";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import * as MaterialIcon from "@mui/icons-material";
const PE7Icons = () => {
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
                  <span>Pe7 Icons</span>
                </h3>
              </div>
              <div className="col text-end">
                <ul className="breadcrumb bg-white float-end m-0 ps-0 pe-0">
                  <li className="breadcrumb-item">
                    <Link to="/index">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Pe7 Icons</li>
                </ul>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              {/* Chart */}
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Pe7 Icon</div>
                  </div>
                  <div className="card-body">
                    <div className="icons-items">
                      <ul className="icons-list">
                        <li>
                          <MaterialIcon.Dashboard />
                        </li>
                        <li>
                          <MaterialIcon.DataUsage />
                        </li>
                        <li>
                          <MaterialIcon.DateRange />
                        </li>
                        <li>
                          <MaterialIcon.Dehaze />
                        </li>
                        <li>
                          <MaterialIcon.Delete />
                        </li>
                        <li>
                          <MaterialIcon.DeleteForever />
                        </li>
                        <li>
                          <MaterialIcon.DeleteSweep />
                        </li>
                        <li>
                          <MaterialIcon.Description />
                        </li>
                        <li>
                          <MaterialIcon.DesktopMac />
                        </li>
                        <li>
                          <MaterialIcon.DesktopWindows />
                        </li>
                        <li>
                          <MaterialIcon.Details />
                        </li>
                        <li>
                          <MaterialIcon.DeveloperBoard />
                        </li>
                        <li>
                          <MaterialIcon.DeveloperMode />
                        </li>
                        <li>
                          <MaterialIcon.DeviceHub />
                        </li>
                        <li>
                          <MaterialIcon.Devices />
                        </li>
                        <li>
                          <MaterialIcon.DevicesOther />
                        </li>
                        <li>
                          <MaterialIcon.DialerSip />
                        </li>
                        <li>
                          <MaterialIcon.Dialpad />
                        </li>
                        <li>
                          <MaterialIcon.Directions />
                        </li>
                        <li>
                          <MaterialIcon.DirectionsBike />
                        </li>
                        <li>
                          <MaterialIcon.DirectionsBoat />
                        </li>
                        <li>
                          <MaterialIcon.DirectionsBus />
                        </li>
                        <li>
                          <MaterialIcon.DirectionsCar />
                        </li>
                        <li>
                          <MaterialIcon.DirectionsRailway />
                        </li>
                        <li>
                          <MaterialIcon.DirectionsRun />
                        </li>
                        <li>
                          <MaterialIcon.DirectionsSubway />
                        </li>
                        <li>
                          <MaterialIcon.DirectionsTransit />
                        </li>
                        <li>
                          <MaterialIcon.DirectionsWalk />
                        </li>
                        <li>
                          <MaterialIcon.DiscFull />
                        </li>
                        <li>
                          <MaterialIcon.Dns />
                        </li>
                        <li>
                          <MaterialIcon.DoNotDisturb />
                        </li>
                        <li>
                          <MaterialIcon.DoNotDisturbAlt />
                        </li>
                        <li>
                          <MaterialIcon.DoNotDisturbOff />
                        </li>
                        <li>
                          <MaterialIcon.DoNotDisturbOn />
                        </li>
                        <li>
                          <MaterialIcon.Dock />
                        </li>
                        <li>
                          <MaterialIcon.Domain />
                        </li>
                        <li>
                          <MaterialIcon.Done />
                        </li>
                        <li>
                          <MaterialIcon.DoneAll />
                        </li>
                        <li>
                          <MaterialIcon.DonutLarge />
                        </li>
                        <li>
                          <MaterialIcon.DonutSmall />
                        </li>
                        <li>
                          <MaterialIcon.Drafts />
                        </li>
                        <li>
                          <MaterialIcon.DragHandle />
                        </li>
                        <li>
                          <MaterialIcon.DriveEta />
                        </li>
                        <li>
                          <MaterialIcon.Dvr />
                        </li>
                        <li>
                          <MaterialIcon.Edit />
                        </li>
                        <li>
                          <MaterialIcon.EditLocation />
                        </li>
                        <li>
                          <MaterialIcon.Eject />
                        </li>
                        <li>
                          <MaterialIcon.Email />
                        </li>
                        <li>
                          <MaterialIcon.EnhancedEncryption />
                        </li>
                        <li>
                          <MaterialIcon.Equalizer />
                        </li>
                        <li>
                          <MaterialIcon.ErrorOutline />
                        </li>
                        <li>
                          <MaterialIcon.EuroSymbol />
                        </li>
                        <li>
                          <MaterialIcon.EvStation />
                        </li>
                        <li>
                          <MaterialIcon.Event />
                        </li>
                        <li>
                          <MaterialIcon.EventAvailable />
                        </li>
                        <li>
                          <MaterialIcon.EventBusy />
                        </li>
                        <li>
                          <MaterialIcon.EventNote />
                        </li>
                        <li>
                          <MaterialIcon.EventSeat />
                        </li>
                        <li>
                          <MaterialIcon.ExitToApp />
                        </li>
                        <li>
                          <MaterialIcon.ExpandLess />
                        </li>
                        <li>
                          <MaterialIcon.ExpandMore />
                        </li>
                        <li>
                          <MaterialIcon.Explicit />
                        </li>
                        <li>
                          <MaterialIcon.Explore />
                        </li>
                        <li>
                          <MaterialIcon.Exposure />
                        </li>
                        <li>
                          <MaterialIcon.Extension />
                        </li>
                        <li>
                          <MaterialIcon.Face />
                        </li>
                        <li>
                          <MaterialIcon.FastForward />
                        </li>
                        <li>
                          <MaterialIcon.FastRewind />
                        </li>
                        <li>
                          <MaterialIcon.Favorite />
                        </li>
                        <li>
                          <MaterialIcon.FavoriteBorder />
                        </li>
                        <li>
                          <MaterialIcon.FeaturedPlayList />
                        </li>
                        <li>
                          <MaterialIcon.FeaturedVideo />
                        </li>
                        <li>
                          <MaterialIcon.Feedback />
                        </li>
                        <li>
                          <MaterialIcon.FiberDvr />
                        </li>
                        <li>
                          <MaterialIcon.FiberManualRecord />
                        </li>
                        <li>
                          <MaterialIcon.FiberNew />
                        </li>
                        <li>
                          <MaterialIcon.FiberPin />
                        </li>
                        <li>
                          <MaterialIcon.FiberSmartRecord />
                        </li>
                        <li>
                          <MaterialIcon.FileDownload />
                        </li>
                        <li>
                          <MaterialIcon.FileUpload />
                        </li>
                        <li>
                          <MaterialIcon.Filter />
                        </li>
                        <li>
                          <MaterialIcon.Filter1 />
                        </li>
                        <li>
                          <MaterialIcon.Filter2 />
                        </li>
                        <li>
                          <MaterialIcon.Filter3 />
                        </li>
                        <li>
                          <MaterialIcon.Filter4 />
                        </li>
                        <li>
                          <MaterialIcon.Filter5 />
                        </li>
                        <li>
                          <MaterialIcon.Filter6 />
                        </li>
                        <li>
                          <MaterialIcon.Filter7 />
                        </li>
                        <li>
                          <MaterialIcon.Filter8 />
                        </li>
                        <li>
                          <MaterialIcon.Filter9 />
                        </li>
                        <li>
                          <MaterialIcon.Filter9Plus />
                        </li>
                        <li>
                          <MaterialIcon.FilterBAndW />
                        </li>
                        <li>
                          <MaterialIcon.FilterCenterFocus />
                        </li>
                        <li>
                          <MaterialIcon.FilterDrama />
                        </li>
                        <li>
                          <MaterialIcon.FilterFrames />
                        </li>
                        <li>
                          <MaterialIcon.FilterHdr />
                        </li>
                        <li>
                          <MaterialIcon.FilterList />
                        </li>
                        <li>
                          <MaterialIcon.FilterNone />
                        </li>
                        <li>
                          <MaterialIcon.FilterTiltShift />
                        </li>
                        <li>
                          <MaterialIcon.FilterVintage />
                        </li>
                        <li>
                          <MaterialIcon.FindInPage />
                        </li>
                        <li>
                          <MaterialIcon.FindReplace />
                        </li>
                        <li>
                          <MaterialIcon.Fingerprint />
                        </li>
                        <li>
                          <MaterialIcon.FirstPage />
                        </li>
                        <li>
                          <MaterialIcon.FitnessCenter />
                        </li>
                        <li>
                          <MaterialIcon.Flag />
                        </li>
                        <li>
                          <MaterialIcon.Flare />
                        </li>
                        <li>
                          <MaterialIcon.FlashAuto />
                        </li>
                        <li>
                          <MaterialIcon.FlashOff />
                        </li>
                        <li>
                          <MaterialIcon.FlashOn />
                        </li>
                        <li>
                          <MaterialIcon.Flight />
                        </li>
                        <li>
                          <MaterialIcon.FlightLand />
                        </li>
                        <li>
                          <MaterialIcon.FlightTakeoff />
                        </li>
                        <li>
                          <MaterialIcon.Flip />
                        </li>
                        <li>
                          <MaterialIcon.FlipToBack />
                        </li>
                        <li>
                          <MaterialIcon.FlipToFront />
                        </li>
                        <li>
                          <MaterialIcon.Folder />
                        </li>
                        <li>
                          <MaterialIcon.FolderOpen />
                        </li>
                        <li>
                          <MaterialIcon.FolderShared />
                        </li>
                        <li>
                          <MaterialIcon.FontDownload />
                        </li>
                        <li>
                          <MaterialIcon.FormatAlignCenter />
                        </li>
                        <li>
                          <MaterialIcon.FormatAlignJustify />
                        </li>
                        <li>
                          <MaterialIcon.FormatAlignLeft />
                        </li>
                        <li>
                          <MaterialIcon.FormatAlignRight />
                        </li>
                        <li>
                          <MaterialIcon.FormatBold />
                        </li>
                        <li>
                          <MaterialIcon.FormatClear />
                        </li>
                        <li>
                          <MaterialIcon.FormatColorFill />
                        </li>
                        <li>
                          <MaterialIcon.FormatColorReset />
                        </li>
                        <li>
                          <MaterialIcon.FormatColorText />
                        </li>
                        <li>
                          <MaterialIcon.FormatIndentDecrease />
                        </li>
                        <li>
                          <MaterialIcon.FormatIndentIncrease />
                        </li>
                        <li>
                          <MaterialIcon.FormatItalic />
                        </li>
                        <li>
                          <MaterialIcon.FormatLineSpacing />
                        </li>
                        <li>
                          <MaterialIcon.FormatListBulleted />
                        </li>
                        <li>
                          <MaterialIcon.FormatListNumbered />
                        </li>
                        <li>
                          <MaterialIcon.FormatPaint />
                        </li>
                        <li>
                          <MaterialIcon.FormatQuote />
                        </li>
                        <li>
                          <MaterialIcon.FormatShapes />
                        </li>
                        <li>
                          <MaterialIcon.FormatSize />
                        </li>
                        <li>
                          <MaterialIcon.FormatStrikethrough />
                        </li>
                        <li>
                          <MaterialIcon.FormatTextdirectionLToR />
                        </li>
                        <li>
                          <MaterialIcon.FormatTextdirectionRToL />
                        </li>
                        <li>
                          <MaterialIcon.FormatUnderlined />
                        </li>
                        <li>
                          <MaterialIcon.Forum />
                        </li>
                        <li>
                          <MaterialIcon.Forward />
                        </li>
                        <li>
                          <MaterialIcon.Forward10 />
                        </li>
                        <li>
                          <MaterialIcon.Forward30 />
                        </li>
                        <li>
                          <MaterialIcon.Forward5 />
                        </li>
                        <li>
                          <MaterialIcon.FreeBreakfast />
                        </li>
                        <li>
                          <MaterialIcon.Fullscreen />
                        </li>
                        <li>
                          <MaterialIcon.FullscreenExit />
                        </li>
                        <li>
                          <MaterialIcon.Functions />
                        </li>
                        <li>
                          <MaterialIcon.GTranslate />
                        </li>
                        <li>
                          <MaterialIcon.Gamepad />
                        </li>
                        <li>
                          <MaterialIcon.Games />
                        </li>
                        <li>
                          <MaterialIcon.Gavel />
                        </li>
                        <li>
                          <MaterialIcon.Gesture />
                        </li>
                        <li>
                          <MaterialIcon.GetApp />
                        </li>
                        <li>
                          <MaterialIcon.Gif />
                        </li>
                        <li>
                          <MaterialIcon.GolfCourse />
                        </li>
                        <li>
                          <MaterialIcon.GpsFixed />
                        </li>
                        <li>
                          <MaterialIcon.GpsNotFixed />
                        </li>
                        <li>
                          <MaterialIcon.GpsOff />
                        </li>
                        <li>
                          <MaterialIcon.Grade />
                        </li>
                        <li>
                          <MaterialIcon.Gradient />
                        </li>
                        <li>
                          <MaterialIcon.Grain />
                        </li>
                        <li>
                          <MaterialIcon.GraphicEq />
                        </li>
                        <li>
                          <MaterialIcon.GridOff />
                        </li>
                        <li>
                          <MaterialIcon.GridOn />
                        </li>
                        <li>
                          <MaterialIcon.Group />
                        </li>
                        <li>
                          <MaterialIcon.GroupAdd />
                        </li>
                        <li>
                          <MaterialIcon.GroupWork />
                        </li>
                        <li>
                          <MaterialIcon.Hd />
                        </li>
                        <li>
                          <MaterialIcon.HdrOff />
                        </li>
                        <li>
                          <MaterialIcon.HdrOn />
                        </li>
                        <li>
                          <MaterialIcon.HdrStrong />
                        </li>
                        <li>
                          <MaterialIcon.HdrWeak />
                        </li>
                        <li>
                          <MaterialIcon.Headset />
                        </li>
                        <li>
                          <MaterialIcon.HeadsetMic />
                        </li>
                        <li>
                          <MaterialIcon.Healing />
                        </li>
                        <li>
                          <MaterialIcon.Hearing />
                        </li>
                        <li>
                          <MaterialIcon.Help />
                        </li>
                        <li>
                          <MaterialIcon.HelpOutline />
                        </li>
                        <li>
                          <MaterialIcon.HighQuality />
                        </li>
                        <li>
                          <MaterialIcon.Highlight />
                        </li>
                        <li>
                          <MaterialIcon.HighlightOff />
                        </li>
                        <li>
                          <MaterialIcon.History />
                        </li>
                        <li>
                          <MaterialIcon.Home />
                        </li>
                        <li>
                          <MaterialIcon.HotTub />
                        </li>
                        <li>
                          <MaterialIcon.Hotel />
                        </li>
                        <li>
                          <MaterialIcon.HourglassEmpty />
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
export default PE7Icons;
