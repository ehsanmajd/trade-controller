import { makeStyles, Theme } from '@material-ui/core/styles';
import BasketList from './BasketList';
import SharedBaskets from './SharedBaskets'

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    minWidth: 650,
  },
  root: {
    marginTop: theme.spacing(10)
  }
}));



const EMPTY_FORM_VALUES = {
  address: '',
  users: []
}

export default function Index() {


  return (
    <>
      <BasketList />
      <hr />
      <hr />
      <SharedBaskets />
    </>
  );
}
