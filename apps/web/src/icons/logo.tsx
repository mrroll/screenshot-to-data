import * as React from 'react';

type TElementRef = React.ElementRef<'svg'>;
type TComponentPropsWithoutRef = React.ComponentPropsWithoutRef<'svg'>;

export const LogoIcon = React.forwardRef<
  TElementRef,
  TComponentPropsWithoutRef
>((props, ref) => {
  const { className, ...rest } = props;

  return (
    <svg
      viewBox="0 0 129 127"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      className={className}
      {...rest}
    >
      <g opacity="0.5" filter="url(#filter0_f_301_103)">
        <rect
          width="63.1931"
          height="25.2772"
          rx="12.6386"
          transform="matrix(-0.5 -0.866025 -0.866025 0.5 120.466 105.006)"
          fill="url(#paint0_linear_301_103)"
        />
      </g>
      <rect
        width="63.1931"
        height="25.2772"
        rx="12.6386"
        transform="matrix(-0.5 -0.866025 -0.866025 0.5 116.211 99.571)"
        fill="url(#paint1_linear_301_103)"
      />
      <g opacity="0.3" filter="url(#filter1_f_301_103)">
        <rect
          x="47.3203"
          y="105.006"
          width="63.1931"
          height="25.2772"
          rx="12.6386"
          transform="rotate(-60 47.3203 105.006)"
          fill="url(#paint2_linear_301_103)"
        />
      </g>
      <rect
        x="43.0653"
        y="99.571"
        width="63.1931"
        height="25.2772"
        rx="12.6386"
        transform="rotate(-60 43.0653 99.571)"
        fill="black"
        fillOpacity="0.1"
      />
      <rect
        x="43.0653"
        y="99.571"
        width="63.1931"
        height="25.2772"
        rx="12.6386"
        transform="rotate(-60 43.0653 99.571)"
        fill="url(#paint3_linear_301_103)"
      />
      <g opacity="0.3" filter="url(#filter2_f_301_103)">
        <rect
          width="63.1931"
          height="25.2772"
          rx="12.6386"
          transform="matrix(-0.5 -0.866025 -0.866025 0.5 81.5927 105.006)"
          fill="url(#paint4_linear_301_103)"
        />
      </g>
      <rect
        width="63.1931"
        height="25.2772"
        rx="12.6386"
        transform="matrix(-0.5 -0.866025 -0.866025 0.5 77.3376 99.571)"
        fill="black"
        fillOpacity="0.1"
      />
      <rect
        width="63.1931"
        height="25.2772"
        rx="12.6386"
        transform="matrix(-0.5 -0.866025 -0.866025 0.5 77.3376 99.571)"
        fill="url(#paint5_linear_301_103)"
      />
      <g opacity="0.3" filter="url(#filter3_f_301_103)">
        <rect
          x="9.08704"
          y="104.985"
          width="63.1931"
          height="25.2772"
          rx="12.6386"
          transform="rotate(-60 9.08704 104.985)"
          fill="url(#paint6_linear_301_103)"
        />
      </g>
      <rect
        x="4.83203"
        y="99.5508"
        width="63.1931"
        height="25.2772"
        rx="12.6386"
        transform="rotate(-60 4.83203 99.5508)"
        fill="black"
        fillOpacity="0.1"
      />
      <rect
        x="4.83203"
        y="99.5508"
        width="63.1931"
        height="25.2772"
        rx="12.6386"
        transform="rotate(-60 4.83203 99.5508)"
        fill="url(#paint7_linear_301_103)"
      />
      <g opacity="0.3" filter="url(#filter4_f_301_103)">
        <circle cx="64.7411" cy="32.8324" r="18.9579" fill="#E960FF" />
        <circle
          cx="64.7411"
          cy="32.8324"
          r="18.9579"
          fill="url(#paint8_linear_301_103)"
        />
      </g>
      <circle cx="60.4861" cy="27.3979" r="18.9579" fill="#E960FF" />
      <circle
        cx="60.4861"
        cy="27.3979"
        r="18.9579"
        fill="url(#paint9_linear_301_103)"
      />
      <defs>
        <filter
          id="filter0_f_301_103"
          x="58.6062"
          y="41.9064"
          width="70.2323"
          height="84.1103"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="6.49821"
            result="effect1_foregroundBlur_301_103"
          />
        </filter>
        <filter
          id="filter1_f_301_103"
          x="38.9478"
          y="41.9064"
          width="70.2323"
          height="84.1103"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="6.49821"
            result="effect1_foregroundBlur_301_103"
          />
        </filter>
        <filter
          id="filter2_f_301_103"
          x="19.7328"
          y="41.9064"
          width="70.2323"
          height="84.1103"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="6.49821"
            result="effect1_foregroundBlur_301_103"
          />
        </filter>
        <filter
          id="filter3_f_301_103"
          x="0.714521"
          y="41.8862"
          width="70.2323"
          height="84.1103"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="6.49821"
            result="effect1_foregroundBlur_301_103"
          />
        </filter>
        <filter
          id="filter4_f_301_103"
          x="32.7868"
          y="0.878096"
          width="63.9087"
          height="63.9086"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="6.49821"
            result="effect1_foregroundBlur_301_103"
          />
        </filter>
        <linearGradient
          id="paint0_linear_301_103"
          x1="2.34042"
          y1="12.137"
          x2="63.3101"
          y2="11.6517"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#14E9ED" />
          <stop offset="0.682292" stopColor="#2FC0FE" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_301_103"
          x1="2.34042"
          y1="12.137"
          x2="63.3101"
          y2="11.6517"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#14E9ED" />
          <stop offset="0.682292" stopColor="#2FC0FE" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_301_103"
          x1="49.6607"
          y1="117.143"
          x2="110.63"
          y2="116.657"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.276042" stopColor="#6064FF" />
          <stop offset="0.75" stopColor="#2FC0FE" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_301_103"
          x1="45.4057"
          y1="111.708"
          x2="106.375"
          y2="111.223"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.276042" stopColor="#6064FF" />
          <stop offset="0.75" stopColor="#2FC0FE" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_301_103"
          x1="2.34042"
          y1="12.137"
          x2="63.3101"
          y2="11.6517"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.276042" stopColor="#6064FF" />
          <stop offset="0.739583" stopColor="#9B00FF" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_301_103"
          x1="2.34042"
          y1="12.137"
          x2="63.3101"
          y2="11.6517"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.276042" stopColor="#6064FF" />
          <stop offset="0.739583" stopColor="#9B00FF" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_301_103"
          x1="11.4275"
          y1="117.122"
          x2="72.3971"
          y2="116.637"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.0729167" stopColor="#FF9ABE" />
          <stop offset="0.739583" stopColor="#9B00FF" />
        </linearGradient>
        <linearGradient
          id="paint7_linear_301_103"
          x1="7.17245"
          y1="111.688"
          x2="68.1421"
          y2="111.203"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.0729167" stopColor="#FF9ABE" />
          <stop offset="0.739583" stopColor="#9B00FF" />
        </linearGradient>
        <linearGradient
          id="paint8_linear_301_103"
          x1="52.3"
          y1="18.377"
          x2="79.555"
          y2="46.5585"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF8EA9" />
          <stop offset="0.3125" stopColor="#9C01FF" />
          <stop offset="1" stopColor="#14E9ED" />
        </linearGradient>
        <linearGradient
          id="paint9_linear_301_103"
          x1="48.045"
          y1="12.9425"
          x2="75.3"
          y2="41.1239"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF8EA9" />
          <stop offset="0.3125" stopColor="#9C01FF" />
          <stop offset="1" stopColor="#14E9ED" />
        </linearGradient>
      </defs>
    </svg>
  );
});
LogoIcon.displayName = 'LogoIcon';
