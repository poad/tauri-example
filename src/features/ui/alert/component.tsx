
import { RiSystemCloseCircleLine } from 'solid-icons/ri';
import { Show } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

export function Alert({
  title,
  children,
  style,
  onClose,
}: {
  title?: string;
  children?: JSX.Element;
  style?: JSX.CSSProperties,
  onClose?: () => void;
}) {
  return (
    <div style={style}>
      <div class="mt-8 flex bg-red-600/10 text-red-500 p-4 rounded-md">
        <div class=".flex-shrink-0">
          <RiSystemCloseCircleLine class='block align-middle w-[24px] h-[24px] text-red-500' />
        </div>
        <div class="ml-3">
          {title ? <h3 class="font-medium text-sm">{title}</h3> : null}
          <div class="pt-2 text-sm">{children}</div>
        </div>
        <Show when={onClose}>
          <button
            class="ml-auto block align-middle w-[24px] h-[24px] text-red-500"
            onClick={onClose}
          >
            <RiSystemCloseCircleLine />
          </button>
        </Show>
      </div>
    </div>
  );
}
