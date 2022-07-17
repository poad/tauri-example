import React, { useEffect, useState } from 'react';
import './App.css';
import qrcodeParser from 'qrcode-parser';
import * as OTPAuth from 'otpauth';
import { Alert, Grid } from '@mui/material';
import useFile from './hooks/useFile';
import StyledTextField from './components/StyledTextField';
import TotpItem from './components/TotpItem';

function App() {
  const [otps, setOtps] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const [contents, setContents] = useState('');
  const { readTextFileFromAppDir, writeTextFileToAppDir } = useFile((e) =>
    setError(e)
  );

  useEffect(() => {
    const callback = async () => readTextFileFromAppDir();
    callback().then((value) => {
      if (value) {
        setContents(value);
        const values = value.split('\n').filter((l) => l.length > 0);
        try {
          values.map((v) => {
            return OTPAuth.URI.parse(v);
          });
          if (!otps.includes(value)) {
            setOtps(otps.concat(value));
          }
        } catch (err) {
          setError(JSON.stringify(err));
        }
      }
    });
  }, []);

  const handleClose = () => {
    setError(undefined);
  };

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
          contents.length > 0
            ? `${contents}\n${instance.toString()}`
            : instance.toString()
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
      </Grid>
      <Alert
        onClose={handleClose}
        severity="error"
        sx={{
          width: 'calc(100% - 1rem)',
          position: 'absolute',
          bottom: '0.5rem',
          left: '0.5rem',
          visibility: error ? 'visible' : 'hidden',
        }}
      >
        {error}
      </Alert>
    </div>
  );
}

export default App;
