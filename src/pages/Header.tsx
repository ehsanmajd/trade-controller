import { createStyles, Grid, makeStyles, Paper, Theme } from '@material-ui/core'
import { FC } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
            cursor: 'pointer'
        },
        selected: {
            fontWeight: 'bold'
        }

    }),
);

const Header: FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();

    const getClassNames = (route) => {
        const paperClasses = [classes.paper];
        if (location.pathname.endsWith(route)) {
            paperClasses.push(classes.selected);
        }
        return paperClasses.join(' ');
    }

    const HeaderPaper = ({ name, path }) => <Paper className={getClassNames(path)} onClick={() => history.push('/' + path)}>{name}</Paper>;

    return <Grid container spacing={1} justify='center'>
        <Grid item xs={3} sm={3}>
            <HeaderPaper path='setting' name='Setting' />
        </Grid>
        <Grid item xs={3} sm={3}>
            <HeaderPaper path='home' name='Basket' />
        </Grid>
        <Grid item xs={3} sm={3}>
            <HeaderPaper path='summary' name='Summary' />
        </Grid>
    </Grid>
}

export default Header;