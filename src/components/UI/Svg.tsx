import { useContext } from "react";
import {
  CryptoContext,
  CryptoContextProps,
} from "../../contexts/cryptoContext";

type CloseIconProps = { togglePopup: () => void };

export const CloseIcon: React.FC<CloseIconProps> = ({ togglePopup }) => {
  const { darkMode } = useContext(CryptoContext) as CryptoContextProps;

  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={darkMode ? "rgba(255 ,255 ,255 ,1)" : "rgba(66, 66, 134, 1)"}
      className="w-8 h-8 cursor-pointer"
      onClick={togglePopup}
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <rect x="0" fill="none" width="24" height="24"></rect>{" "}
        <g>
          {" "}
          <path d="M19.1 4.9C15.2 1 8.8 1 4.9 4.9S1 15.2 4.9 19.1s10.2 3.9 14.1 0 4-10.3.1-14.2zm-4.3 11.3L12 13.4l-2.8 2.8-1.4-1.4 2.8-2.8-2.8-2.8 1.4-1.4 2.8 2.8 2.8-2.8 1.4 1.4-2.8 2.8 2.8 2.8-1.4 1.4z"></path>{" "}
        </g>{" "}
      </g>
    </svg>
  );
};

export const CoinPagePlusInCircleIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
    >
      <path
        fill-rule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
        clip-rule="evenodd"
      />
    </svg>
  );
};

export const SortArrowAccent = () => {
  const { darkMode } = useContext(CryptoContext) as CryptoContextProps;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={darkMode ? "rgba(209, 209, 209, 1)" : "rgba(66, 66, 134, 1)"}
      className="w-5 h-5 cursor-pointer"
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const SortArrowDescent = () => {
  const { darkMode } = useContext(CryptoContext) as CryptoContextProps;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={darkMode ? "rgba(209, 209, 209, 1)" : "rgba(66, 66, 134, 1)"}
      className="w-5 h-5 cursor-pointer"
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 14.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const SortArrowOriginal = () => {
  const { darkMode } = useContext(CryptoContext) as CryptoContextProps;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={darkMode ? "rgba(209, 209, 209, 1)" : "rgba(66, 66, 134, 1)"}
      className="w-5 h-5 cursor-pointer"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm6-2.438c0-.724.588-1.312 1.313-1.312h4.874c.725 0 1.313.588 1.313 1.313v4.874c0 .725-.588 1.313-1.313 1.313H9.564a1.312 1.312 0 0 1-1.313-1.313V9.564Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const ConvertButton = () => {
  const { darkMode } = useContext(CryptoContext) as CryptoContextProps;
  return (
    <svg
      fill={darkMode ? "rgba(61, 61, 126, 1)" : "rgba(255, 255, 255, 1)"}
      width="48"
      height="48"
      viewBox="-138.24 -138.24 788.48 788.48"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#000000"
      stroke-width="0.00512"
    >
      <g
        id="SVGRepo_bgCarrier"
        stroke-width="0"
        transform="translate(0,0), scale(1)"
      >
        <rect
          x="-138.24"
          y="-138.24"
          width="788.48"
          height="788.48"
          rx="394.24"
          fill={darkMode ? "rgba(255, 255, 255, 1)" : "rgba(53, 53, 112, 1)"}
          strokeWidth="0"
        ></rect>
      </g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M0 168v-16c0-13.255 10.745-24 24-24h360V80c0-21.367 25.899-32.042 40.971-16.971l80 80c9.372 9.373 9.372 24.569 0 33.941l-80 80C409.956 271.982 384 261.456 384 240v-48H24c-13.255 0-24-10.745-24-24zm488 152H128v-48c0-21.314-25.862-32.08-40.971-16.971l-80 80c-9.372 9.373-9.372 24.569 0 33.941l80 80C102.057 463.997 128 453.437 128 432v-48h360c13.255 0 24-10.745 24-24v-16c0-13.255-10.745-24-24-24z"></path>
      </g>
    </svg>
  );
};

export const DollarSign = () => {
  const { darkMode } = useContext(CryptoContext) as CryptoContextProps;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={darkMode ? "rgba(255, 255, 255, 1)" : "rgba(66, 66, 134, 1)"}
      className="w-6 h-6 "
    >
      <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
      <path
        fill-rule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
        clip-rule="evenodd"
      />
    </svg>
  );
};

export const OpenDropDownArrowCurrencySelector = () => {
  const { darkMode } = useContext(CryptoContext) as CryptoContextProps;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke={darkMode ? "rgba(255, 255, 255, 1)" : "rgba(66, 66, 134, 1)"}
      className="w-4 h-4"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
};

export const MagnifyGlass = () => {
  const { darkMode } = useContext(CryptoContext) as CryptoContextProps;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke={darkMode ? "rgba(209, 209, 214, 1)" : "rgba(66, 66, 134, 1)"}
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  );
};

export const ComparisonIcon = () => {
  const { darkMode } = useContext(CryptoContext) as CryptoContextProps;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={`${darkMode ? "rgba(255,255,255,1)" : "rgba(24, 24, 37, 1)"}`}
      className="w-6 h-6"
    >
      <path
        fill-rule="evenodd"
        d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm4.5 7.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0v-2.25a.75.75 0 0 1 .75-.75Zm3.75-1.5a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0V12Zm2.25-3a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0V9.75A.75.75 0 0 1 13.5 9Zm3.75-1.5a.75.75 0 0 0-1.5 0v9a.75.75 0 0 0 1.5 0v-9Z"
        clip-rule="evenodd"
      />
    </svg>
  );
};

export const CloseIconWithoutCircle = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="rgba(255,255,255,1)"
      className="w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
};

export const ExchangeIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="rgba(255, 255, 255, 1)"
      className="w-6 h-6"
    >
      <path d="M16.5 6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v7.5a3 3 0 0 0 3 3v-6A4.5 4.5 0 0 1 10.5 6h6Z" />
      <path d="M18 7.5a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-7.5a3 3 0 0 1-3-3v-7.5a3 3 0 0 1 3-3H18Z" />
    </svg>
  );
};

export const CoinsIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="rgba(255, 255, 255, 1)"
      className="w-6 h-6"
    >
      <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const GreenDotInMarketData = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 1024 1024"
    >
      <title>circle</title>
      <circle
        cx="512"
        cy="512"
        r="256"
        fill="rgba(1, 241, 227, 1)"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const BitcoinIconInMarketData = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      width="24px"
      height="24px"
      version="1.1"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      fillRule="evenodd"
      clipRule="evenodd"
      viewBox="0 0 4091.27 4091.73"
    >
      <g id="Layer_x0020_1">
        <metadata id="CorelCorpID_0Corel-Layer" />
        <g id="_1421344023328">
          <path
            fill="#F7931A"
            fillRule="nonzero"
            d="M4030.06 2540.77c-273.24,1096.01 -1383.32,1763.02 -2479.46,1489.71 -1095.68,-273.24 -1762.69,-1383.39 -1489.33,-2479.31 273.12,-1096.13 1383.2,-1763.19 2479,-1489.95 1096.06,273.24 1763.03,1383.51 1489.76,2479.57l0.02 -0.02z"
          />
          <path
            fill="white"
            fillRule="nonzero"
            d="M2947.77 1754.38c40.72,-272.26 -166.56,-418.61 -450,-516.24l91.95 -368.8 -224.5 -55.94 -89.51 359.09c-59.02,-14.72 -119.63,-28.59 -179.87,-42.34l90.16 -361.46 -224.36 -55.94 -92 368.68c-48.84,-11.12 -96.81,-22.11 -143.35,-33.69l0.26 -1.16 -309.59 -77.31 -59.72 239.78c0,0 166.56,38.18 163.05,40.53 90.91,22.69 107.35,82.87 104.62,130.57l-104.74 420.15c6.26,1.59 14.38,3.89 23.34,7.49 -7.49,-1.86 -15.46,-3.89 -23.73,-5.87l-146.81 588.57c-11.11,27.62 -39.31,69.07 -102.87,53.33 2.25,3.26 -163.17,-40.72 -163.17,-40.72l-111.46 256.98 292.15 72.83c54.35,13.63 107.61,27.89 160.06,41.3l-92.9 373.03 224.24 55.94 92 -369.07c61.26,16.63 120.71,31.97 178.91,46.43l-91.69 367.33 224.51 55.94 92.89 -372.33c382.82,72.45 670.67,43.24 791.83,-303.02 97.63,-278.78 -4.86,-439.58 -206.26,-544.44 146.69,-33.83 257.18,-130.31 286.64,-329.61l-0.07 -0.05zm-512.93 719.26c-69.38,278.78 -538.76,128.08 -690.94,90.29l123.28 -494.2c152.17,37.99 640.17,113.17 567.67,403.91zm69.43 -723.3c-63.29,253.58 -453.96,124.75 -580.69,93.16l111.77 -448.21c126.73,31.59 534.85,90.55 468.94,355.05l-0.02 0z"
          />
        </g>
      </g>
    </svg>
  );
};

export const AppIcon = () => {
  return (
    <svg
      width="36"
      height="24"
      viewBox="0 -2 36 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_587_3440)">
        <path
          d="M12.3431 0C10.3124 0 8.36487 0.8067 6.92893 2.24264L2.24264 6.92893C0.8067 8.36487 0 10.3124 0 12.3431C0 16.5719 3.42809 20 7.65687 20C9.6876 20 11.6351 19.1933 13.0711 17.7573L16.3126 14.5158C16.3126 14.5157 16.3127 14.5159 16.3126 14.5158L25.7573 5.07107C26.4431 4.38527 27.3733 4 28.3431 4C29.9669 4 31.3435 5.05827 31.8207 6.52271L34.8015 3.54197C33.4417 1.41223 31.0573 0 28.3431 0C26.3124 0 24.3649 0.8067 22.9289 2.24264L10.2427 14.9289C9.55687 15.6147 8.62673 16 7.65687 16C5.63723 16 4 14.3628 4 12.3431C4 11.3733 4.38527 10.4431 5.07107 9.75733L9.75733 5.07107C10.4431 4.38527 11.3733 4 12.3431 4C13.9669 4 15.3435 5.05832 15.8207 6.52281L18.8015 3.54205C17.4417 1.41227 15.0574 0 12.3431 0Z"
          fill="#6161D6"
          fillOpacity="1"
        ></path>
        <path
          d="M10.0439 14.9289C9.35807 15.6147 8.42793 16 7.45807 16C5.83453 16 4.45807 14.942 3.98067 13.4778L1 16.4585C2.35987 18.5879 4.74406 20 7.45807 20C9.4888 20 11.4363 19.1933 12.8723 17.7573L25.5585 5.07107C26.2443 4.38527 27.1745 4 28.1443 4C30.164 4 31.8012 5.63723 31.8012 7.65687C31.8012 8.62673 31.4159 9.55687 30.7301 10.2427L26.0439 14.9289C25.3581 15.6147 24.4279 16 23.4581 16C21.8344 16 20.4579 14.9418 19.9805 13.4775L16.9999 16.4582C18.3597 18.5879 20.7439 20 23.4581 20C25.4888 20 27.4363 19.1933 28.8723 17.7573L33.5585 13.0711C34.9945 11.6351 35.8012 9.6876 35.8012 7.65687C35.8012 3.42809 32.3731 0 28.1443 0C26.1136 0 24.1661 0.8067 22.7301 2.24264L10.0439 14.9289Z"
          fill="#6161D6"
          fillOpacity="1"
        ></path>
      </g>
      <defs>
        <clipPath id="clip0_587_3440">
          <rect width="36" height="20" fill="white" fillOpacity="1"></rect>
        </clipPath>
      </defs>
    </svg>
  );
};

export const EthereumIconInMarketData = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24px"
      height="24px"
      viewBox="0 0 32 32"
    >
      <g fill="none" fillRule="evenodd">
        <circle cx="16" cy="16" r="16" fill="#627EEA" />
        <g fill="#FFF" fillRule="nonzero">
          <path fillOpacity=".602" d="M16.498 4v8.87l7.497 3.35z" />
          <path d="M16.498 4L9 16.22l7.498-3.35z" />
          <path fillOpacity=".602" d="M16.498 21.968v6.027L24 17.616z" />
          <path d="M16.498 27.995v-6.028L9 17.616z" />
          <path fillOpacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z" />
          <path fillOpacity=".602" d="M9 16.22l7.498 4.353v-7.701z" />
        </g>
      </g>
    </svg>
  );
};

type HomeIconProps = {
  loadHomePage: boolean;
};

export const HomeIcon: React.FC<HomeIconProps> = ({ loadHomePage }) => {
  const { darkMode } = useContext(CryptoContext) as CryptoContextProps;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={
        darkMode
          ? loadHomePage
            ? "rgba(255, 255, 255, 1)"
            : "rgba(255, 255, 255, 0.5)"
          : loadHomePage
          ? "rgba(53, 53, 112, 1)"
          : "rgba(161, 161, 170, 1)"
      }
      className="w-6 h-6"
    >
      <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
      <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
    </svg>
  );
};

type PortfolioIconProps = {
  loadHomePage: boolean;
};

export const PortfolioIcon: React.FC<PortfolioIconProps> = ({
  loadHomePage,
}) => {
  const { darkMode } = useContext(CryptoContext) as CryptoContextProps;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={
        darkMode
          ? !loadHomePage
            ? "rgba(255, 255, 255, 1)"
            : "rgba(255, 255, 255, 0.5)"
          : !loadHomePage
          ? "rgba(53, 53, 112, 1)"
          : "rgba(161, 161, 170, 1)"
      }
      className="w-6 h-6"
    >
      <path d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z" />
      <path d="m3.265 10.602 7.668 4.129a2.25 2.25 0 0 0 2.134 0l7.668-4.13 1.37.739a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.71 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.37-.738Z" />
      <path d="m10.933 19.231-7.668-4.13-1.37.739a.75.75 0 0 0 0 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 0 0 0-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 0 1-2.134-.001Z" />
    </svg>
  );
};

export const SunIconForLightMode = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="rgba(255, 255, 255, 1)"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      />
    </svg>
  );
};

export const MoonIconForLightMode = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="rgba(66, 66, 134, 1)"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
      />
    </svg>
  );
};
