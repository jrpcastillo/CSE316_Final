import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
//add
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    document.onkeydown = store.handleAppKeyDown;
    document.onkeyup = store.handleAppKeyUp;

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }
    let listCard = "";
    if (store) {
        console.log('refreshed');
        console.log(store);
        listCard = 
            <List sx={{ width: '100%' , bgcolor: 'background.paper', alignItems: 'center' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>;
    }

    const style = {
        height: '80%',
        overflow: 'auto',
        width: '100%',
        mt: 2
    }

    let modalJSX = "";
    if (store.listMarkedForDeletion) {
        modalJSX = <MUIDeleteModal />;
    }

    return (
        <Box sx={{...style}}>
            <Box sx={{
                        height: '15%',
                    }}
            >

                        <Typography variant="h2" align='center'>Your Lists</Typography>
            </Box>
            <Box sx={{
                        height: '85%',
                        bgcolor: 'background.paper'
                    }}
            >
                {
                    listCard
                }
            </Box>
            { modalJSX }
        </Box>
    
        /*
        <div id="playlist-selector">
            <div id="list-selector-heading">
            <Fab 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
            >
                <AddIcon />
            </Fab>
                <Typography variant="h2">Your Lists</Typography>
            </div>
            <div id="list-selector-list">
                {
                    listCard
                }
                <MUIDeleteModal />
            </div>
        </div>
        */
        
        )
}

export default HomeScreen;