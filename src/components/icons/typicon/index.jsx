import React from "react";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import * as MaterialIcon from "@mui/icons-material";
const TypiconIcons = () => {
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
                  <span>Typicon Icons</span>
                </h3>
              </div>
              <div className="col text-end">
                <ul className="breadcrumb bg-white float-end m-0 ps-0 pe-0">
                  <li className="breadcrumb-item">
                    <Link to="/index">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Typicon Icons</li>
                </ul>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              {/* Chart */}
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Typicon Icon</div>
                  </div>
                  <div className="card-body">
                    <div className="icons-items">
                      <ul className="icons-list">
                        <li>
                          <MaterialIcon.AssignmentLate />
                        </li>
                        <li>
                          <MaterialIcon.AssignmentReturn />
                        </li>
                        <li>
                          <MaterialIcon.AssignmentReturned />
                        </li>
                        <li>
                          <MaterialIcon.AssignmentTurnedIn />
                        </li>
                        <li>
                          <MaterialIcon.Assistant />
                        </li>
                        <li>
                          <MaterialIcon.AssistantPhoto />
                        </li>
                        <li>
                          <MaterialIcon.AttachFile />
                        </li>
                        <li>
                          <MaterialIcon.AttachMoney />
                        </li>
                        <li>
                          <MaterialIcon.Attachment />
                        </li>
                        <li>
                          <MaterialIcon.Audiotrack />
                        </li>
                        <li>
                          <MaterialIcon.Autorenew />
                        </li>
                        <li>
                          <MaterialIcon.AvTimer />
                        </li>
                        <li>
                          <MaterialIcon.Backspace />
                        </li>
                        <li>
                          <MaterialIcon.Backup />
                        </li>
                        <li>
                          <MaterialIcon.BatteryAlert />
                        </li>
                        <li>
                          <MaterialIcon.BatteryChargingFull />
                        </li>
                        <li>
                          <MaterialIcon.BatteryFull />
                        </li>
                        <li>
                          <MaterialIcon.BatteryStd />
                        </li>
                        <li>
                          <MaterialIcon.BatteryUnknown />
                        </li>
                        <li>
                          <MaterialIcon.BeachAccess />
                        </li>
                        <li>
                          <MaterialIcon.Beenhere />
                        </li>
                        <li>
                          <MaterialIcon.Block />
                        </li>
                        <li>
                          <MaterialIcon.Bluetooth />
                        </li>
                        <li>
                          <MaterialIcon.BluetoothAudio />
                        </li>
                        <li>
                          <MaterialIcon.BluetoothConnected />
                        </li>
                        <li>
                          <MaterialIcon.BluetoothDisabled />
                        </li>
                        <li>
                          <MaterialIcon.BluetoothSearching />
                        </li>
                        <li>
                          <MaterialIcon.BlurCircular />
                        </li>
                        <li>
                          <MaterialIcon.BlurLinear />
                        </li>
                        <li>
                          <MaterialIcon.BlurOff />
                        </li>
                        <li>
                          <MaterialIcon.BlurOn />
                        </li>
                        <li>
                          <MaterialIcon.Book />
                        </li>
                        <li>
                          <MaterialIcon.Bookmark />
                        </li>
                        <li>
                          <MaterialIcon.BookmarkBorder />
                        </li>
                        <li>
                          <MaterialIcon.BorderAll />
                        </li>
                        <li>
                          <MaterialIcon.BorderBottom />
                        </li>
                        <li>
                          <MaterialIcon.BorderClear />
                        </li>
                        <li>
                          <MaterialIcon.BorderColor />
                        </li>
                        <li>
                          <MaterialIcon.BorderHorizontal />
                        </li>
                        <li>
                          <MaterialIcon.BorderInner />
                        </li>
                        <li>
                          <MaterialIcon.BorderLeft />
                        </li>
                        <li>
                          <MaterialIcon.BorderOuter />
                        </li>
                        <li>
                          <MaterialIcon.BorderRight />
                        </li>
                        <li>
                          <MaterialIcon.BorderStyle />
                        </li>
                        <li>
                          <MaterialIcon.BorderTop />
                        </li>
                        <li>
                          <MaterialIcon.BorderVertical />
                        </li>
                        <li>
                          <MaterialIcon.BrandingWatermark />
                        </li>
                        <li>
                          <MaterialIcon.Brightness1 />
                        </li>
                        <li>
                          <MaterialIcon.Brightness3 />
                        </li>
                        <li>
                          <MaterialIcon.Brightness4 />
                        </li>
                        <li>
                          <MaterialIcon.Brightness5 />
                        </li>
                        <li>
                          <MaterialIcon.Brightness6 />
                        </li>
                        <li>
                          <MaterialIcon.Brightness7 />
                        </li>
                        <li>
                          <MaterialIcon.BrightnessAuto />
                        </li>
                        <li>
                          <MaterialIcon.BrightnessHigh />
                        </li>
                        <li>
                          <MaterialIcon.BrightnessLow />
                        </li>
                        <li>
                          <MaterialIcon.BrightnessMedium />
                        </li>
                        <li>
                          <MaterialIcon.BrokenImage />
                        </li>
                        <li>
                          <MaterialIcon.Brush />
                        </li>
                        <li>
                          <MaterialIcon.BubbleChart />
                        </li>
                        <li>
                          <MaterialIcon.BugReport />
                        </li>
                        <li>
                          <MaterialIcon.Build />
                        </li>
                        <li>
                          <MaterialIcon.BurstMode />
                        </li>
                        <li>
                          <MaterialIcon.Business />
                        </li>
                        <li>
                          <MaterialIcon.BusinessCenter />
                        </li>
                        <li>
                          <MaterialIcon.Cached />
                        </li>
                        <li>
                          <MaterialIcon.Cake />
                        </li>
                        <li>
                          <MaterialIcon.Call />
                        </li>
                        <li>
                          <MaterialIcon.CallEnd />
                        </li>
                        <li>
                          <MaterialIcon.CallMade />
                        </li>
                        <li>
                          <MaterialIcon.CallMerge />
                        </li>
                        <li>
                          <MaterialIcon.CallMissed />
                        </li>
                        <li>
                          <MaterialIcon.CallMissedOutgoing />
                        </li>
                        <li>
                          <MaterialIcon.CallReceived />
                        </li>
                        <li>
                          <MaterialIcon.CallSplit />
                        </li>
                        <li>
                          <MaterialIcon.CallToAction />
                        </li>
                        <li>
                          <MaterialIcon.Camera />
                        </li>
                        <li>
                          <MaterialIcon.CameraAlt />
                        </li>
                        <li>
                          <MaterialIcon.CameraEnhance />
                        </li>
                        <li>
                          <MaterialIcon.CameraFront />
                        </li>
                        <li>
                          <MaterialIcon.CameraRear />
                        </li>
                        <li>
                          <MaterialIcon.CameraRoll />
                        </li>
                        <li>
                          <MaterialIcon.Cancel />
                        </li>
                        <li>
                          <MaterialIcon.CardGiftcard />
                        </li>
                        <li>
                          <MaterialIcon.CardMembership />
                        </li>
                        <li>
                          <MaterialIcon.CardTravel />
                        </li>
                        <li>
                          <MaterialIcon.Casino />
                        </li>
                        <li>
                          <MaterialIcon.Cast />
                        </li>
                        <li>
                          <MaterialIcon.CastConnected />
                        </li>
                        <li>
                          <MaterialIcon.CenterFocusStrong />
                        </li>
                        <li>
                          <MaterialIcon.CenterFocusWeak />
                        </li>
                        <li>
                          <MaterialIcon.ChangeHistory />
                        </li>
                        <li>
                          <MaterialIcon.Chat />
                        </li>
                        <li>
                          <MaterialIcon.ChatBubble />
                        </li>
                        <li>
                          <MaterialIcon.ChatBubbleOutline />
                        </li>
                        <li>
                          <MaterialIcon.Check />
                        </li>
                        <li>
                          <MaterialIcon.CheckBox />
                        </li>
                        <li>
                          <MaterialIcon.CheckBoxOutlineBlank />
                        </li>
                        <li>
                          <MaterialIcon.CheckCircle />
                        </li>
                        <li>
                          <MaterialIcon.ChevronLeft />
                        </li>
                        <li>
                          <MaterialIcon.ChevronRight />
                        </li>
                        <li>
                          <MaterialIcon.ChildCare />
                        </li>
                        <li>
                          <MaterialIcon.ChildFriendly />
                        </li>
                        <li>
                          <MaterialIcon.ChromeReaderMode />
                        </li>
                        <li>
                          <MaterialIcon.Class />
                        </li>
                        <li>
                          <MaterialIcon.Clear />
                        </li>
                        <li>
                          <MaterialIcon.ClearAll />
                        </li>
                        <li>
                          <MaterialIcon.Close />
                        </li>
                        <li>
                          <MaterialIcon.ClosedCaption />
                        </li>
                        <li>
                          <MaterialIcon.Cloud />
                        </li>
                        <li>
                          <MaterialIcon.CloudCircle />
                        </li>
                        <li>
                          <MaterialIcon.CloudDone />
                        </li>
                        <li>
                          <MaterialIcon.CloudDownload />
                        </li>
                        <li>
                          <MaterialIcon.CloudOff />
                        </li>
                        <li>
                          <MaterialIcon.CloudQueue />
                        </li>
                        <li>
                          <MaterialIcon.CloudUpload />
                        </li>
                        <li>
                          <MaterialIcon.Code />
                        </li>
                        <li>
                          <MaterialIcon.Collections />
                        </li>
                        <li>
                          <MaterialIcon.CollectionsBookmark />
                        </li>
                        <li>
                          <MaterialIcon.ColorLens />
                        </li>
                        <li>
                          <MaterialIcon.Colorize />
                        </li>
                        <li>
                          <MaterialIcon.Comment />
                        </li>
                        <li>
                          <MaterialIcon.Compare />
                        </li>
                        <li>
                          <MaterialIcon.CompareArrows />
                        </li>
                        <li>
                          <MaterialIcon.ConfirmationNumber />
                        </li>
                        <li>
                          <MaterialIcon.ContactMail />
                        </li>
                        <li>
                          <MaterialIcon.ContactPhone />
                        </li>
                        <li>
                          <MaterialIcon.Contacts />
                        </li>
                        <li>
                          <MaterialIcon.ContentCopy />
                        </li>
                        <li>
                          <MaterialIcon.ContentCut />
                        </li>
                        <li>
                          <MaterialIcon.ContentPaste />
                        </li>
                        <li>
                          <MaterialIcon.ControlPoint />
                        </li>
                        <li>
                          <MaterialIcon.ControlPointDuplicate />
                        </li>
                        <li>
                          <MaterialIcon.Copyright />
                        </li>
                        <li>
                          <MaterialIcon.Create />
                        </li>
                        <li>
                          <MaterialIcon.CreateNewFolder />
                        </li>
                        <li>
                          <MaterialIcon.CreditCard />
                        </li>
                        <li>
                          <MaterialIcon.Crop />
                        </li>
                        <li>
                          <MaterialIcon.Crop169 />
                        </li>
                        <li>
                          <MaterialIcon.Crop32 />
                        </li>
                        <li>
                          <MaterialIcon.Crop54 />
                        </li>
                        <li>
                          <MaterialIcon.Crop75 />
                        </li>
                        <li>
                          <MaterialIcon.CropDin />
                        </li>
                        <li>
                          <MaterialIcon.CropFree />
                        </li>
                        <li>
                          <MaterialIcon.CropLandscape />
                        </li>
                        <li>
                          <MaterialIcon.CropOriginal />
                        </li>
                        <li>
                          <MaterialIcon.CropPortrait />
                        </li>
                        <li>
                          <MaterialIcon.CropRotate />
                        </li>
                        <li>
                          <MaterialIcon.CropSquare />
                        </li>
                        <li>
                          <MaterialIcon.ConfirmationNumber />
                        </li>
                        <li>
                          <MaterialIcon.ContactMail />
                        </li>
                        <li>
                          <MaterialIcon.ContactPhone />
                        </li>
                        <li>
                          <MaterialIcon.Contacts />
                        </li>
                        <li>
                          <MaterialIcon.ContentCopy />
                        </li>
                        <li>
                          <MaterialIcon.ContentCut />
                        </li>
                        <li>
                          <MaterialIcon.ContentPaste />
                        </li>
                        <li>
                          <MaterialIcon.ControlPoint />
                        </li>
                        <li>
                          <MaterialIcon.ControlPointDuplicate />
                        </li>
                        <li>
                          <MaterialIcon.Copyright />
                        </li>
                        <li>
                          <MaterialIcon.Create />
                        </li>
                        <li>
                          <MaterialIcon.CreateNewFolder />
                        </li>
                        <li>
                          <MaterialIcon.CreditCard />
                        </li>
                        <li>
                          <MaterialIcon.Crop />
                        </li>
                        <li>
                          <MaterialIcon.Crop169 />
                        </li>
                        <li>
                          <MaterialIcon.Crop32 />
                        </li>
                        <li>
                          <MaterialIcon.Crop54 />
                        </li>
                        <li>
                          <MaterialIcon.Crop75 />
                        </li>
                        <li>
                          <MaterialIcon.CropDin />
                        </li>
                        <li>
                          <MaterialIcon.CropFree />
                        </li>
                        <li>
                          <MaterialIcon.CropLandscape />
                        </li>
                        <li>
                          <MaterialIcon.CropOriginal />
                        </li>
                        <li>
                          <MaterialIcon.CropPortrait />
                        </li>
                        <li>
                          <MaterialIcon.CropRotate />
                        </li>
                        <li>
                          <MaterialIcon.CropSquare />
                        </li>
                        <li>
                          <MaterialIcon.Brightness3 />
                        </li>
                        <li>
                          <MaterialIcon.Brightness4 />
                        </li>
                        <li>
                          <MaterialIcon.Brightness5 />
                        </li>
                        <li>
                          <MaterialIcon.Brightness6 />
                        </li>
                        <li>
                          <MaterialIcon.Brightness7 />
                        </li>
                        <li>
                          <MaterialIcon.BrightnessAuto />
                        </li>
                        <li>
                          <MaterialIcon.BrightnessHigh />
                        </li>
                        <li>
                          <MaterialIcon.BrightnessLow />
                        </li>
                        <li>
                          <MaterialIcon.BrightnessMedium />
                        </li>
                        <li>
                          <MaterialIcon.BrokenImage />
                        </li>
                        <li>
                          <MaterialIcon.Brush />
                        </li>
                        <li>
                          <MaterialIcon.BubbleChart />
                        </li>
                        <li>
                          <MaterialIcon.BugReport />
                        </li>
                        <li>
                          <MaterialIcon.Build />
                        </li>
                        <li>
                          <MaterialIcon.BurstMode />
                        </li>
                        <li>
                          <MaterialIcon.Business />
                        </li>
                        <li>
                          <MaterialIcon.BusinessCenter />
                        </li>
                        <li>
                          <MaterialIcon.Cached />
                        </li>
                        <li>
                          <MaterialIcon.Cake />
                        </li>
                        <li>
                          <MaterialIcon.Call />
                        </li>
                        <li>
                          <MaterialIcon.CallEnd />
                        </li>
                        <li>
                          <MaterialIcon.CallMade />
                        </li>
                        <li>
                          <MaterialIcon.CallMerge />
                        </li>
                        <li>
                          <MaterialIcon.CallMissed />
                        </li>
                        <li>
                          <MaterialIcon.CallMissedOutgoing />
                        </li>
                        <li>
                          <MaterialIcon.CallReceived />
                        </li>
                        <li>
                          <MaterialIcon.CallSplit />
                        </li>
                        <li>
                          <MaterialIcon.CallToAction />
                        </li>
                        <li>
                          <MaterialIcon.Camera />
                        </li>
                        <li>
                          <MaterialIcon.CameraAlt />
                        </li>
                        <li>
                          <MaterialIcon.CameraEnhance />
                        </li>
                        <li>
                          <MaterialIcon.CameraFront />
                        </li>
                        <li>
                          <MaterialIcon.CameraRear />
                        </li>
                        <li>
                          <MaterialIcon.CameraRoll />
                        </li>
                        <li>
                          <MaterialIcon.Cancel />
                        </li>
                        <li>
                          <MaterialIcon.CardGiftcard />
                        </li>
                        <li>
                          <MaterialIcon.CardMembership />
                        </li>
                        <li>
                          <MaterialIcon.CardTravel />
                        </li>
                        <li>
                          <MaterialIcon.Casino />
                        </li>
                        <li>
                          <MaterialIcon.Cast />
                        </li>
                        <li>
                          <MaterialIcon.CastConnected />
                        </li>
                        <li>
                          <MaterialIcon.CenterFocusStrong />
                        </li>
                        <li>
                          <MaterialIcon.CenterFocusWeak />
                        </li>
                        <li>
                          <MaterialIcon.ChangeHistory />
                        </li>
                        <li>
                          <MaterialIcon.Chat />
                        </li>
                        <li>
                          <MaterialIcon.ChatBubble />
                        </li>
                        <li>
                          <MaterialIcon.ChatBubbleOutline />
                        </li>
                        <li>
                          <MaterialIcon.Check />
                        </li>
                        <li>
                          <MaterialIcon.CheckBox />
                        </li>
                        <li>
                          <MaterialIcon.CheckBoxOutlineBlank />
                        </li>
                        <li>
                          <MaterialIcon.CheckCircle />
                        </li>
                        <li>
                          <MaterialIcon.ChevronLeft />
                        </li>
                        <li>
                          <MaterialIcon.ChevronRight />
                        </li>
                        <li>
                          <MaterialIcon.ChildCare />
                        </li>
                        <li>
                          <MaterialIcon.ChildFriendly />
                        </li>
                        <li>
                          <MaterialIcon.ChromeReaderMode />
                        </li>
                        <li>
                          <MaterialIcon.Class />
                        </li>
                        <li>
                          <MaterialIcon.Clear />
                        </li>
                        <li>
                          <MaterialIcon.ClearAll />
                        </li>
                        <li>
                          <MaterialIcon.Close />
                        </li>
                        <li>
                          <MaterialIcon.ClosedCaption />
                        </li>
                        <li>
                          <MaterialIcon.Cloud />
                        </li>
                        <li>
                          <MaterialIcon.CloudCircle />
                        </li>
                        <li>
                          <MaterialIcon.CloudDone />
                        </li>
                        <li>
                          <MaterialIcon.CloudDownload />
                        </li>
                        <li>
                          <MaterialIcon.CloudOff />
                        </li>
                        <li>
                          <MaterialIcon.CloudQueue />
                        </li>
                        <li>
                          <MaterialIcon.CloudUpload />
                        </li>
                        <li>
                          <MaterialIcon.Code />
                        </li>
                        <li>
                          <MaterialIcon.Collections />
                        </li>
                        <li>
                          <MaterialIcon.CollectionsBookmark />
                        </li>
                        <li>
                          <MaterialIcon.ColorLens />
                        </li>
                        <li>
                          <MaterialIcon.Colorize />
                        </li>
                        <li>
                          <MaterialIcon.Comment />
                        </li>
                        <li>
                          <MaterialIcon.Compare />
                        </li>
                        <li>
                          <MaterialIcon.CompareArrows />
                        </li>
                        <li>
                          <MaterialIcon.AssignmentLate />
                        </li>
                        <li>
                          <MaterialIcon.AssignmentReturn />
                        </li>
                        <li>
                          <MaterialIcon.AssignmentReturned />
                        </li>
                        <li>
                          <MaterialIcon.AssignmentTurnedIn />
                        </li>
                        <li>
                          <MaterialIcon.Assistant />
                        </li>
                        <li>
                          <MaterialIcon.AssistantPhoto />
                        </li>
                        <li>
                          <MaterialIcon.AttachFile />
                        </li>
                        <li>
                          <MaterialIcon.AttachMoney />
                        </li>
                        <li>
                          <MaterialIcon.Attachment />
                        </li>
                        <li>
                          <MaterialIcon.Audiotrack />
                        </li>
                        <li>
                          <MaterialIcon.Autorenew />
                        </li>
                        <li>
                          <MaterialIcon.AvTimer />
                        </li>
                        <li>
                          <MaterialIcon.Backspace />
                        </li>
                        <li>
                          <MaterialIcon.Backup />
                        </li>
                        <li>
                          <MaterialIcon.BatteryAlert />
                        </li>
                        <li>
                          <MaterialIcon.BatteryChargingFull />
                        </li>
                        <li>
                          <MaterialIcon.BatteryFull />
                        </li>
                        <li>
                          <MaterialIcon.BatteryStd />
                        </li>
                        <li>
                          <MaterialIcon.BatteryUnknown />
                        </li>
                        <li>
                          <MaterialIcon.BeachAccess />
                        </li>
                        <li>
                          <MaterialIcon.Beenhere />
                        </li>
                        <li>
                          <MaterialIcon.Block />
                        </li>
                        <li>
                          <MaterialIcon.Bluetooth />
                        </li>
                        <li>
                          <MaterialIcon.BluetoothAudio />
                        </li>
                        <li>
                          <MaterialIcon.BluetoothConnected />
                        </li>
                        <li>
                          <MaterialIcon.BluetoothDisabled />
                        </li>
                        <li>
                          <MaterialIcon.BluetoothSearching />
                        </li>
                        <li>
                          <MaterialIcon.BlurCircular />
                        </li>
                        <li>
                          <MaterialIcon.BlurLinear />
                        </li>
                        <li>
                          <MaterialIcon.BlurOff />
                        </li>
                        <li>
                          <MaterialIcon.BlurOn />
                        </li>
                        <li>
                          <MaterialIcon.Book />
                        </li>
                        <li>
                          <MaterialIcon.Bookmark />
                        </li>
                        <li>
                          <MaterialIcon.BookmarkBorder />
                        </li>
                        <li>
                          <MaterialIcon.BorderAll />
                        </li>
                        <li>
                          <MaterialIcon.BorderBottom />
                        </li>
                        <li>
                          <MaterialIcon.BorderClear />
                        </li>
                        <li>
                          <MaterialIcon.BorderColor />
                        </li>
                        <li>
                          <MaterialIcon.BorderHorizontal />
                        </li>
                        <li>
                          <MaterialIcon.BorderInner />
                        </li>
                        <li>
                          <MaterialIcon.BorderLeft />
                        </li>
                        <li>
                          <MaterialIcon.BorderOuter />
                        </li>
                        <li>
                          <MaterialIcon.BorderRight />
                        </li>
                        <li>
                          <MaterialIcon.BorderStyle />
                        </li>
                        <li>
                          <MaterialIcon.BorderTop />
                        </li>
                        <li>
                          <MaterialIcon.BorderVertical />
                        </li>
                        <li>
                          <MaterialIcon.BrandingWatermark />
                        </li>
                        <li>
                          <MaterialIcon.Brightness1 />
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
export default TypiconIcons;
