import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'
// additional
import { useHistory } from 'react-router-dom'
import Box from '@mui/material/Box';
//add
import AuthContext from '../auth'
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    store.history = useHistory();

    const style = {
        height: '12%',
        display: 'flex',
        alignItems: 'center',
        justifyContent:'center',
        mt: -1
    }

    function handleCreateNewList() {
        store.createNewList();
    }

    let text ="";
    if (store.currentList)
        text = store.currentList.name;
    
    if (window.location.pathname == "/login/" || window.location.pathname == "/register/")
        return <Box sx={{height: '12%', color: 'black'}}></Box>;
    let cardStatus = false;
    if (store.listNameActive) {
        cardStatus = true;
    }

    else if (store.currentList == null) {
        if (auth.loggedIn) {
            return (
                <Box sx={{...style}}>
                    <Fab 
                        color="primary" 
                        size="small"
                        aria-label="add"
                        id="add-list-button"
                        disabled={cardStatus}
                        onClick={handleCreateNewList}
                    >
                        <AddIcon />
                    </Fab>
                </Box>
            )
        }
    }
    return (
        (auth.loggedIn)
            ? <Box sx={{...style}}>
                    <Typography variant="h4"
                                align="center"
                    >
                        {text}
                    </Typography>
                </Box>
            : <Box sx={{...style}}></Box>
    );
}


export default Statusbar;