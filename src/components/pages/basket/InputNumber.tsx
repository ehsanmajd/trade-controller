import React from 'react'
import TextField from '@material-ui/core/TextField'

export default React.forwardRef<any, any>((props, ref) => {
  const handleChange = (e) => {
    console.log('====================================');
    console.log(e.target.value);
    console.log('====================================');
    if (props.onChange) {
      props.onChange(e);
    }
  }

  return (
    <TextField {...props} onChange={handleChange} ref={ref} />
  )

})