import { Box, Container, createStyles, makeStyles, Theme } from '@material-ui/core'
import React from 'react'
import Footer from '../Footer'
import Header from '../Header'

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    "@global": {
      body: {
        backgroundImage: 'url("/images/background.jpg")'
      }
    },
    root: {
    }
  })
);

const Layout: React.FC = ({ children }) => {
  const classes = useStyle();
  return (
    <Container m={1} className={classes.root}>
      <Header />
      {children}
      <Footer />
    </Container>
  )
}

export default Layout;
