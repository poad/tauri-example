import TextField from '@mui/material/TextField';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';

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

export default StyledTextField;
