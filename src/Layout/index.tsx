import { Container, createStyles, makeStyles, Theme } from '@material-ui/core'
import React, { FC } from 'react'
import UserInfo from '../components/UserInfo';
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

    }
  })
);

const Layout: React.FC<{ ExtraHeader?: FC }> = ({ children, ExtraHeader = () => null }) => {
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
