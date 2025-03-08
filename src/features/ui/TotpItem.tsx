import { useEffect, useState } from 'react';
import * as OTPAuth from 'otpauth';
import {
  CircularProgress,
} from './circular-progress';
import { MdDelete } from 'react-icons/md';


type DeleteHandler = (otp: OTPAuth.HOTP | OTPAuth.TOTP) => void;

function TotpItem({
  otp,
  onDelete,
}: {
  otp: OTPAuth.HOTP | OTPAuth.TOTP;
  onDelete: DeleteHandler;
}) {
  const [token, setToken] = useState<string | undefined>();
  const [now, setNow] = useState<Date | undefined>();
  const [validate, setValidate] = useState<boolean>(false);
  const [limit, setLimit] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
      if (limit === 1 || !validate) {
        if (otp) {
          const currentToken = otp.generate();
          setToken(currentToken);
          const delta = otp.validate({
            token: currentToken,
            window: 1,
          });
          setValidate(delta != null && delta >= 0);
        }
      }
      if (otp) {
        setLimit(() => (limit > 1 ? limit - 1 : 30));
      }
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [now, limit, token, otp, validate]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDelete = (o: OTPAuth.HOTP | OTPAuth.TOTP) => {
    onDelete(o);
  };

  return (
    <div className='flex flex-row px-1'>
      <div className='w-[40vw]'>
        <div className='flex flex-col width-[45vw]'>
          <h6 className='text-left'>
            {otp?.issuer}
          </h6>
          <p className='text-left'>
            {otp.label}
          </p>
        </div>
      </div>

      <div className='w-[40vw] mt-[1rem]'>
        <button onClick={() => token && handleCopy(token)}>
          <h3 className='h-[1.75rem] flex flex-col align-middle justify-center text-[3rem]'>
            {token}
          </h3>
        </button>
      </div>

      <div className='w-[10vw] my-auto'>
        <CircularProgress value={(limit / 30) * 100} />
      </div>
      <div className='w-2'>
        <button
          color="error"
          className='p-0 w-[10vw] my-auto'
          onClick={() => handleDelete(otp)}
        >
          <MdDelete size='3rem' />
        </button>
      </div>
    </div>
  );
}

export default TotpItem;
