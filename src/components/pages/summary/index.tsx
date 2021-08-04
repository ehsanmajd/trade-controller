import BasketInfo from '../basket/BasketInfo';
import { useBasketsContext } from '../../../context/BasketsContext';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { useEffect } from 'react';

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
      {baskets.map(basket => {
        return (
          <div key={basket.name} className={classes.baskets}>
            <h2>Basket: {basket.name}</h2>
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
