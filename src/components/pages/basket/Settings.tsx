import React, { useState } from 'react'
import { createStyles, makeStyles, Theme, MenuItem, Select } from '@material-ui/core';
import { Button, InputLabel } from '@material-ui/core'
import Row from '../../Row';
import { useForm, Controller } from "react-hook-form";
import DetailContainer from './DetailContainer';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import InputNumber from './InputNumber';
import TextField from '@material-ui/core/TextField';
import { useEffect } from 'react';
import { SAMPLE, VALUES } from './settingMock'
import EditIcon from '@material-ui/icons/Edit'
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import { IconButton } from '@material-ui/core'


type InputTypes = 'string' | 'number' | 'boolean';

export interface Input {
  component: 'Textbox' | 'Dropdown' | 'Checkbox' | 'Label';
  type: InputTypes;
  name: string;
  label?: string;
  attributes?: any;
}

type Mode = 'view' | 'edit';
interface SettingsProps {
  structure?: Input[];
  value?: object;
  title: string;
  onSubmit: (data: Record<string, unknown>) => void;
  disabled?: boolean;
  readonly: boolean;
  updating: boolean;
  onModeChange: (m: Mode) => void;
  mode: Mode;
}

const Components = {
  'Label': (props) => <TextField {...props} InputProps={{ readOnly: true }} />,
  'Textbox': React.forwardRef((props, ref) => <InputNumber {...props} ref={ref as any} />),
  'Checkbox': (props) => {
    return <><InputLabel id={`label-${props.name}`}>{props.label}</InputLabel>
      <Select
        labelId={`label-${props.name}`}
        name={props.name}
        fullWidth
        {...props}
      >
        <MenuItem value={1}>True</MenuItem>
        <MenuItem value={0}>False</MenuItem>
      </Select>
    </>
  },
  'Dropdown': (props) => <><InputLabel id={`label-${props.name}`}>{props.label}</InputLabel>
    <Select
      labelId={`label-${props.name}`}
      {...props}
    >
      {props.datasource.map(item => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
    </Select>
  </>
}
export type Inputs = {
  channel_top: number,
  channel_bottom: number,
  min_distance: number,
  lot_size: number,
  order_interval: number,
  take_profit: number,
  stop_loss: number,
  side: number,
  strategy_serial: number,
  trailing_stop_first_step: number,
  trailing_stop_first_modification: number,
  trailing_stop_further_step: number,
  trailing_stop_further_modification: number,
  pending_order_limit_count: number,
  maximum_market_order_count: number,
  order_to_modify: number,
  close_Pending_Order: number,
  close_Market_Order: number,
  terminate_strategy: number
};


const MESSAGES = {
  int: 'Enter an Integer number',
  positive: 'Only positive numbers allowed'
}

const typeMap = {
  int: yup.number().integer(MESSAGES['int']).min(0, MESSAGES['positive']).required(),
  double: yup.number().min(0, MESSAGES['positive']).required(),
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
        header: {
            fontSize:'20px',
            display:'flex',
            lineHeight: '48px',
            marginTop: '0px',
            '& > span':{
              marginLeft:'auto'
            }
        },
        commands:{
          '& > button':{
            marginRight:'4px'
          }
        }
    })
);

export default function Settings({
  structure = SAMPLE,
  readonly,
  title,
  value = VALUES,
  onSubmit,
  disabled = false,
  updating,
  onModeChange,
  mode
}: SettingsProps) {
  const shape = structure.reduce((acc, item) => {
    const validation = typeMap[item.type];
    if (!validation) {
      return acc;
    }
    return {
      ...acc,
      [item.name]: typeMap[item.type]
    }
  }, {});
  const schema = yup.object().shape(shape);
  const { handleSubmit, control, register, reset } = useForm<Inputs>({
    defaultValues: value,
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    shouldUseNativeValidation: false,
    shouldFocusError: true,
    mode: 'onChange'
  });
  const [pausing,setPausing] = useState(false);

  const classes = useStyles();

  const preventUpdate = mode === 'edit';
  const paused = value['paused'];

  useEffect(
    () => {
      if (!preventUpdate) {
        reset(value);
      }
    },
    // eslint-disable-next-line 
    [value]
  );

  useEffect(()=>{
    setPausing(false);
  },[paused]);

  const backgroundColor = (
    () => {
      if (updating) {
        return '#ccc'
      }
      if (mode === 'edit') {
        return '#FFAA00';
      }
    }
  )();

  const hasPauseCommand = structure.some(c=> c.name === 'paused');

  const showCommands = !readonly && mode === 'edit';

  const handlePlayPauseClick=()=>{
    setPausing(true);
    onSubmit({
      ...value,
      paused:!paused
    });
  }

  return (
    <DetailContainer
      style={{ backgroundColor }}
      className='expert'
    >
      <h2 className={classes.header}>
        {title}
        {!readonly && <span>
          {hasPauseCommand && mode !== 'edit' && <>
            {pausing && <IconButton><CircularProgress color='secondary' size={24} /></IconButton>}
            {!pausing &&  <IconButton onClick={handlePlayPauseClick} title={paused ? "Restart" : "Stop"} >
              {!paused && <PauseCircleOutlineIcon color='secondary' />}
              {!!paused && <PlayCircleOutlineIcon color='secondary' />}
            </IconButton>}
          </>}
          <IconButton 
            onClick={() => onModeChange('edit')}
          >
            <EditIcon color='secondary' />
          </IconButton>
        </span>}
      </h2>
      {updating && <h3>Updating ...</h3>}
      <form onSubmit={handleSubmit(onSubmit)}>
        {
          structure.filter(x => !['symbol','paused'].includes(x.name)).map(s => {
            return <Row key={s.name}>{
              <Controller
                // @ts-ignore
                name={s.name}
                control={control}
                render={({ field, fieldState }) => {
                  return React.createElement(Components[s.component], {
                    fullWidth: true,
                    label: s.label ?? s.name,
                    ...(s.attributes || {}),
                    ...field,
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message,
                    inputProps:{
                      readOnly: mode === 'view' || readonly, 
                    }
                  })
                }}
                // @ts-ignore
                {...register(s.name)}
              />
            }</Row>
          })
        }
        {showCommands && <div className={classes.commands}> 
          <Button disabled={disabled} type="submit" variant='contained' color='primary'>Save</Button>
          <Button disabled={disabled} variant='contained' color='secondary' onClick={() => onModeChange('view')}>Cancel</Button>
        </div>}
      </form>
    </DetailContainer>
  )
}
