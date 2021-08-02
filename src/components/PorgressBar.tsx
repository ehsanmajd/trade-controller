import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    segment: {
      lineHeight: '24px',
      borderTopLeftRadius: '8px',
      borderBottomLeftRadius: '8px',
      backgroundColor: '#db7392',
      textAlign: 'center',
      fontWeight: 'bolder',
      '&:last-child': {
        backgroundColor: '#10F1FF',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: '8px',
        borderBottomRightRadius: '8px',
      }
    },

  }),
);

interface Props {
  left: number;
  right: number;
}

const ProgressBar: React.FC<Props> = ({ left, right }) => {
  const leftFlex = Math.floor(((left * 100) / (left + right)));
  const rightFlex = 100 - leftFlex;
  const classes = useStyles();
  return (
    <Grid container>
      <div title={left.toFixed(2)} className={classes.segment} style={{ width: `${leftFlex}%` }}><label>{left.toFixed(2)}</label></div>
      <div title={right.toFixed(2)} className={classes.segment} style={{ width: `${rightFlex}%` }}><label>{right.toFixed(2)}</label></div>
    </Grid>
  )
}

export default ProgressBar;