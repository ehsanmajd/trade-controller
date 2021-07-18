import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import * as service from '../service'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      listStyle: 'none',
      // padding: theme.spacing(0.5),
      margin: 0,
    },
    chip: {
      margin: theme.spacing(0.5),
    },
  }),
);

type Value = { key: string; label: string };

interface Props {
  datasource?: (k: string) => Promise<Value[]>;
  value: Value[];
  onChange?: (v: Value[]) => void;
  addDisabled?: boolean;
}

export default function ChipsArray({ datasource, value, onChange = () => undefined, addDisabled = false }: Props) {
  const classes = useStyles();
  const [mode, setMode] = React.useState<'view' | 'edit'>('view');
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [users, setUsers] = React.useState([]);
  // const [chipData, setChipData] = React.useState<ChipData[]>([
  //   { key: 0, label: 'Angular' },
  //   { key: 1, label: 'jQuery' },
  //   { key: 2, label: 'Polymer' },
  //   { key: 3, label: 'React' },
  //   { key: 4, label: 'Vue.js' },
  // ]);

  const handleDelete = (chipToDelete: Value) => () => {
    onChange(value.filter((chip) => chip.key !== chipToDelete.key));
  };

  const gotoEditMode = () => {
    !addDisabled && setMode('edit');
  }

  React.useEffect(
    () => {
      (async () => {
        setLoading(true);
        const users = await datasource(inputValue)
        
        setUsers(users);
        setLoading(false);
      })();
    },
    [inputValue]
  );

  return (
    <Paper component="ul" className={classes.root} onClick={gotoEditMode}>
      {value.map((data) => {
        return (
          <li key={data.key}>
            <Chip
              label={data.label}
              onDelete={handleDelete(data)}
              className={classes.chip}
              size='small'
            />
          </li>
        );
      })}
      {(mode === 'edit' || value.length === 0) && <Autocomplete<Value>
        options={users}
        getOptionLabel={option => option.label}
        filterOptions={x => x}
        autoComplete
        loading={loading}
        inputValue={inputValue}
        includeInputInList
        onChange={(event, newValue: Value) => onChange([...value, newValue])}
        renderInput={params => (
          <TextField
            {...params}
            label="Search for users"
            variant="outlined"
            onChange={event => setInputValue(event.target.value)}
            fullWidth
          />
        )}
        renderOption={option => {
          return <div>{option.label}</div>;
        }}
      />}
    </Paper>
  );
}
