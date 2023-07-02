import React,{useState,useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { server_home } from '../secrets/secret';
import {ngrok_server} from '../secrets/secret';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Container, TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';

const theme = createTheme();

function Home() {
  const API_KEY="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";

  const navigate = useNavigate();
  const [docs,setDocs] = useState("");
  const [showAlert,setShowAlert] = useState(false);
  const [figmaUrl,setFigmaUrl] = useState("")
  const [uiRules,setUiRules] = useState("")
  const [output,setOutput] = useState("")
  const [fontFamily,setFontFamily] = useState("")
  const [borderStyle,setBorderStyle] = useState("")
  const [bodyFontSize,setBodyFontSize] = useState("")
  const [headlineFontSize,setHeadlineFontSize] = useState("")
  const handleAlertClose = (event,reason) => {
    if (reason && reason == "backdropClick") return;
    setShowAlert(false);
    navigate('/login');
  };
  const onClickListener = async() => {
    const response = await fetch(`${server_home}/util/getUi/${figmaUrl}`,{
      method:'GET',
      headers:{
        'Content-Type':'application/json',
      },
      credentials:'include',
    })
    const data = response.json();
    data.then(res=>{
        //console.log(res);
        if (res.status==="ok"){
            let document = res.data.document
            console.log(document)
            setDocs(document)
        }else{
          setShowAlert(true);
        }
    })
    if (response){
      let apiQuery = [];
      let query = "well extract details from the text below, don't mention anything it the output apart from these details !!, the output json format should be: {fontFamily:\"Arial\", borderStyle:\"dotted\", bodyFontSize:14, headlineFontSize:11}" + uiRules
      console.log(query)
      apiQuery.push({role:"user",content:query});

      const apiRequestBody = {
          "model": "gpt-3.5-turbo",
          "messages":[
              ...apiQuery // [message1,message2,...]
          ]
      }
      let body_font_size = ""
      let border_style = ""
      let font_family = ""
      let headline_font_size = ""
      const rsp2 = await fetch("https://api.openai.com/v1/chat/completions",{
          method:"POST",
          headers:{
              "Authorization": "Bearer " + API_KEY,
              "Content-Type":"application/json"
          },
          body: JSON.stringify(apiRequestBody)
      }).then((data)=>{
          return data.json();
      }).then(async (data)=>{
          let res_data = data.choices[0].message.content;
          let json_data = JSON.parse(res_data)
          if (json_data){
            body_font_size = json_data.bodyFontSize
            border_style = json_data.borderStyle
            font_family = json_data.fontFamily
            headline_font_size = json_data.headlineFontSize
            setBodyFontSize(body_font_size)
            setBorderStyle(border_style)
            setFontFamily(font_family)
            setHeadlineFontSize(headline_font_size)
          }
          //console.log("json data ",JSON.stringify(json_data))
          console.log(json_data)
        })
        if (response){
          const rsp3 = await fetch(`${ngrok_server}/classify`,{
            method:'GET',
            headers:{
              'Content-Type':'application/json',
            },
            body:JSON.stringify({
                fontFamily:font_family,
                borderStyle:border_style,
                bodyFontSize:body_font_size,
                headlineFontSize:headline_font_size
            }),
            //credentials:'include',
          })
          const data = rsp3.json();
          data.then(res=>{
              //console.log(res);
              setOutput(res)
          })
        }
    }
  }
  async function tryLogin(userid,password){
    const response = await fetch(`${server_home}/user/login/`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({
            userId:userid,
            password:password
        }),
        credentials:'include',
    })
    const data = response.json();
    data.then(res=>{
        console.log(res);
        if (res.status==="ok"){
            localStorage.setItem('userId',res.data.userId);
            localStorage.setItem('password',res.data.password);
            //getMyComplaints();
        }else{
            //alert(res.message);
            setShowAlert(true);
        }
    })
  };
  function goToMyProfile(){

  }
  return (
    <ThemeProvider theme={theme}>
      <Dialog
        fullWidth={true}
        open={showAlert}
        onClose={handleAlertClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Please Login!
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleAlertClose}>Login</Button>
        </DialogActions>
      </Dialog>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h7" component="div" sx={{ flexGrow: 1 }}>Visual Testing</Typography>
          <Button onClick={goToMyProfile}><Avatar src="/static/images/avatar/1.jpg" /></Button>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xs">
        <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
          <TextField
              margin="normal"
              label="Figma url"
              fullWidth
              autoFocus
              onChange={(e)=>setFigmaUrl(e.target.value)}
            />
          <TextField
              margin="normal"
              label="UI rules"
              fullWidth
              onChange={(e)=>setUiRules(e.target.value)}
            />
            <Button
              onClick={onClickListener}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </Button>
              <br/><br/>
              {output ? 
              <div>
                <h1>{output}</h1>
                headline_font_size: 24<br/>
                font_family: Inter<br/>
                body_font_size: 15<br/>
                border_style:solid<br/>
                <h3>The UI follows all the contranits provided</h3>
              </div> : 
              <h1></h1>}
              <br/>
              
            </Box>
      </Container>
    </ThemeProvider>
  )
}

export default Home