import { makeStyles, TableCell, TableRow, Theme, createStyles } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
        red:{
            color:'red',
            fontWeight:'bold'
        },
        blue:{
            color:'blue',
            fontWeight:'bold'
        },
        rightBold:{
          fontWeight:'bold',
          textAlign:'right'
        }
    })
);

export default function SumRow({label,amount}){
  const classes = useStyles();

  const getAmountClass=(amount:number)=>{
    return amount > 0 ? classes.blue : (amount < 0 ? classes.red : null)
  }

  return <TableRow key={'sum'}>
    <TableCell component="th" scope="row"></TableCell>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell colSpan={3} className={classes.rightBold}>{label}</TableCell>
    <TableCell className={getAmountClass(amount)} >{amount.toFixed(2)}</TableCell>
  </TableRow>
}