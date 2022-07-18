import Typography from '@mui/material/Typography';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';

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

export default StyledTypography;
