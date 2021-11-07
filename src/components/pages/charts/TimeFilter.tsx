import React from 'react';
import { createStyles, Grid, InputLabel, makeStyles, MenuItem, Select, Theme } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { TimeFilterType } from '../../../types/baskets';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cell: {
      padding: '16px',
      boxSizing: 'border-box'
    },
  }),
);

interface TimeFilterProps {
  filterType: TimeFilterType;
  onFilterTypeChange: (f: TimeFilterType) => void;
  from: Date;
  onFromChange: (d: Date) => void;
  to: Date;
  onToChange: (d: Date) => void;
}

const TimeFilter: React.FC<TimeFilterProps> = (
  { 
    filterType, 
    onFilterTypeChange ,
    from,
    onFromChange,
    to,
    onToChange
  }) => {
  const classes = useStyles();

  const disablePickers = filterType !== TimeFilterType.SpecificDate;

  return (
    <>
      <Grid md={4} spacing={2} className={classes.cell}>
        <>
          <InputLabel id={`label-time-filter`}>Period</InputLabel>
          <Select
            labelId={`label-time-filter`}
            name={'period'}
            fullWidth
            value={filterType}
            onChange={e => onFilterTypeChange(e.target.value as any)}
          >
            <MenuItem value={TimeFilterType.Last24Hours}>Last 24 hours</MenuItem>
            <MenuItem value={TimeFilterType.Last7Days}>Last 7 days</MenuItem>
            <MenuItem value={TimeFilterType.Last30Days}>Last 30 days</MenuItem>
            <MenuItem value={TimeFilterType.SpecificDate}>Sepcific Date</MenuItem>
          </Select>
        </>
      </Grid>
      <Grid md={4} spacing={2} className={classes.cell}>
        <>
          <InputLabel id={`label-from-filter`}>From</InputLabel>
          <DatePicker value={from} onChange={m => onFromChange(m.toDate())} disabled={disablePickers} fullWidth name='label-from-filter' />
        </>
      </Grid>
      <Grid md={4} spacing={2} className={classes.cell}>
        <>
          <InputLabel id={`label-to-filter`}>To</InputLabel>
          <DatePicker value={to} onChange={m => onToChange(m.toDate())} disabled={disablePickers} fullWidth />
        </>
      </Grid>
    </>

  )
}

export default TimeFilter;