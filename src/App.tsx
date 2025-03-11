import { Component, createResource, createSignal, For } from 'solid-js';
import './App.css';
import qrcodeParser from 'qrcode-parser';
import * as OTPAuth from 'otpauth';
import useFile from './hooks/useFile';
import StyledTextField from './features/ui/StyledTextField';
import TotpItem from './features/ui/TotpItem';
import { Alert } from './features/ui/alert';

const App: Component = () => {
  const [otps, setOtps] = createSignal<string[]>([]);
  const [error, setError] = createSignal<string>();
  const { readTextFile, writeTextFile } = useFile();

  const [contents] = createResource<string>(readTextFile);
  if (!contents.loading && !contents.error) {
    const value = contents();
    if (value) {
      const values = value.split('\n').filter((l: string) => l.length > 0);
      try {
        values?.map((v: string) => {
          OTPAuth.URI.parse(v);
          return;
        });
        if (!otps().includes(value)) {
          setOtps(otps().concat(value));
          return;
        }
      } catch (err) {
        setError(JSON.stringify(err));
        return;
      }
    }
  } else if (contents.error) {
    setError(JSON.stringify(contents.error));
  }

  const handleClose = () => {
    setError(undefined);
  };

  async function handleInput(event: Event & { currentTarget: HTMLInputElement; target: HTMLInputElement }) {
    try {
      setError('');
      const { value } = event.currentTarget ?? { value: undefined };
      if (!value) {
        return;
      }
      const parsed = await qrcodeParser(value);
      const instance = OTPAuth.URI.parse(parsed);
      const stored = otps();
      if (!stored.includes(instance.toString())) {
        setOtps(() => stored.concat(instance.toString()));
        writeTextFile(
          contents.length > 0
            ? `${contents}\n${instance.toString()}`
            : instance.toString(),
        );
      }
    } catch (e: unknown) {
      setError(JSON.stringify(e));
    }
  };

  const genNewOpts = (otp: string): { found: boolean; newOtps: string[] } => {
    const index = otps().findIndex((item) => item === otp);
    if (index >= 0) {
      if (otps().length === 1) {
        return {
          found: true,
          newOtps: [],
        };
      }
      if (index === 0) {
        return {
          found: true,
          newOtps: otps().slice(index + 1),
        };
      }
      return {
        found: true,
        newOtps: otps().slice(0, index).concat(otps().slice(index + 1)),
      };
    }
    return {
      found: false,
      newOtps: otps(),
    };
  };

  const handleDelete = (otp: OTPAuth.HOTP | OTPAuth.TOTP) => {
    const otpStr = otp.toString();
    const { found, newOtps } = genNewOpts(otpStr);
    if (found) {
      const outputContents =
        newOtps.length > 0
          ? newOtps.reduce((acc, cur) => `${acc}\n${cur}`)
          : '';
      writeTextFile(outputContents);
      setOtps(newOtps);
    }
  };

  return (
    <div class="App">
      <div class='flex flex-col'>
        <StyledTextField type="text" name="uri" onChange={handleInput} />
        <For each={otps()}>
          {(otp) => (
            <div class='w-full px-[1.5rem]'>
              <TotpItem
                otp={OTPAuth.URI.parse(otp)}
                onDelete={(o) => handleDelete(o)}
              />
            </div>
          )}
        </For>
      </div>
      <Alert
        onClose={handleClose}
        style={{
          width: 'calc(100% - 1rem)',
          position: 'absolute',
          bottom: '0.5rem',
          left: '0.5rem',
          visibility: error() ? 'visible' : 'hidden',
        }}
      >
        <>{error()}</>
      </Alert>
    </div>
  );
};

export default App;
