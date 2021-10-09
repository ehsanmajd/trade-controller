import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      listStyle: 'none',
      // padding: theme.spacing(0.5),
      marginLeft: '3px',
      marginRight: '3px',
      padding: 0
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
  const [users, setUsers] = React.useState([]);

  const handleDelete = (chipToDelete: Value) => () => {
    onChange(value.filter((chip) => chip.key !== chipToDelete.key));
  };

  const gotoEditMode = () => {
    !addDisabled && setMode('edit');
  }


  function handleChange(_, newValue: Value) {
    if (newValue) {
      if (!value.some(x => x.key === newValue.key)) {
        onChange([...value, newValue]);
      }
    }
  }

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
        includeInputInList
        onChange={handleChange}
        onInputChange={async (event: object, value: string, reason: string) => {
          if (reason === 'input') {
            const users = await datasource(value);
            setUsers(users);
          }
        }}
        renderInput={params => (
          <TextField
            {...params}
            label=""
            variant="outlined"
            fullWidth
            size='small'
          />
        )}
        renderOption={option => {
          return <div>{option.label}</div>;
        }}
      />}
    </Paper>
  );
}
