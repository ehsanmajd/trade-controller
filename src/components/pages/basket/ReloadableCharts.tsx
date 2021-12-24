import * as React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import { ReloadableChart } from '../../../types/baskets';


interface ReloadableChartsProps{
    reloadableCharts:ReloadableChart[];
    onReload:(chartId:string)=>void;
}

export default function ReloadableCharts({reloadableCharts,onReload}:ReloadableChartsProps){

    const [reloading,setReloading] = React.useState(false);

    const handleReloadClick=(chartId:string)=>{
        setReloading(true);
        onReload(chartId);
    }

    if (reloadableCharts && reloadableCharts.length > 0) {
        return null;
    }

    return <>
        {reloadableCharts.map(item=> (<Alert 
            severity="warning" 
            action={<Button color="inherit" size="small" disabled={reloading} onClick={()=>handleReloadClick(item.chartId)} >
            RELOAD
          </Button>}>
        <AlertTitle>Expert Removed!</AlertTitle>
        An expert with strategy serial <strong>{item.strategy_serial}</strong> on <strong>{item.symbol}</strong> recently has been removed from the chart. — <strong>Whould you like to Reload it?</strong>
      </Alert>))}
      </>
}