import React, { useEffect, useState } from 'react';
import * as OTPAuth from 'otpauth';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import StyledTypography from './StyledTypography';

// eslint-disable-next-line no-unused-vars
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
    <Grid container spacing={1}>
      <Grid item xs={2}>
        <Button
          variant="contained"
          color="error"
          sx={{
            padding: 'none',
            width: '3rem',
          }}
        >
          <DeleteIcon
            fontSize="large"
            sx={{
              minWidth: '2.5rem',
              width: '2.5rem',
              height: '3rem',
            }}
            onClick={() => handleDelete(otp)}
          />
        </Button>
      </Grid>
      <Grid item xs={4.5}>
        <Stack sx={{ width: '45vw' }}>
          <Typography variant="h6" sx={{ textAlign: 'left' }}>
            {otp?.issuer}
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'left' }}>
            {otp.label}
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={3.5} sx={{ marginTop: '1rem' }}>
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
