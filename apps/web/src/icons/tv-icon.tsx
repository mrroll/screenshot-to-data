import * as React from 'react';

type TElementRef = React.ElementRef<'svg'>;
type TComponentPropsWithoutRef = React.ComponentPropsWithoutRef<'svg'>;

export const TVIcon = React.forwardRef<TElementRef, TComponentPropsWithoutRef>(
  (props, ref) => {
    const { className, ...rest } = props;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="47"
        height="40"
        viewBox="0 0 47 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        ref={ref}
        className={className}
        {...rest}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M29.0668 9.00037L31.799 6.26813C32.7753 5.29182 32.7753 3.70891 31.799 2.7326C30.8227 1.75629 29.2398 1.75629 28.2635 2.7326L23.0312 7.96484L17.799 2.7326C16.8227 1.75629 15.2398 1.75629 14.2635 2.7326C13.2872 3.70891 13.2872 5.29182 14.2635 6.26813L19.799 11.8037C21.2055 13.2102 23.1132 14.0004 25.1023 14.0004H38.5312C39.912 14.0004 41.0312 15.1197 41.0312 16.5004V32.5004C41.0312 33.8811 39.912 35.0004 38.5312 35.0004H7.53125C6.15054 35.0004 5.03125 33.8811 5.03125 32.5004V16.5004C5.03125 15.1197 6.15054 14.0004 7.53125 14.0004H10.0312C12.7927 14.0004 15.0312 11.7618 15.0312 9.00037H7.53125C3.38911 9.00037 0.03125 12.3582 0.03125 16.5004V32.5004C0.03125 36.6425 3.38911 40.0004 7.53125 40.0004H38.5312C42.6734 40.0004 46.0312 36.6425 46.0312 32.5004V16.5004C46.0312 12.3582 42.6734 9.00037 38.5312 9.00037H29.0668Z"
        />
      </svg>
    );
  },
);
TVIcon.displayName = 'TVIcon';
