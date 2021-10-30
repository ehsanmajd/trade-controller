import BasketInfo from '../basket/BasketInfo';
import { useBasketsContext } from '../../../context/BasketsContext';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { useEffect } from 'react';
import { useUserContext } from '../../../context/UserContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {

    },
    baskets: {
      border: 'solid 1px #ccc',
      borderRadius: '8px',
      margin: '24px 0',
      padding: '16px',
      boxSizing: 'border-box',
      '&:nth-of-type(odd)': {
        backgroundColor: '#f8f8f8'
      }
    },
    info: {

    },
    line: {

    }
  }),
);

export default function Summary() {
  const classes = useStyles();
  const { data, refresh } = useBasketsContext();
  const { data: userData } = useUserContext();
  const { baskets, refreshTime } = data;

  useEffect(
    () => {
      if (!refreshTime) {
        refresh();
      }
    },
    // eslint-disable-next-line 
    [refreshTime]
  )

  return (
    <div>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <a target='_blank' href={`${process.env.REACT_APP_BACKEND_URL}/baskets/export?uid=` + userData.userId}>Export</a>
      </div>
      {baskets.map(basket => {
        return (
          <div key={basket.name} className={classes.baskets}>
            <h2>Basket: {basket.name} ({basket.parameters.length})</h2>
            <hr />
            <div>
              <BasketInfo data={basket.info} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
