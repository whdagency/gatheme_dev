import React from "react";

const WaiterCancelIcon = (props) => {
  return (
    <svg
      width={props.width || "73"}
      height={props.height || "72"}
      viewBox="0 0 73 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_dd_34_1525)">
        <rect x="12.1299" y="2" width="48" height="48" rx="24" fill="white" />
        <path
          d="M37.4099 25.9999L41.7099 21.7099C41.8982 21.5216 42.004 21.2662 42.004 20.9999C42.004 20.7336 41.8982 20.4782 41.7099 20.2899C41.5216 20.1016 41.2662 19.9958 40.9999 19.9958C40.7336 19.9958 40.4782 20.1016 40.2899 20.2899L35.9999 24.5899L31.7099 20.2899C31.5216 20.1016 31.2662 19.9958 30.9999 19.9958C30.7336 19.9958 30.4782 20.1016 30.2899 20.2899C30.1016 20.4782 29.9958 20.7336 29.9958 20.9999C29.9958 21.2662 30.1016 21.5216 30.2899 21.7099L34.5899 25.9999L30.2899 30.2899C30.1962 30.3829 30.1218 30.4935 30.071 30.6154C30.0203 30.7372 29.9941 30.8679 29.9941 30.9999C29.9941 31.132 30.0203 31.2627 30.071 31.3845C30.1218 31.5064 30.1962 31.617 30.2899 31.7099C30.3829 31.8037 30.4935 31.8781 30.6154 31.9288C30.7372 31.9796 30.8679 32.0057 30.9999 32.0057C31.132 32.0057 31.2627 31.9796 31.3845 31.9288C31.5064 31.8781 31.617 31.8037 31.7099 31.7099L35.9999 27.4099L40.2899 31.7099C40.3829 31.8037 40.4935 31.8781 40.6154 31.9288C40.7372 31.9796 40.8679 32.0057 40.9999 32.0057C41.132 32.0057 41.2627 31.9796 41.3845 31.9288C41.5064 31.8781 41.617 31.8037 41.7099 31.7099C41.8037 31.617 41.8781 31.5064 41.9288 31.3845C41.9796 31.2627 42.0057 31.132 42.0057 30.9999C42.0057 30.8679 41.9796 30.7372 41.9288 30.6154C41.8781 30.4935 41.8037 30.3829 41.7099 30.2899L37.4099 25.9999Z"
          fill={props.fill || "#37392C"}
        />
      </g>
      <defs>
        <filter
          id="filter0_dd_34_1525"
          x="0.129883"
          y="0"
          width="72"
          height="72"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="4"
            operator="erode"
            in="SourceAlpha"
            result="effect1_dropShadow_34_1525"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_34_1525"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="3"
            operator="erode"
            in="SourceAlpha"
            result="effect2_dropShadow_34_1525"
          />
          <feOffset dy="10" />
          <feGaussianBlur stdDeviation="7.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_34_1525"
            result="effect2_dropShadow_34_1525"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_34_1525"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default WaiterCancelIcon;