import React, { useEffect, useState } from 'react';
import * as OTPAuth from 'otpauth';
import { Box, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import StyledTypography from './StyledTypography';

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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={1} />
      <Grid item xs={5}>
        <Stack>
          <Typography variant="h6" sx={{ textAlign: 'left' }}>
            {otp?.issuer}
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'left' }}>
            {otp.label}
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={4} sx={{ marginTop: '1rem' }}>
        <Box onClick={() => token && handleCopy(token)}>
          <StyledTypography variant="h3">{token}</StyledTypography>
        </Box>
      </Grid>
      <Grid item xs={1} sx={{ marginTop: '0.75rem' }}>
        <CircularProgress variant="determinate" value={(limit / 30) * 100} />
      </Grid>
    </Grid>
  );
}

export default TotpItem;
