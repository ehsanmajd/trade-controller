import { Container, createStyles, makeStyles, Theme } from '@material-ui/core'
import React from 'react'
import UserInfo from '../UserInfo';
import Footer from '../Footer'
import Header from '../Header';
import Logo from './Logo'


const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    "@global": {
      body: {
      }
    },
    root: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    },
    headerTop: {
      display: 'flex',
      borderBottomStyle: 'solid',
      borderBottomWidth: '1px',
      borderColor: theme.palette.grey[600]
    },
    pageHeaderMenu: {

    },
    menu: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    main: {
      flex: 1
    }
  })
);

const Layout: React.FC = ({ children }) => {
  const classes = useStyle();

  return (
    <Container className={classes.root} component='div'>
      <header>
        <div className={classes.headerTop}>
          <Logo />
          <div className={classes.menu}><UserInfo /></div>
        </div>
        <div className={classes.pageHeaderMenu}>
          <Header />
        </div>
      </header>
      <main className={classes.main}>
        {children}
      </main>
      <Footer />
    </Container>
  )
}

export default Layout;
