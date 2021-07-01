import { Box, Button, Checkbox, createStyles, FormControlLabel, makeStyles, TextField, Theme } from '@material-ui/core'
import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import DetailContainer from './DetailContainer';


type Inputs = {
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
  close_Pending_Order: boolean,
  close_Market_Order: boolean,
  terminate_strategy: boolean
};

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

export default function Settings() {
  const styles = useStyles();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);
  return (
    <DetailContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <TextField fullWidth label='channel_top' {...register("channel_top")} />
        </Row>
        <Row>
          <TextField fullWidth label='channel_bottom' {...register("channel_bottom")} />
        </Row>
        <Row>
          <TextField fullWidth label='min_distance' {...register("min_distance")} />
        </Row>
        <Row>
          <TextField fullWidth label='lot_size' {...register("lot_size")} />
        </Row>
        <Row>
          <TextField fullWidth label='order_interval' {...register("order_interval")} />
        </Row>
        <Row>
          <TextField fullWidth label='take_profit' {...register("take_profit")} />
        </Row>
        <Row>
          <TextField fullWidth label='stop_loss' {...register("stop_loss")} />
        </Row>
        <Row>
          <TextField fullWidth label='side' {...register("side")} />
        </Row>
        <Row>
          <TextField fullWidth label='strategy_serial' {...register("strategy_serial")} />
        </Row>
        <Row>
          <TextField fullWidth label='trailing_stop_first_step' {...register("trailing_stop_first_step")} />
        </Row>
        <Row>
          <TextField fullWidth label='trailing_stop_first_modification' {...register("trailing_stop_first_modification")} />
        </Row>
        <Row>
          <TextField fullWidth label='trailing_stop_further_step' {...register("trailing_stop_further_step")} />
        </Row>
        <Row>
          <TextField fullWidth label='trailing_stop_further_modification' {...register("trailing_stop_further_modification")} />
        </Row>
        <Row>
          <TextField fullWidth label='pending_order_limit_count' {...register("pending_order_limit_count")} />
        </Row>
        <Row>
          <TextField fullWidth label='maximum_market_order_count' {...register("maximum_market_order_count")} />
        </Row>
        <Row>
          <TextField fullWidth label='order_to_modify' {...register("order_to_modify")} />
        </Row>
        <Row>
          <FormControlLabel
            control={<Checkbox {...register("close_Pending_Order")} />}
            label="close_Pending_Order"
          />
        </Row>
        <Row>
          <FormControlLabel
            control={<Checkbox {...register("close_Market_Order")} />}
            label="close_Market_Order"
          />
        </Row>
        <Row>
          <FormControlLabel
            control={<Checkbox {...register("terminate_strategy")} />}
            label="terminate_strategy"
          />
        </Row>

        <Button type="submit" variant='contained' color='primary'>Save</Button>
      </form>
    </DetailContainer>
  )
}
