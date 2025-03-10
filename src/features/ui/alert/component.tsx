import { JSX } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

export function Alert({
  title,
  children,
  style,
  onClose,
}: {
  title?: string;
  children?: JSX.Element;
  style?: React.CSSProperties,
  onClose?: () => void;
}) {
  return (
    <div style={style}>
      <div className="mt-8 flex bg-red-600/10 text-red-500 p-4 rounded-md">
        <div className=".flex-shrink-0">
          <RiCloseCircleLine className='block align-middle w-[24px] h-[24px] text-red-500' />
        </div>
        <div className="ml-3">
          {title ? <h3 className="font-medium text-sm">{title}</h3> : null}
          <div className="pt-2 text-sm">{children}</div>
        </div>
        {onClose ? (
          <button
            className="ml-auto block align-middle w-[24px] h-[24px] text-red-500"
            onClick={onClose}
          >
            <RiCloseCircleLine />
          </button>
        ) : <></>}
      </div>
    </div>
  );
}
