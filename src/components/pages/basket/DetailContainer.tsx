import { Box, createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { CSSProperties } from 'react'


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      minHeight: 400,
      backgroundColor: theme.palette.grey[50],
      border: 'solid 1px #ccc',
      borderRadius: 5,
      padding: 16,
      boxSizing: 'border-box',
    },
  }),
);

const DetailContainer: React.FC<{ style?: CSSProperties, className?: string }> = ({ children, style, className }) => {
  const classes = useStyles();
  return (
    <Box style={style} className={`${classes.root} ${className ?? ''}`}>{children}</Box>
  )
}

export default DetailContainer
