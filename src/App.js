import {useEffect, useState} from 'react'
import axios from 'axios'
// import './App.css';
import Box from '@mui/material/Box';
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Input from '@mui/material/Input';
import { Button, Modal, Paper } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currItem, setCurrItem] = useState({});
  const [updatedItem, setUpdatedItem] = useState({});
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [newItem, setNewItem] = useState({text: ''});

  const BASE_API_URL = 'https://todo-mern-app-demo.herokuapp.com';

  const addItem = () => {
    if(newItem.text !== ''){
      axios.post(`${BASE_API_URL}/post/create`, {text: newItem.text})
        .then(() => fetchTODO())
        setNewItem({text: ''});
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
  }

  const fetchTODO = async() => {
    await axios.get(`${BASE_API_URL}/posts`)
      .then(res => setData(res.data))
  }
    
  useEffect(() => {
    fetchTODO();
  }, []);  

  const handleEdit = (item) => {
    setCurrItem(item);
    setIsModalOpen(true);
  }

  const handleDelete = async(itemId) => {
    await axios.delete(`${BASE_API_URL}/post/${itemId}`)
      .then(() => fetchTODO())
  }

  const handleToggleStatus = (item) => {
      axios.put(`${BASE_API_URL}/post/${item._id}`, {...item, complete: !item.complete})
        .then(() => fetchTODO());
        // setCurrItem({});
        setUpdatedItem({});
  }

  const handleUpdate = () => {
    if(updatedItem.text){
      axios.put(`${BASE_API_URL}/post/${currItem._id}`, {...currItem, text: updatedItem.text})
        .then(() => fetchTODO());
        setIsToastOpen(true);
      }
      handleModalClose();
      // setCurrItem({});
      setUpdatedItem({});
  }

  const handleEnterKey = (e) => {
    if(newItem.text !== '' && e.key === 'Enter'){
      addItem();
    }
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  
  return (
    <div className="App">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              TODO App
            </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <Box m={10}>
          <Paper elevation={3} sx={{padding: '10px'}}>
            <Input
              placeholder='Add new task'
              onChange={(e) => setNewItem({text: e.target.value})}
              value={newItem.text}
              onKeyDown={(e) => handleEnterKey(e)}
            />
            {newItem.text !== '' && 
            <Button onClick={addItem}>Add</Button>
            }
            <List>
            {data.map((item, i) => (
              <>
                <div style={{display: 'flex'}}>
                  <ListItem disablePadding>
                    <ListItemText primary={item.text} />
                    {
                      item.complete ?
                      <Chip label="Completed" color="warning" />
                      : <Chip label="Not completed" color="success" />
                    }
                    <Button onClick={() => handleToggleStatus(item)}>Toggle status</Button>
                    <Button onClick={() => handleEdit(item)}><EditIcon/></Button>
                    <Button onClick={() => handleDelete(item._id)}><DeleteIcon color="error"/></Button>
                  </ListItem>
                </div>
                <Divider component="li" />
              </>
            ))}
            </List>
          </Paper>
        </Box>
        {isModalOpen &&
          <Modal open={isModalOpen} onClose={handleModalClose}>
            <Box sx={style}>
              <Input
                defaultValue={currItem.text}
                onChange={(e) => setUpdatedItem({...currItem, text: e.target.value})}
              />
              <Button onClick={handleUpdate}>Update</Button>
            </Box>
          </Modal>
        }
        <Snackbar
          autoHideDuration={6000}
          open={isToastOpen}
          onClose={() => setIsToastOpen(false)}
          message="Item updated"
          onClick={() => setIsToastOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
        />
    </div>
  );
}

export default App;
