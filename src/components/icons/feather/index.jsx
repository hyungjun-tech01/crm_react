import React from 'react';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FiActivity, FiAirplay, FiAlertCircle, FiAlertOctagon, FiAlertTriangle, FiAlignCenter, FiAlignJustify, FiAlignLeft, FiAlignRight, FiAnchor, FiAperture, FiArchive, FiArrowDown, FiArrowDownCircle, FiArrowDownLeft, FiArrowDownRight, FiArrowLeft, FiArrowLeftCircle, FiArrowRight, FiArrowRightCircle, FiArrowUp, FiArrowUpCircle, FiArrowUpLeft, FiArrowUpRight, FiAtSign, FiAward, FiBarChart, FiBarChart2, FiBattery, FiBatteryCharging, FiBell, FiBellOff, FiBluetooth, FiBold, FiBook, FiBookOpen, FiBookmark, FiBox, FiBriefcase, FiCalendar, FiCamera, FiCameraOff, FiCast, FiCheck, FiCheckCircle, FiCheckSquare, FiChevronDown, FiChevronLeft, FiChevronRight, FiChevronUp, FiChevronsDown, FiChevronsLeft, FiChevronsRight, FiChevronsUp, FiChrome, FiCircle, FiClipboard, FiClock, FiCloud, FiCloudDrizzle, FiCloudLightning, FiCloudOff, FiCloudRain, FiCloudSnow, FiCode, FiCodepen, FiCodesandbox, FiCoffee, FiColumns, FiCommand, FiCompass, FiCopy, FiCornerDownLeft, FiCornerDownRight, FiCornerLeftDown, FiCornerLeftUp, FiCornerRightDown, FiCornerRightUp, FiCornerUpLeft, FiCornerUpRight, FiCpu, FiCreditCard, FiCrop, FiCrosshair, FiDatabase, FiDelete, FiDisc, FiDivide, FiDivideCircle, FiDivideSquare, FiDollarSign, FiDownload, FiDownloadCloud, FiDribbble, FiDroplet, FiEdit, FiEdit2, FiEdit3, FiExternalLink, FiEye, FiEyeOff, FiFacebook, FiFastForward, FiFeather, FiFlag, FiFolder, FiFolderMinus, FiFolderPlus, FiFramer, FiFrown, FiGift, FiGitBranch, FiGitCommit, FiGitMerge, FiGitPullRequest, FiGithub, FiGitlab, FiGlobe, FiGrid, FiHardDrive, FiHash, FiHeadphones, FiHeart, FiHelpCircle, FiHexagon, FiHome, FiImage, FiInbox, FiInfo, FiInstagram, FiItalic, FiKey, FiLayers, FiLayout, FiLifeBuoy, FiLink, FiLink2, FiLinkedin, FiList, FiLoader, FiLock, FiLogIn, FiLogOut, FiMail, FiMap, FiMapPin, FiMaximize, FiMaximize2, FiMeh, FiMenu, FiMessageCircle, FiMessageSquare, FiMic, FiMicOff, FiMinimize, FiMinimize2, FiMinus, FiMinusCircle, FiMinusSquare, FiMonitor, FiMoon, FiMoreHorizontal, FiMoreVertical, FiMousePointer, FiMove, FiMusic, FiNavigation, FiNavigation2, FiOctagon, FiPackage, FiPaperclip, FiPause, FiPauseCircle, FiPenTool, FiPercent, FiPhone, FiPhoneCall, FiPhoneForwarded, FiPhoneIncoming, FiPhoneMissed, FiPhoneOff, FiPhoneOutgoing, FiPieChart, FiPlay, FiPlayCircle, FiPlus, FiPlusCircle, FiPlusSquare, FiPocket, FiPower, FiPrinter, FiRadio, FiRefreshCcw, FiRefreshCw, FiRepeat, FiRewind, FiRotateCcw, FiRotateCw, FiRss, FiSave, FiScissors, FiSearch, FiSend, FiServer, FiSettings, FiShare, FiShare2, FiShield, FiShieldOff, FiShoppingBag, FiShoppingCart, FiShuffle, FiSidebar, FiSkipBack, FiSkipForward, FiSlack, FiSlash, FiSliders, FiSmartphone, FiSmile, FiSpeaker, FiSquare, FiStar, FiStopCircle, FiSun, FiSunrise, FiSunset, FiTablet, FiTag, FiTarget, FiTerminal, FiThermometer, FiThumbsDown, FiThumbsUp, FiToggleLeft, FiToggleRight, FiTool, FiTrash, FiTrash2, FiTrello, FiTrendingDown, FiTrendingUp, FiTriangle, FiTruck, FiTv, FiTwitch, FiTwitter, FiType, FiUmbrella, FiUnderline, FiUnlock, FiUpload, FiUploadCloud, FiUser, FiUserCheck, FiUserMinus, FiUserPlus, FiUserX, FiUsers, FiVideo, FiVideoOff, FiVoicemail, FiVolume, FiVolume1, FiVolume2, FiVolumeX, FiWatch, FiWind, FiX, FiXCircle, FiXOctagon, FiXSquare, FiYoutube, FiZap, FiZapOff, FiZoomIn, FiZoomOut } from "react-icons/fi";
const FeatherIcons = () => {
  return (
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
                <span>Feather Icons</span>
              </h3>
            </div>
            <div className="col text-end">
              <ul className="breadcrumb bg-white float-end m-0 ps-0 pe-0">
                <li className="breadcrumb-item">
                  <Link to="/index">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Feather Icons</li>
              </ul>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            {/* Chart */}
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Feather Icon</div>
                </div>
                <div className="card-body">
                  <div className="icons-items">
                    <ul className="icons-list">
                      <li><FiActivity /></li>
                      <li><FiAirplay /></li>
                      <li><FiAlertCircle /></li>
                      <li><FiAlertOctagon /></li>
                      <li><FiAlertTriangle /></li>
                      <li><FiAlignCenter /></li>
                      <li><FiAlignJustify /></li>
                      <li><FiAlignLeft /></li>
                      <li><FiAlignRight /></li>
                      <li><FiAnchor /></li>
                      <li><FiAperture /></li>
                      <li><FiArchive /></li>
                      <li><FiArrowDownCircle /></li>
                      <li><FiArrowDownLeft /></li>
                      <li><FiArrowDownRight /></li>
                      <li><FiArrowDown /></li>
                      <li><FiArrowLeftCircle /></li>
                      <li><FiArrowLeft /></li>
                      <li><FiArrowRightCircle /></li>
                      <li><FiArrowRight /></li>
                      <li><FiArrowUpCircle /></li>
                      <li><FiArrowUpLeft /></li>
                      <li><FiArrowUpRight /></li>
                      <li><FiArrowUp /></li>
                      <li><FiAtSign /></li>
                      <li><FiAward /></li>
                      <li><FiBarChart2 /></li>
                      <li><FiBarChart /></li>
                      <li><FiBatteryCharging /></li>
                      <li><FiBattery /></li>
                      <li><FiBellOff /></li>
                      <li><FiBell /></li>
                      <li><FiBluetooth /></li>
                      <li><FiBold /></li>
                      <li><FiBookOpen /></li>
                      <li><FiBook /></li>
                      <li><FiBookmark /></li>
                      <li><FiBox /></li>
                      <li><FiBriefcase /></li>
                      <li><FiCalendar /></li>
                      <li><FiCameraOff /></li>
                      <li><FiCamera /></li>
                      <li><FiCast /></li>
                      <li><FiCheckCircle /></li>
                      <li><FiCheckSquare /></li>
                      <li><FiCheck /></li>
                      <li><FiChevronDown /></li>
                      <li><FiChevronLeft /></li>
                      <li><FiChevronRight /></li>
                      <li><FiChevronUp /></li>
                      <li><FiChevronsDown /></li>
                      <li><FiChevronsLeft /></li>
                      <li><FiChevronsRight /></li>
                      <li><FiChevronsUp /></li>
                      <li><FiChrome /></li>
                      <li><FiCircle /></li>
                      <li><FiClipboard /></li>
                      <li><FiClock /></li>
                      <li><FiCloudDrizzle /></li>
                      <li><FiCloudLightning /></li>
                      <li><FiCloudOff /></li>
                      <li><FiCloudRain /></li>
                      <li><FiCloudSnow /></li>
                      <li><FiCloud /></li>
                      <li><FiCode /></li>
                      <li><FiCodepen /></li>
                      <li><FiCodesandbox /></li>
                      <li><FiCoffee /></li>
                      <li><FiColumns /></li>
                      <li><FiCommand /></li>
                      <li><FiCompass /></li>
                      <li><FiCopy /></li>
                      <li><FiCornerDownLeft /></li>
                      <li><FiCornerDownRight /></li>
                      <li><FiCornerLeftDown /></li>
                      <li><FiCornerLeftUp /></li>
                      <li><FiCornerRightDown /></li>
                      <li><FiCornerRightUp /></li>
                      <li><FiCornerUpLeft /></li>
                      <li><FiCornerUpRight /></li>
                      <li><FiCpu /></li>
                      <li><FiCreditCard /></li>
                      <li><FiCrop /></li>
                      <li><FiCrosshair /></li>
                      <li><FiDatabase /></li>
                      <li><FiDelete /></li>
                      <li><FiDisc /></li>
                      <li><FiDivideCircle /></li>
                      <li><FiDivideSquare /></li>
                      <li><FiDivide /></li>
                      <li><FiDollarSign /></li>
                      <li><FiDownloadCloud /></li>
                      <li><FiDownload /></li>
                      <li><FiDribbble /></li>
                      <li><FiDroplet /></li>
                      <li><FiEdit2 /></li>
                      <li><FiEdit3 /></li>
                      <li><FiEdit /></li>
                      <li><FiExternalLink /></li>
                      <li><FiEyeOff /></li>
                      <li><FiEye /></li>
                      <li><FiFacebook /></li>
                      <li><FiFastForward /></li>
                      <li><FiFeather /></li>
                      <li><FiFlag /></li>
                      <li><FiFolderMinus /></li>
                      <li><FiFolderPlus /></li>
                      <li><FiFolder /></li>
                      <li><FiFramer /></li>
                      <li><FiFrown /></li>
                      <li><FiGift /></li>
                      <li><FiGitBranch /></li>
                      <li><FiGitCommit /></li>
                      <li><FiGitMerge /></li>
                      <li><FiGitPullRequest /></li>
                      <li><FiGithub /></li>
                      <li><FiGitlab /></li>
                      <li><FiGlobe /></li>
                      <li><FiGrid /></li>
                      <li><FiHardDrive /></li>
                      <li><FiHash /></li>
                      <li><FiHeadphones /></li>
                      <li><FiHeart /></li>
                      <li><FiHelpCircle /></li>
                      <li><FiHexagon /></li>
                      <li><FiHome /></li>
                      <li><FiImage /></li>
                      <li><FiInbox /></li>
                      <li><FiInfo /></li>
                      <li><FiInstagram /></li>
                      <li><FiItalic /></li>
                      <li><FiKey /></li>
                      <li><FiLayers /></li>
                      <li><FiLayout /></li>
                      <li><FiLifeBuoy /></li>
                      <li><FiLink2 /></li>
                      <li><FiLink /></li>
                      <li><FiLinkedin /></li>
                      <li><FiList /></li>
                      <li><FiLoader /></li>
                      <li><FiLock /></li>
                      <li><FiLogIn /></li>
                      <li><FiLogOut /></li>
                      <li><FiMail /></li>
                      <li><FiMapPin /></li>
                      <li><FiMap /></li>
                      <li><FiMaximize2 /></li>
                      <li><FiMaximize /></li>
                      <li><FiMeh /></li>
                      <li><FiMenu /></li>
                      <li><FiMessageCircle /></li>
                      <li><FiMessageSquare /></li>
                      <li><FiMicOff /></li>
                      <li><FiMic /></li>
                      <li><FiMinimize2 /></li>
                      <li><FiMinimize /></li>
                      <li><FiMinusCircle /></li>
                      <li><FiMinusSquare /></li>
                      <li><FiMinus /></li>
                      <li><FiMonitor /></li>
                      <li><FiMoon /></li>
                      <li><FiMoreHorizontal /></li>
                      <li><FiMoreVertical /></li>
                      <li><FiMousePointer /></li>
                      <li><FiMove /></li>
                      <li><FiMusic /></li>
                      <li><FiNavigation2 /></li>
                      <li><FiNavigation /></li>
                      <li><FiOctagon /></li>
                      <li><FiPackage /></li>
                      <li><FiPaperclip /></li>
                      <li><FiPauseCircle /></li>
                      <li><FiPause /></li>
                      <li><FiPenTool /></li>
                      <li><FiPercent /></li>
                      <li><FiPhoneCall /></li>
                      <li><FiPhoneForwarded /></li>
                      <li><FiPhoneIncoming /></li>
                      <li><FiPhoneMissed /></li>
                      <li><FiPhoneOff /></li>
                      <li><FiPhoneOutgoing /></li>
                      <li><FiPhone /></li>
                      <li><FiPieChart /></li>
                      <li><FiPlayCircle /></li>
                      <li><FiPlay /></li>
                      <li><FiPlusCircle /></li>
                      <li><FiPlusSquare /></li>
                      <li><FiPlus /></li>
                      <li><FiPocket /></li>
                      <li><FiPower /></li>
                      <li><FiPrinter /></li>
                      <li><FiRadio /></li>
                      <li><FiRefreshCcw /></li>
                      <li><FiRefreshCw /></li>
                      <li><FiRepeat /></li>
                      <li><FiRewind /></li>
                      <li><FiRotateCcw /></li>
                      <li><FiRotateCw /></li>
                      <li><FiRss /></li>
                      <li><FiSave /></li>
                      <li><FiScissors /></li>
                      <li><FiSearch /></li>
                      <li><FiSend /></li>
                      <li><FiServer /></li>
                      <li><FiSettings /></li>
                      <li><FiShare2 /></li>
                      <li><FiShare /></li>
                      <li><FiShieldOff /></li>
                      <li><FiShield /></li>
                      <li><FiShoppingBag /></li>
                      <li><FiShoppingCart /></li>
                      <li><FiShuffle /></li>
                      <li><FiSidebar /></li>
                      <li><FiSkipBack /></li>
                      <li><FiSkipForward /></li>
                      <li><FiSlack /></li>
                      <li><FiSlash /></li>
                      <li><FiSliders /></li>
                      <li><FiSmartphone /></li>
                      <li><FiSmile /></li>
                      <li><FiSpeaker /></li>
                      <li><FiSquare /></li>
                      <li><FiStar /></li>
                      <li><FiStopCircle /></li>
                      <li><FiSun /></li>
                      <li><FiSunrise /></li>
                      <li><FiSunset /></li>
                      <li><FiTablet /></li>
                      <li><FiTag /></li>
                      <li><FiTarget /></li>
                      <li><FiTerminal /></li>
                      <li><FiThermometer /></li>
                      <li><FiThumbsDown /></li>
                      <li><FiThumbsUp /></li>
                      <li><FiToggleLeft /></li>
                      <li><FiToggleRight /></li>
                      <li><FiTool /></li>
                      <li><FiTrash2 /></li>
                      <li><FiTrash /></li>
                      <li><FiTrello /></li>
                      <li><FiTrendingDown /></li>
                      <li><FiTrendingUp /></li>
                      <li><FiTriangle /></li>
                      <li><FiTruck /></li>
                      <li><FiTv /></li>
                      <li><FiTwitch /></li>
                      <li><FiTwitter /></li>
                      <li><FiType /></li>
                      <li><FiUmbrella /></li>
                      <li><FiUnderline /></li>
                      <li><FiUnlock /></li>
                      <li><FiUploadCloud /></li>
                      <li><FiUpload /></li>
                      <li><FiUserCheck /></li>
                      <li><FiUserMinus /></li>
                      <li><FiUserPlus /></li>
                      <li><FiUserX /></li>
                      <li><FiUser /></li>
                      <li><FiUsers /></li>
                      <li><FiVideoOff /></li>
                      <li><FiVideo /></li>
                      <li><FiVoicemail /></li>
                      <li><FiVolume1 /></li>
                      <li><FiVolume2 /></li>
                      <li><FiVolumeX /></li>
                      <li><FiVolume /></li>
                      <li><FiWatch /></li>
                      <li><FiWind /></li>
                      <li><FiXCircle /></li>
                      <li><FiXOctagon /></li>
                      <li><FiXSquare /></li>
                      <li><FiX /></li>
                      <li><FiYoutube /></li>
                      <li><FiZapOff /></li>
                      <li><FiZap /></li>
                      <li><FiZoomIn /></li>
                      <li><FiZoomOut /></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* /Chart */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>

  )
};
export default FeatherIcons;  