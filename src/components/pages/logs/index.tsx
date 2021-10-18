import { Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useBasketsContext } from '../../../context/BasketsContext';
import { getExpertName } from '../../../utils/expert';
import * as services from '../../../service';

interface LogModel {
  id: string;
  type: string;
  userId: string;
  username: string;
  ipAddress: string;
  date: Date;
  description: {
    old: { name: string, value: unknown }[],
    new: { name: string, value: unknown }[]
  };
  entityId: string;
}

const visualize = (records: { name: string, value: unknown }[]) => {
  return records
    .reduce((acc, item) => {
      return `${acc}<br />${item.name}: ${item.value}`
    }, '');
}

const Index: React.FC = () => {
  const { data, refresh } = useBasketsContext();
  const [selectedBasket, setSelectedBasket] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogModel[]>([]);

  const baskets = data?.baskets || [];
  const basket = baskets.find(x => x.basketId === selectedBasket);

  const handleBasketChange = (_, value) => {
    setSelectedBasket(value?.basketId);
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
      if (!data) {
        refresh();
      }
    },
    []
  );

  return (
    <Paper>
      <Grid container>
        <Autocomplete
          value={basket || { name: '' }}
          id="combo-box-demo"
          options={baskets}
          getOptionLabel={basket => basket.name}
          style={{ flex: '1', maxWidth: '300px' }}
          onChange={handleBasketChange}
          renderInput={(params) => <TextField {...params} label="Select your basket" variant="outlined" />}
        />
      </Grid>
      {
        basket?.parameters.map(expert => {
          const expertLogs = logs.filter(x => x.entityId.split('____')[1] === expert.id);
          return (
            <>
              <h2>{getExpertName(expert.params)}</h2>
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
                  {expertLogs.map((log, index) => {
                    return (
                      <TableRow key={log.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{new Date(log.date).toTimeString()}</TableCell>
                        <TableCell>{log.username}</TableCell>
                        <TableCell>{log.ipAddress}</TableCell>
                        <TableCell>
                          <div dangerouslySetInnerHTML={{ __html: visualize(log.description.old) }}></div>
                        </TableCell>
                        <TableCell>
                          <div dangerouslySetInnerHTML={{ __html: visualize(log.description.new) }}></div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {expertLogs.length === 0 && <TableCell>No logs found.</TableCell>}
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