import { createStyles, Grid, makeStyles, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Theme } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useBasketsContext } from '../../../context/BasketsContext';
import { getExpertName } from '../../../utils/expert';
import * as services from '../../../service';
import IconButton from '@material-ui/core/IconButton';
import Back from '@material-ui/icons/ArrowBack';
import Forward from '@material-ui/icons/ArrowForward';

type LogDetail = { name: string, value: unknown }[];

interface LogModel {
  id: string;
  type: string;
  userId: string;
  username: string;
  ipAddress: string;
  date: Date;
  description: {
    old: LogDetail,
    new: LogDetail
  };
  entityId: string;
}

const visualize = (records: LogDetail) => {
  return records
    .reduce((acc, item) => {
      return `${acc}<br />${item.name}: ${item.value}`
    }, '');
}

const compareAndVisualize = (old: LogDetail, current: LogDetail) => {
  return current
    .reduce((acc, item) => {
      const oldValue = old.find(x => x.name === item.name)?.value;
      const changed = (
        () => {
          if (oldValue?.toString() === '0' && item.value === 'false') {
            return false;
          }
          if (oldValue?.toString() === '1' && item.value === 'true') {
            return false;
          }
          return oldValue !== item.value
        }
      )();
      if (!changed) {
        return `${acc}<br />${item.name}: ${item.value}`
      }
      else {
        return `${acc}<br /><span style='color:red'>${item.name}: <b>${item.value}</b></span>`
      }
    }, '');
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selector: {
      flexGrow: 1,
      paddingTop: '48px',
      borderBottomStyle: 'solid',
      borderBottomWidth: '1px',
      borderColor: theme.palette.grey[500],
      paddingBottom: '48px'
    },
    chevron: {
      fontSize: '14px'
    }
  }),
);

const Index: React.FC = () => {
  const classes = useStyles();
  const { data, hasError, refresh } = useBasketsContext();
  const [selectedBasket, setSelectedBasket] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogModel[]>([]);

  const baskets = data?.baskets || [];
  const basket = baskets.find(x => x.basketId === selectedBasket);
  const index = baskets.findIndex(x => x.basketId === selectedBasket);

  const handleBasketChange = (_, value) => {
    setSelectedBasket(value?.basketId);
  }

  function navigate(mode: 'back' | 'forward') {
    setSelectedBasket(mode === 'back' ?
      baskets[index - 1].basketId :
      baskets[index + 1].basketId
    );
  }

  const backDisabled = index <= 0;
  const nextDisabled = (index === -1 && !basket) || index === baskets.length - 1;


  const categorizeLogs = () => {
    const ids = [];
    logs.forEach(log => {
      const [, fileId] = log.entityId.split('____');
      if (ids.indexOf(fileId) === -1) {
        ids.push(fileId);
      }
    });

    return ids.map((id) => {
      return {
        id,
        records: logs.filter(log => log.entityId.split('____')[1] === id)
      }
    });
  }


  useEffect(
    () => {
      (
        async () => {
          if (selectedBasket) {
            const logs = await services.getBasketLogs(selectedBasket);
            setLogs(logs);
          }
        }
      )();
    },
    [selectedBasket]
  )

  useEffect(
    () => {
      if (!selectedBasket && baskets && baskets.length) {
        setSelectedBasket(baskets?.[0]?.basketId);
      }
    },
    // eslint-disable-next-line 
    [baskets]
  );

  useEffect(
    () => {
      if (data.baskets.length === 0) {
        refresh();
      }
    },
    []
  );

  return (
    <Paper>
      <Grid container justify='center' className={classes.selector}>
        <Grid md={6} xs={6} container justify='center'>
          <Autocomplete
            disabled={hasError}
            value={basket || { name: '' }}
            id="combo-box-demo"
            options={baskets}
            getOptionLabel={basket => basket.name}
            style={{ flex: '1', maxWidth: '300px' }}
            onChange={handleBasketChange}
            renderInput={(params) => <TextField {...params} label="Select your basket" variant="outlined" />}
          />
        </Grid>
        <Grid md={6} xs={6} container justify='space-evenly'>
          <Grid md={6} xs={6}>
            <IconButton
              disabled={backDisabled}
              onClick={() => navigate('back')}
            >
              <span className={classes.chevron}>Back</span>&nbsp;
              <Back color={backDisabled ? 'disabled' : 'primary'} />
            </IconButton>
          </Grid>
          <Grid md={6} xs={6}>
            <IconButton
              onClick={() => navigate('forward')}
              disabled={nextDisabled}>
              <Forward color={nextDisabled ? 'disabled' : 'primary'} />&nbsp;
              <span className={classes.chevron}>Next</span>
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      {
        categorizeLogs().map(expert => {
          const expertName = (
            () => {
              const item = basket?.parameters.find(x => x.id === expert.id);
              if (item) {
                return getExpertName(item.params)
              }
              return expert.id;
            }
          )()
          return (
            <>
              <h2>{expertName}</h2>
              <Table>
                <TableHead>
                  <TableCell>Index</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Old</TableCell>
                  <TableCell>New</TableCell>
                </TableHead>
                <TableBody>
                  {expert.records.map((log, index) => {
                    return (
                      <TableRow key={log.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{new Date(log.date).toLocaleString()}</TableCell>
                        <TableCell>{log.username}</TableCell>
                        <TableCell>{log.ipAddress}</TableCell>
                        <TableCell>
                          {log.description.old && <div dangerouslySetInnerHTML={{ __html: visualize(log.description.old) }}></div>}
                        </TableCell>
                        <TableCell>
                          {log.description.new && log.description.old && <div dangerouslySetInnerHTML={{ __html: compareAndVisualize(log.description.old, log.description.new) }}></div>}
                          {log.description.new && !log.description.old && <div dangerouslySetInnerHTML={{ __html: visualize(log.description.new) }}></div>}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {expert.records.length === 0 && <TableCell>No logs found.</TableCell>}
                </TableBody>
              </Table>
            </>
          )
        })
      }
    </Paper>
  )
}

export default Index;