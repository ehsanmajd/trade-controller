import { createStyles, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    row: {
      marginTop: 4,
      marginBottom: 4,
      padding: 2,
      boxSizing: 'border-box'
    },
  }),
);

const Row: React.FC = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.row}>{children}</div>
}

export default Row;