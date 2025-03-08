import * as OTPAuth from 'otpauth';
import {
  CircularProgress,
} from './circular-progress';
import { AiFillDelete } from 'solid-icons/ai';
import { createSignal, onCleanup, Show } from 'solid-js';


type DeleteHandler = (otp: OTPAuth.HOTP | OTPAuth.TOTP) => void;

function TotpItem({
  otp,
  onDelete,
}: {
  otp: OTPAuth.HOTP | OTPAuth.TOTP;
  onDelete: DeleteHandler;
}) {
  const [token, setToken] = createSignal<string | undefined>();
  const [validate, setValidate] = createSignal<boolean>(false);
  const [limit, setLimit] = createSignal(1);

  const currentToken = otp.generate();
  setToken(() => currentToken);
  const delta = otp.validate({
    token: currentToken,
    window: 1,
  });
  setValidate(() => delta != null && delta >= 0);

  const intervalId = setInterval(() => {
    if (limit() === 1 || !validate) {
      const currentToken = otp.generate();
      setToken(() => currentToken);
      const delta = otp.validate({
        token: currentToken,
        window: 1,
      });
      setValidate(() => delta != null && delta >= 0);
    }
    if (otp) {
      setLimit(() => (limit() > 1 ? limit() - 1 : 30));
    }
  }, 1000);
  onCleanup(() => {
    clearInterval(intervalId);
  });

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
  };

  function handleDelete(o: OTPAuth.HOTP | OTPAuth.TOTP) {
    onDelete(o);
  };

  return (
    <div class='flex flex-row px-1 pt-4'>
      <div class='w-[12rem]'>
        <div class='flex flex-col width-[45vw]'>
          <h6 class='text-left'>
            {otp?.issuer}
          </h6>
          <p class='text-left'>
            {otp.label}
          </p>
        </div>
      </div>

      <Show when={token()}>
        <div class='w-[13rem] mt-[0.75rem]'>
          <button onClick={() => handleCopy(token() ?? '')}>
            <h3 class='h-[1.75rem] flex flex-col align-middle justify-center text-[3rem]'>
              {token()}
            </h3>
          </button>
        </div>

        <div class='w-[10vw] my-auto'>
          <CircularProgress value={(limit() / 30) * 100} />
        </div>
      </Show>
      <div class='w-2'>
        <button
          color="error"
          class='p-0 w-[10vw] my-auto'
          onClick={() => handleDelete(otp)}
        >
          <AiFillDelete size='3rem' />
        </button>
      </div>
    </div >
  );
}

export default TotpItem;
