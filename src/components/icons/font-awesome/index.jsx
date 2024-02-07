import React from 'react';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Fa500Px, FaAccessibleIcon, FaAccusoft, FaAcquisitionsIncorporated, FaAdn, FaAdversal, FaAffiliatetheme, FaAirbnb, FaAlgolia, FaAlipay, FaAmazon, FaAmazonPay, FaAmilia, FaAndroid, FaAngellist, FaAngrycreative, FaAngular, FaAppStore, FaAppStoreIos, FaApper, FaApple, FaApplePay, FaArtstation, FaAsymmetrik, FaAtlassian, FaAudible, FaAutoprefixer, FaAvianex, FaAviato, FaAws, FaBandcamp, FaBattleNet, FaBehance, FaBehanceSquare, FaBimobject, FaBitbucket, FaBitcoin, FaBity, FaBlackTie, FaBlackberry, FaBlogger, FaBloggerB, FaBluetooth, FaBluetoothB, FaBootstrap, FaBtc, FaBuffer, FaBuromobelexperte, FaBuyNLarge, FaBuysellads, FaCanadianMapleLeaf, FaCcAmazonPay, FaCcAmex, FaCcApplePay, FaCcDinersClub, FaCcDiscover, FaCcJcb, FaCcMastercard, FaCcPaypal, FaCcStripe, FaCcVisa, FaCentercode, FaCentos, FaChrome, FaChromecast, FaCloudflare, FaCloudscale, FaCloudsmith, FaCloudversify, FaCodepen, FaCodiepie, FaConfluence, FaConnectdevelop, FaContao, FaCottonBureau, FaCpanel, FaCreativeCommons, FaCreativeCommonsBy, FaCreativeCommonsNc, FaCreativeCommonsNcEu, FaCreativeCommonsNcJp, FaCreativeCommonsNd, FaCreativeCommonsPd, FaCreativeCommonsPdAlt, FaCreativeCommonsRemix, FaCreativeCommonsSa, FaCreativeCommonsSampling, FaCreativeCommonsSamplingPlus, FaCreativeCommonsShare, FaCreativeCommonsZero, FaCriticalRole, FaCss3, FaCss3Alt, FaCuttlefish, FaDAndD, FaDAndDBeyond, FaDailymotion, FaDashcube, FaDeezer, FaDelicious, FaDeploydog, FaDeskpro, FaDev, FaDeviantart, FaDhl, FaDiaspora, FaDigg, FaDigitalOcean, FaDiscord, FaDiscourse, FaDochub, FaDocker, FaDraft2Digital, FaDribbble, FaDribbbleSquare, FaDropbox, FaDrupal, FaDyalog, FaEarlybirds, FaEbay, FaEdge, FaEdgeLegacy, FaElementor, FaEllo, FaEmber, FaEmpire, FaEnvira, FaErlang, FaEthereum, FaEtsy, FaEvernote, FaExpeditedssl, FaFacebookF, FaFacebookMessenger, FaFacebookSquare, FaFantasyFlightGames, FaFedex, FaFedora, FaFigma, FaFirefox, FaFirefoxBrowser, FaFirstOrder, FaFirstOrderAlt, FaFirstdraft, FaFlickr, FaFlipboard, FaFly, FaFontAwesome, FaFontAwesomeAlt, FaFontAwesomeFlag, FaFontAwesomeLogoFull, FaFonticons, FaFonticonsFi, FaFortAwesome, FaFortAwesomeAlt, FaForumbee, FaFoursquare, FaFreeCodeCamp, FaFreebsd, FaFulcrum, FaGalacticRepublic, FaGalacticSenate, FaGetPocket, FaGg, FaGgCircle, FaGit, FaGitAlt, FaGitSquare, FaGithub, FaGithubAlt, FaGithubSquare, FaGitkraken, FaGitlab, FaGitter, FaGlide, FaGlideG, FaGofore, FaGoodreads, FaGoodreadsG, FaGoogle, FaGoogleDrive, FaGooglePay, FaGooglePlay, FaGooglePlus, FaGooglePlusG, FaGooglePlusSquare, FaGoogleWallet, FaGratipay, FaGrav, FaGripfire, FaGrunt, FaGuilded, FaGulp, FaHackerNews, FaHackerNewsSquare, FaHackerrank, FaHips, FaHireAHelper, FaHive } from "react-icons/fa";
import { Facebook } from '@material-ui/icons';
const FontawesomeIcons = () => {
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
                <span>Fontawesome Icons</span>
              </h3>
            </div>
            <div className="col text-end">
              <ul className="breadcrumb bg-white float-end m-0 ps-0 pe-0">
                <li className="breadcrumb-item">
                  <Link to="/index">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Fontawesome Icons</li>
              </ul>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            {/* Chart */}
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Fontawesome Icon</div>
                </div>
                <div className="card-body">
                  <div className="icons-items">
                    <ul className="icons-list">
                      <li><Fa500Px /></li>
                      <li><FaAccessibleIcon /></li>
                      <li><FaAccusoft /></li>
                      <li><FaAcquisitionsIncorporated /></li>
                      <li><FaAdn /></li>
                      <li><FaAdversal /></li>
                      <li><FaAffiliatetheme /></li>
                      <li><FaAirbnb /></li>
                      <li><FaAlgolia /></li>
                      <li><FaAlipay /></li>
                      <li><FaAmazonPay /></li>
                      <li><FaAmazon /></li>
                      <li><FaAmilia /></li>
                      <li><FaAndroid /></li>
                      <li><FaAngellist /></li>
                      <li><FaAngrycreative /></li>
                      <li><FaAngular /></li>
                      <li><FaAppStoreIos /></li>
                      <li><FaAppStore /></li>
                      <li><FaApper /></li>
                      <li><FaApplePay /></li>
                      <li><FaApple /></li>
                      <li><FaArtstation /></li>
                      <li><FaAsymmetrik /></li>
                      <li><FaAtlassian /></li>
                      <li><FaAudible /></li>
                      <li><FaAutoprefixer /></li>
                      <li><FaAvianex /></li>
                      <li><FaAviato /></li>
                      <li><FaAws /></li>
                      <li><FaBandcamp /></li>
                      <li><FaBattleNet /></li>
                      <li><FaBehanceSquare /></li>
                      <li><FaBehance /></li>
                      <li><FaBimobject /></li>
                      <li><FaBitbucket /></li>
                      <li><FaBitcoin /></li>
                      <li><FaBity /></li>
                      <li><FaBlackTie /></li>
                      <li><FaBlackberry /></li>
                      <li><FaBloggerB /></li>
                      <li><FaBlogger /></li>
                      <li><FaBluetoothB /></li>
                      <li><FaBluetooth /></li>
                      <li><FaBootstrap /></li>
                      <li><FaBtc /></li>
                      <li><FaBuffer /></li>
                      <li><FaBuromobelexperte /></li>
                      <li><FaBuyNLarge /></li>
                      <li><FaBuysellads /></li>
                      <li><FaCanadianMapleLeaf /></li>
                      <li><FaCcAmazonPay /></li>
                      <li><FaCcAmex /></li>
                      <li><FaCcApplePay /></li>
                      <li><FaCcDinersClub /></li>
                      <li><FaCcDiscover /></li>
                      <li><FaCcJcb /></li>
                      <li><FaCcMastercard /></li>
                      <li><FaCcPaypal /></li>
                      <li><FaCcStripe /></li>
                      <li><FaCcVisa /></li>
                      <li><FaCentercode /></li>
                      <li><FaCentos /></li>
                      <li><FaChrome /></li>
                      <li><FaChromecast /></li>
                      <li><FaCloudflare /></li>
                      <li><FaCloudscale /></li>
                      <li><FaCloudsmith /></li>
                      <li><FaCloudversify /></li>
                      <li><FaCodepen /></li>
                      <li><FaCodiepie /></li>
                      <li><FaConfluence /></li>
                      <li><FaConnectdevelop /></li>
                      <li><FaContao /></li>
                      <li><FaCottonBureau /></li>
                      <li><FaCpanel /></li>
                      <li><FaCreativeCommonsBy /></li>
                      <li><FaCreativeCommonsNcEu /></li>
                      <li><FaCreativeCommonsNcJp /></li>
                      <li><FaCreativeCommonsNc /></li>
                      <li><FaCreativeCommonsNd /></li>
                      <li><FaCreativeCommonsPdAlt /></li>
                      <li><FaCreativeCommonsPd /></li>
                      <li><FaCreativeCommonsRemix /></li>
                      <li><FaCreativeCommonsSa /></li>
                      <li><FaCreativeCommonsSamplingPlus /></li>
                      <li><FaCreativeCommonsSampling /></li>
                      <li><FaCreativeCommonsShare /></li>
                      <li><FaCreativeCommonsZero /></li>
                      <li><FaCreativeCommons /></li>
                      <li><FaCriticalRole /></li>
                      <li><FaCss3Alt /></li>
                      <li><FaCss3 /></li>
                      <li><FaCuttlefish /></li>
                      <li><FaDAndDBeyond /></li>
                      <li><FaDAndD /></li>
                      <li><FaDailymotion /></li>
                      <li><FaDashcube /></li>
                      <li><FaDeezer /></li>
                      <li><FaDelicious /></li>
                      <li><FaDeploydog /></li>
                      <li><FaDeskpro /></li>
                      <li><FaDev /></li>
                      <li><FaDeviantart /></li>
                      <li><FaDhl /></li>
                      <li><FaDiaspora /></li>
                      <li><FaDigg /></li>
                      <li><FaDigitalOcean /></li>
                      <li><FaDiscord /></li>
                      <li><FaDiscourse /></li>
                      <li><FaDochub /></li>
                      <li><FaDocker /></li>
                      <li><FaDraft2Digital /></li>
                      <li><FaDribbbleSquare /></li>
                      <li><FaDribbble /></li>
                      <li><FaDropbox /></li>
                      <li><FaDrupal /></li>
                      <li><FaDyalog /></li>
                      <li><FaEarlybirds /></li>
                      <li><FaEbay /></li>
                      <li><FaEdgeLegacy /></li>
                      <li><FaEdge /></li>
                      <li><FaElementor /></li>
                      <li><FaEllo /></li>
                      <li><FaEmber /></li>
                      <li><FaEmpire /></li>
                      <li><FaEnvira /></li>
                      <li><FaErlang /></li>
                      <li><FaEthereum /></li>
                      <li><FaEtsy /></li>
                      <li><FaEvernote /></li>
                      <li><FaExpeditedssl /></li>
                      <li><FaFacebookF /></li>
                      <li><FaFacebookMessenger /></li>
                      <li><FaFacebookSquare /></li>
                      <li><Facebook /></li>
                      <li><FaFantasyFlightGames /></li>
                      <li><FaFedex /></li>
                      <li><FaFedora /></li>
                      <li><FaFigma /></li>
                      <li><FaFirefoxBrowser /></li>
                      <li><FaFirefox /></li>
                      <li><FaFirstOrderAlt /></li>
                      <li><FaFirstOrder /></li>
                      <li><FaFirstdraft /></li>
                      <li><FaFlickr /></li>
                      <li><FaFlipboard /></li>
                      <li><FaFly /></li>
                      <li><FaFontAwesomeAlt /></li>
                      <li><FaFontAwesomeFlag /></li>
                      <li><FaFontAwesomeLogoFull /></li>
                      <li><FaFontAwesome /></li>
                      <li><FaFonticonsFi /></li>
                      <li><FaFonticons /></li>
                      <li><FaFortAwesomeAlt /></li>
                      <li><FaFortAwesome /></li>
                      <li><FaForumbee /></li>
                      <li><FaFoursquare /></li>
                      <li><FaFreeCodeCamp /></li>
                      <li><FaFreebsd /></li>
                      <li><FaFulcrum /></li>
                      <li><FaGalacticRepublic /></li>
                      <li><FaGalacticSenate /></li>
                      <li><FaGetPocket /></li>
                      <li><FaGgCircle /></li>
                      <li><FaGg /></li>
                      <li><FaGitAlt /></li>
                      <li><FaGitSquare /></li>
                      <li><FaGit /></li>
                      <li><FaGithubAlt /></li>
                      <li><FaGithubSquare /></li>
                      <li><FaGithub /></li>
                      <li><FaGitkraken /></li>
                      <li><FaGitlab /></li>
                      <li><FaGitter /></li>
                      <li><FaGlideG /></li>
                      <li><FaGlide /></li>
                      <li><FaGofore /></li>
                      <li><FaGoodreadsG /></li>
                      <li><FaGoodreads /></li>
                      <li><FaGoogleDrive /></li>
                      <li><FaGooglePay /></li>
                      <li><FaGooglePlay /></li>
                      <li><FaGooglePlusG /></li>
                      <li><FaGooglePlusSquare /></li>
                      <li><FaGooglePlus /></li>
                      <li><FaGoogleWallet /></li>
                      <li><FaGoogle /></li>
                      <li><FaGratipay /></li>
                      <li><FaGrav /></li>
                      <li><FaGripfire /></li>
                      <li><FaGrunt /></li>
                      <li><FaGuilded /></li>
                      <li><FaGulp /></li>
                      <li><FaHackerNewsSquare /></li>
                      <li><FaHackerNews /></li>
                      <li><FaHackerrank /></li>
                      <li><FaHips /></li>
                      <li><FaHireAHelper /></li>
                      <li><FaHive /></li>

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
export default FontawesomeIcons;        