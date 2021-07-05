import { Container, createStyles, makeStyles, Theme } from '@material-ui/core'
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

const Layout: React.FC<{ header?: () => JSX.Element }> = ({ children, header = () => null }) => {
  const classes = useStyle();
  return (
    <Container className={classes.root} component='div'>
      <Header>
        {header()}
      </Header>
      {children}
      <Footer />
    </Container>
  )
}

export default Layout;
