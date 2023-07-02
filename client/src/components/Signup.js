import React,{useState,useEffect} from 'react'
import { useNavigate,Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { server_home } from '../secrets/secret';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const theme = createTheme();
const hostel_list = ["Kedar","Badri","Rudra","Neelkanth","Alaknanda"];

function StudentSignup() {
  const [name,setName] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  
  const [showAlert,setShowAlert] = useState(false);
  const [alertMessage,setAlertMessage] = useState('');

  const navigate = useNavigate();

  async function handleSubmit(event){
    event.preventDefault();
    const response = await fetch(`${server_home}/user/signup`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify({
        userId:name,
        password:password,
        confirmPassword:confirmPassword
      })
    });
    const data = response.json();
    data.then(res=>{
      console.log(res);
      if (res.status==="ok"){
        navigate('/login');
      }else{
          let message = res.message;
          let idx = message.lastIndexOf(':');
          if (idx!=-1)message = message.substr(idx+2);
          setAlertMessage(message);
          setShowAlert(true);
      }
    })
  }

  
  return (
    <ThemeProvider theme={theme}>
      <Collapse in={showAlert}>
        <Alert 
          action={
              <IconButton
                  size="small" color="inherit"
                  onClick={() => {
                      setShowAlert(false);
                  }}
              >
                  <CloseIcon fontSize="inherit" />
              </IconButton>
          }
          severity="error">
          {alertMessage}
        </Alert>
      </Collapse>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
          }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                        onChange={(e)=>setName(e.target.value)}
                        required
                        fullWidth
                        label="User ID"
                        autoFocus
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                        onChange={(e)=>setPassword(e.target.value)}
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                        required
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                <Grid item>
                    <Link to="/login">
                        Already have an account? Log in
                    </Link>
                </Grid>
                </Grid>
            </Box>
          </Box>
          <br/><br/><br/><br/><br/><br/><br/>
      </Container>
    </ThemeProvider>
  )
}

export default StudentSignup