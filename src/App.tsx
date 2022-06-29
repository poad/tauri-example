import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import qrcodeParser from 'qrcode-parser';
import * as OTPAuth from 'otpauth';
import TextField from '@mui/material/TextField';
import { CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { createStyles, withStyles } from '@mui/styles';
import {
  writeFile,
  Dir,
  readDir,
  createDir,
  readTextFile,
} from '@tauri-apps/api/fs';
import { appDir } from '@tauri-apps/api/path';

const StyledTypography = withStyles(() =>
  createStyles({
    root: {
      height: '1.75rem',
      display: 'flex',
      flexDirection: 'column',
      verticalAlign: 'middle',
      justifyContent: 'center',
    },
  })
)(Typography);

const StyledTextField = withStyles(() =>
  createStyles({
    root: {
      width: 'calc(100% - 3rem)',
      '& .MuiInputBase-input': {
        padding: '0.5rem',
      },
    },
  })
)(TextField);

const useFile = () => {
  const [appDirPath, setAppDirPath] = useState('');
  const loadAppDirPath = useCallback(
    async () => setAppDirPath(await appDir()),
    []
  );

  loadAppDirPath();

  const readTextFileFromAppDir = async (file: string) => {
    return readTextFile(`${appDirPath}/${file}`);
  };

  const writeTextFileToAppDir = async (file: string, contents: string) => {
    try {
      await readDir(appDirPath);
    } catch (err) {
      await createDir(appDirPath, { recursive: true });
    }
    await writeFile(
      {
        path: `${appDirPath}/${file}`,
        contents,
      },
      {
        dir: Dir.App,
      }
    );
  };

  return {
    appDirPath,
    readTextFileFromAppDir,
    writeTextFileToAppDir,
  };
};

function TotpItem({ otp }: { otp: OTPAuth.HOTP | OTPAuth.TOTP }) {
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

  return (
    <Grid container spacing={2}>
      <Grid item xs={3} />
      <Grid item xs={6}>
        <Stack>
          <Typography variant="h6" sx={{ textAlign: 'left' }}>
            {otp?.issuer}
          </Typography>
          <Typography variant="h6" sx={{ textAlign: 'left' }}>
            {otp.label}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={3} />

      <Grid item xs={1} />
      <Grid item xs={6}>
        <StyledTypography variant="h3">{token}</StyledTypography>
      </Grid>
      <Grid item xs={2}>
        <CircularProgress variant="determinate" value={(limit / 30) * 100} />
      </Grid>
      <Grid item xs={3} />
    </Grid>
  );
}

function App() {
  const [otps, setOtps] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [contents, setContents] = useState('');
  const { appDirPath, readTextFileFromAppDir, writeTextFileToAppDir } =
    useFile();

  useEffect(() => {
    const callback = async () =>
      appDirPath ? readTextFileFromAppDir('totp.txt') : undefined;
    callback().then((value) => {
      if (value) {
        setContents(value);
        value.split('\n').map((v) => OTPAuth.URI.parse(v));
        if (!otps.includes(value)) {
          setOtps(otps.concat(value));
        }
      }
    });
  }, [appDirPath]);

  const handleInput = async (event: React.FormEvent<HTMLInputElement>) => {
    try {
      setError('');
      const { value } = event.currentTarget;
      if (!value) {
        return;
      }
      const parsed = await qrcodeParser(value);
      const instance = OTPAuth.URI.parse(parsed);
      if (!otps.includes(instance.toString())) {
        setOtps(otps.concat(instance.toString()));
        writeTextFileToAppDir(
          'totp.txt',
          `${contents}\n${instance.toString()}`
        );
      }
    } catch (e: unknown) {
      setError(JSON.stringify(e));
    }
  };

  return (
    <div className="App">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <StyledTextField type="text" name="uri" onChange={handleInput} />
        </Grid>
        {otps.map((otp) => (
          <Grid key={otp} item xs={12}>
            <TotpItem key={otp} otp={OTPAuth.URI.parse(otp)} />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Typography variant="body2">{error}</Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
