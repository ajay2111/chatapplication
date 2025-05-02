import React, { useState, useEffect , useRef } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import CardHeader from '@mui/material/CardHeader';
import { makeStyles } from '@mui/styles'; 
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Typography from '@mui/material/Typography';



const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    
  },
  
  root: {
    maxWidth: 345,
  },
}));

function App(props) {
  const [filledForm, setFilledForm] = useState(false);
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState('');
  const [name, setName] = useState('');
  const [room, setRoom] = useState('test');
  const clientRef = useRef(null);

  const onButtonClicked = (event) => {
    event.preventDefault();
    if (value.trim() !== "") {
      clientRef.current.send(
        JSON.stringify({
          type: 'message',
          text: value,
          sender: name,
        })
      );
      setValue('');
    }
  };
  
  const classes = useStyles();


  useEffect(() => {
    clientRef.current = new W3CWebSocket(`ws://127.0.0.1:8000/ws/${room}/`);

    clientRef.current.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    clientRef.current.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      if (dataFromServer) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            msg: dataFromServer.text,
            name: dataFromServer.sender,
          },
        ]);
      }
    };

    return () => {
      clientRef.current.close();
    };
  }, [room]);

  const handleRoomChange = (e) => {
    setRoom(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleValueChange = (e) => {
    setValue(e.target.value);
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFilledForm(true);
  };


  return (
    <div style={{ 
      backgroundImage: "url(https://wallpaperaccess.com/full/384342.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundColor: "violet",
      width: "800px",
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }}>
      {filledForm ? (
        <div>
          <div style={{fontSize:"25px", fontWeight:"bold",color:"white", display:"flex",justifyContent:"center"}}>
          Room : {room}</div>
          <Paper
  style={{
    height: "300px",
    maxHeight: "500px",
    overflow: "auto",
    backgroundColor: "transparent",
    boxShadow: "none",
  }}
>
  {messages.map((message) => (
    <div key={message.name + message.msg} style={{ display: "flex", justifyContent: "left",   }}>
      <div style={{ color: "rgba(255, 255, 255, 0.8)", backgroundColor: "transparent" , borderRadius: "10px", maxWidth: "80%" }}>
      <CardHeader
  title={<Typography variant="subtitle1" style={{ color: "grey" ,fontWeight:"bold", fontSize:"15px"}}>{message.name}</Typography>}
  subheader={<Typography variant="body1" style={{ color: "#fff", fontSize:"25px" }}>{message.msg}</Typography>}
/>      </div>
    </div>
  ))}
</Paper>

          <form
            className={classes.form}
            noValidate
            onSubmit={onButtonClicked}
          >
            <TextField 
              id="outlined-helperText" 
              label="Write text" 
              defaultValue="Default Value"
              variant="outlined"
              value={value}
              fullWidth color="secondary"
              style={{color:"white",}}
              onChange={handleValueChange}
              InputProps={{ disableUnderline: true }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
               
               style={{margin :"20px" ,color:"white", width :"50px"  }}
            >
              Send
            </Button>
          </form>
        </div>
      ) : (
        <div className={classes.paper}>
          <CssBaseline />
          <h1 style={{color:"white",}}>Welcome to the chat app!</h1>
          <form className={classes.form} noValidate onSubmit={handleFormSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoFocus style={{color:"white",}}
              value={name}
              onChange={handleNameChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required style={{color:"white",}}
              fullWidth
              name="room"
              label="Room"
              type="text"
              id="room"
              value={room}
              onChange={handleRoomChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              style={{color:"white",}}
            >
              Join Room
            </Button>
          </form>
        </div>
      )}
    </div>
    
  )
};
export default   App;
