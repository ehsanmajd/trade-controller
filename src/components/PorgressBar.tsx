import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({    
    wrapper: {
      width: 'auto',
      flexGrow: 1,
      marginLeft: '2px',
      marginRight: '2px'
    },
    segment: {
      lineHeight: '24px',
      borderTopLeftRadius: '8px',
      borderBottomLeftRadius: '8px',
      textAlign: 'center',
      fontWeight: 'bolder',
      '&:last-child': {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: '8px',
        borderBottomRightRadius: '8px',
      }
    },
    label: {
      lineHeight: '24px'
    }
  }),
);

interface Props {
  leftColor: string;
  left: number;
  rightColor: string;
  right: number;
  hideRight?: boolean;
}

const ProgressBar: React.FC<Props> = ({ left, right, hideRight, leftColor, rightColor }) => {
  const leftFlex = Math.floor(((left * 100) / (left + right)));
  const rightFlex = 100 - leftFlex;
  const classes = useStyles();
  return (
    <Grid container>
      <label className={classes.label}>{left.toFixed(2)}</label> 
      <Grid container className={classes.wrapper}>
        <div title={left.toFixed(2)} className={classes.segment} style={{ flex: `${leftFlex}`, backgroundColor: leftColor }}> </div>
        <div title={right.toFixed(2)} className={classes.segment} style={{ flex: `${rightFlex}`, backgroundColor: rightColor }}> </div>
      </Grid>
      {!hideRight && <label className={classes.label}>{right.toFixed(2)}</label>}
    </Grid>
  )
}

export default ProgressBar;