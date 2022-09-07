import React, { FC, useState } from 'react'
import { useUserContext } from '../../../context/UserContext';
import { useHistory } from 'react-router-dom';
import { Avatar, Button, Container, Switch, makeStyles, Grid, FormGroup, FormControlLabel } from '@material-ui/core';
import { toggleReceiveErrorByEmail } from '../../../service';
import EmailIcon from '@material-ui/icons/Email';
import { AccountCircleOutlined } from '@material-ui/icons';




const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'column',
    boxSizing: 'border-box',
    margin: '40px',
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid silver',
    fontFamily: 'Helvetica',
    height: '900px',

  },


  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    height: 'auto',
    width: 'auto',

  },

  avatarSvg: {
    fontSize: '60px'
  },

  command: {
    marginLeft: '5px',
    marginRight: '5px'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  containerAvatar: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    margin: '20px',
    boxSizing: 'border-box',
  },

  containerLabels: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    padding: '20px',
    boxSizing: 'border-box',
  },


  labelEmail: {
    padding: '20px',
    boxSizing: 'border-box',
  },

  labelName: {
    padding: '20px',
    boxSizing: 'border-box',
  }

}));





const Profile: FC = () => {
  const { data: user } = useUserContext();
  const history = useHistory();
  const classes = useStyles();
  const [receivedErrorsByEmail, setReceivedErrorsByEmail] = useState<boolean>(false)



  const handleCancel = () => {

    history.push('/dashboard/home');
  }

  const handleReceivedErrorsByEmail = () => {
    setReceivedErrorsByEmail(!receivedErrorsByEmail)

  }

  const handleSave = async () => {
    const model = {
      userId: user.userId,
      receivedErrorsByEmail: receivedErrorsByEmail,
    }

    console.log(model);



    await toggleReceiveErrorByEmail(model);
    console.log('Done!');
  };

  return (

    <Container maxWidth='sm' className={classes.container}>

      <Avatar className={classes.avatar}>
        <AccountCircleOutlined className={classes.avatarSvg} />
      </Avatar>

      <div className={classes.containerLabels}>

        <div className={classes.labelName}>
          <label>{user.name}</label>
        </div>

        <div className={classes.labelEmail}>
          <label>{/*will be filled later*/}</label>
        </div>

      </div>

      <div className={classes.containerAvatar}>
        <FormGroup>
          <FormControlLabel
            labelPlacement="start"
            checked={receivedErrorsByEmail}
            onChange={handleReceivedErrorsByEmail}
            label="Received errors by email"
            control={<Switch defaultChecked color='primary' />}
          />
        </FormGroup>
      </div>

      <Grid container>
        <Grid item xs className={classes.command}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSave}
          >
            Save
          </Button>
        </Grid>
        <Grid item xs className={classes.command}>
          <Button
            fullWidth
            variant="outlined"
            className={classes.submit}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>

    </Container >
  )
}

export default Profile
