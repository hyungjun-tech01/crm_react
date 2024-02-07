import React from 'react';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  SlActionRedo, SlActionUndo, SlAnchor, SlArrowDown, SlArrowDownCircle, SlArrowLeft, SlArrowLeftCircle, SlArrowRight, SlArrowRightCircle, SlArrowUp, SlArrowUpCircle, SlBadge, SlBag, SlBan, SlBasket, SlBasketLoaded, SlBell, SlBookOpen, SlBriefcase, SlBubble, SlBubbles, SlBulb, SlCalculator, SlCalender, SlCallEnd, SlCallIn, SlCallOut, SlCamera, SlCamrecorder, SlChart, SlCheck, SlChemistry, SlClock, SlClose, SlCloudDownload, SlCloudUpload, SlCompass, SlControlEnd, SlControlForward, SlControlPause, SlControlPlay, SlControlRewind, SlControlStart, SlCreditCard, SlCrop, SlCup, SlCursor, SlCursorMove, SlDiamond, SlDirection, SlDirections, SlDisc, SlDislike, SlDoc, SlDocs, SlDrawer, SlDrop, SlEarphones, SlEarphonesAlt, SlEmotsmile, SlEnergy, SlEnvelopeOpen, SlEnvolope, SlEnvolopeLetter, SlEqualizer, SlEvent, SlExclamation, SlEye, SlEyeglass, SlFeed, SlFilm, SlFire, SlFlag, SlFolder, SlFolderAlt, SlFrame, SlGameController, SlGhost, SlGlobe, SlGlobeAlt, SlGraduation, SlGraph, SlGrid, SlHandbag, SlHeart, SlHome, SlHourglass, SlInfo, SlKey, SlLayers, SlLike, SlLink, SlList, SlLocationPin, SlLock, SlLockOpen, SlLogin, SlLogout, SlLoop, SlMagicWand
  ,SlMagnet,
  SlMagnifierAdd,
  SlMagnifierRemove,
  SlMagnifier,
  SlMap,
  SlMenu,
  SlMicrophone,
  SlMinus,
  SlMouse,
  SlMusicToneAlt,
  SlMusicTone,
  SlMustache,
  SlNote,
  SlNotebook,
  SlOptionsVertical,
  SlOptions,
  SlOrganization,
  SlPaperClip,
  SlPaperPlane,
  SlPaypal,
  SlPencil,
  SlPeople,
  SlPhone,
  SlPicture,
  SlPieChart,
  SlPin,
  SlPlane,
  SlPlaylist,
  SlPlus,
  SlPower,
  SlPresent,
  SlPrinter,
  SlPuzzle,
  SlQuestion,
  SlRefresh,
  SlReload,
  SlRocket,
  SlScreenDesktop,
  SlScreenSmartphone,
  SlScreenTablet,
  SlSettings,
  SlShareAlt,
  SlShare,
  SlShield,
  SlShuffle,
  SlSizeActual,
  SlSizeFullscreen,
  SlSocialBehance,
  SlSocialDribbble,
  SlSocialDropbox,
  SlSocialFacebook,
  SlSocialFoursqare,
  SlSocialGithub,
  SlSocialGoogle,
  SlSocialInstagram,
  SlSocialLinkedin,
  SlSocialPintarest,
  SlSocialReddit,
  SlSocialSkype,
  SlSocialSoundcloud,
  SlSocialSpotify,
  SlSocialSteam,
  SlSocialStumbleupon,
  SlSocialTumblr,
  SlSocialTwitter,
  SlSocialVkontakte,
  SlSocialYoutube,
  SlSpeech,
  SlSpeedometer,
  SlStar,
  SlSupport,
  SlSymbleFemale,
  SlSymbolMale,
  SlTag,
  SlTarget,
  SlTrash,
  SlTrophy,
  SlUmbrella,
  SlUserFemale,
  SlUserFollow,
  SlUserFollowing,
  SlUserUnfollow,
  SlUser,
  SlVector,
  SlVolume1,
  SlVolume2,
  SlVolumeOff,
  SlWallet,
  SlWrench
} from "react-icons/sl";
const SimplelineIcons = () => {
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
                <span>Simpleline Icons</span>
              </h3>
            </div>
            <div className="col text-end">
              <ul className="breadcrumb bg-white float-end m-0 ps-0 pe-0">
                <li className="breadcrumb-item">
                  <Link to="/index">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Simpleline Icons</li>
              </ul>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            {/* Chart */}
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Simpleline Icons</div>
                </div>
                <div className="card-body">
                  <div className="icons-items">

                    <ul className="icons-list">

                      <li><SlActionRedo /></li>
                      <li><SlActionUndo
                      /></li>
                      <li><SlAnchor
                      /></li><li><SlArrowDownCircle
                      /></li><li><SlArrowDown
                      /></li><li><SlArrowLeftCircle
                      /></li><li><SlArrowLeft
                      /></li><li><SlArrowRightCircle
                      /></li><li><SlArrowRight
                      /></li><li><SlArrowUpCircle
                      /></li><li><SlArrowUp
                      /></li><li><SlBadge
                      /></li><li><SlBag
                      /></li><li><SlBan
                      /></li><li><SlBasketLoaded
                      /></li><li><SlBasket
                      /></li><li><SlBell
                      /></li><li><SlBookOpen
                      /></li><li><SlBriefcase
                      /></li><li><SlBubble
                      /></li><li><SlBubbles
                      /></li><li><SlBulb
                      /></li><li><SlCalculator
                      /></li><li><SlCalender
                      /></li><li><SlCallEnd
                      /></li><li><SlCallIn
                      /></li><li><SlCallOut
                      /></li><li><SlCamera
                      /></li><li><SlCamrecorder
                      /></li><li><SlChart
                      /></li><li><SlCheck
                      /></li><li><SlChemistry
                      /></li><li><SlClock
                      /></li><li><SlClose
                      /></li><li><SlCloudDownload
                      /></li><li><SlCloudUpload
                      /></li><li><SlCompass
                      /></li><li><SlControlEnd
                      /></li><li><SlControlForward
                      /></li><li><SlControlPause
                      /></li><li><SlControlPlay
                      /></li><li><SlControlRewind
                      /></li><li><SlControlStart
                      /></li><li><SlCreditCard
                      /></li><li><SlCrop
                      /></li><li><SlCup
                      /></li><li><SlCursorMove
                      /></li><li><SlCursor
                      /></li><li><SlDiamond
                      /></li><li><SlDirection
                      /></li><li><SlDirections
                      /></li><li><SlDisc
                      /></li>
                      <li><SlDoc
                      /></li><li><SlDocs
                      /></li><li><SlDrawer
                      /></li><li><SlDrop
                      /></li><li><SlEarphonesAlt
                      /></li><li><SlEarphones
                      /></li><li><SlEmotsmile
                      /></li><li><SlEnergy
                      /></li><li><SlEnvelopeOpen
                      /></li><li><SlEnvolopeLetter
                      /></li><li><SlEnvolope
                      /></li><li><SlEqualizer
                      /></li><li><SlEvent
                      /></li><li><SlExclamation
                      /></li><li><SlEye
                      /></li><li><SlEyeglass
                      /></li><li><SlFeed
                      /></li><li><SlFilm
                      /></li><li><SlFire
                      /></li><li><SlFlag
                      /></li><li><SlFolderAlt
                      /></li><li><SlFolder
                      /></li><li><SlFrame
                      /></li><li><SlGameController
                      /></li><li><SlGhost
                      /></li><li><SlGlobeAlt
                      /></li><li><SlGlobe
                      /></li><li><SlGraduation
                      /></li><li><SlGraph
                      /></li><li><SlGrid
                      /></li><li><SlHandbag
                      /></li><li><SlHeart
                      /></li><li><SlHome
                      /></li><li><SlHourglass
                      /></li><li><SlInfo
                      /></li><li><SlKey
                      /></li><li><SlLayers
                      /></li><li><SlLike
                      /></li><li><SlLink
                      /></li><li><SlList
                      /></li><li><SlLocationPin
                      /></li><li><SlLockOpen
                      /></li><li><SlLock
                      /></li><li><SlLogin
                      /></li><li><SlLogout
                      /></li><li><SlLoop
                      /></li><li><SlMagicWand
                      /></li><li><SlMagnet
                      /></li><li><SlMagnifierAdd
                      /></li><li><SlMagnifierRemove
                      /></li><li><SlMagnifier
                      /></li><li><SlMap
                      /></li><li><SlMenu
                      /></li><li><SlMicrophone
                      /></li><li><SlMinus
                      /></li><li><SlMouse
                      /></li><li><SlMusicToneAlt
                      /></li><li><SlMusicTone
                      /></li><li><SlMustache
                      /></li><li><SlNote
                      /></li><li><SlNotebook
                      /></li><li><SlOptionsVertical
                      /></li><li><SlOptions
                      /></li><li><SlOrganization
                      /></li><li><SlPaperClip
                      /></li><li><SlPaperPlane
                      /></li><li><SlPaypal
                      /></li><li><SlPencil
                      /></li><li><SlPeople
                      /></li><li><SlPhone
                      /></li><li><SlPicture
                      /></li><li><SlPieChart
                      /></li><li><SlPin
                      /></li><li><SlPlane
                      /></li><li><SlPlaylist
                      /></li><li><SlPlus
                      /></li><li><SlPower
                      /></li><li><SlPresent
                      /></li><li><SlPrinter
                      /></li><li><SlPuzzle
                      /></li><li><SlQuestion
                      /></li><li><SlRefresh
                      /></li><li><SlReload
                      /></li><li><SlRocket
                      /></li><li><SlScreenDesktop
                      /></li><li><SlScreenSmartphone
                      /></li><li><SlScreenTablet
                      /></li><li><SlSettings
                      /></li><li><SlShareAlt
                      /></li><li><SlShare
                      /></li><li><SlShield
                      /></li><li><SlShuffle
                      /></li><li><SlSizeActual
                      /></li><li><SlSizeFullscreen
                      /></li><li><SlSocialBehance
                      /></li><li><SlSocialDribbble
                      /></li><li><SlSocialDropbox
                      /></li><li><SlSocialFacebook
                      /></li><li><SlSocialFoursqare
                      /></li><li><SlSocialGithub
                      /></li><li><SlSocialGoogle
                      /></li><li><SlSocialInstagram
                      /></li><li><SlSocialLinkedin
                      /></li><li><SlSocialPintarest
                      /></li><li><SlSocialReddit
                      /></li><li><SlSocialSkype
                      /></li><li><SlSocialSoundcloud
                      /></li><li><SlSocialSpotify
                      /></li><li><SlSocialSteam
                      /></li><li><SlSocialStumbleupon
                      /></li><li><SlSocialTumblr
                      /></li><li><SlSocialTwitter
                      /></li><li><SlSocialVkontakte
                      /></li><li><SlSocialYoutube
                      /></li><li><SlSpeech
                      /></li><li><SlSpeedometer
                      /></li><li><SlStar
                      /></li><li><SlSupport
                      /></li><li><SlSymbleFemale
                      /></li><li><SlSymbolMale
                      /></li><li><SlTag
                      /></li><li><SlTarget
                      /></li><li><SlTrash
                      /></li><li><SlTrophy
                      /></li><li><SlUmbrella
                      /></li><li><SlUserFemale
                      /></li><li><SlUserFollow
                      /></li><li><SlUserFollowing
                      /></li><li><SlUserUnfollow
                      /></li><li><SlUser
                      /></li><li><SlVector
                      /></li><li><SlVolume1
                      /></li><li><SlVolume2
                      /></li><li><SlVolumeOff
                      /></li><li><SlWallet
                      /></li><li><SlWrench /></li>
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
export default SimplelineIcons;        