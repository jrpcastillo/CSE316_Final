import React, { useContext, useEffect, useState } from 'react'
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

// final project imports
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import SortIcon from '@mui/icons-material/Sort';
import { InputBase, Paper, TextField } from '@mui/material';
import AuthContext from '../auth';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton';


const HomeScreen = () => {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleSortMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSortMenuClose = () => {
        setAnchorEl(null);
    };

    // Sorting options for Viewing User's Own Lists
    const handleSortName = () => {
        setAnchorEl(null);
        // sorting method for name
    }
    const handleSortCreationDate = () => {
        setAnchorEl(null);
        // sorting method for creation date
    }
    const handleSortEditDate = () => {
        setAnchorEl(null);
        // sorting method for last edit date
    }

    // keybinds for undo/redo if needed
    // document.onkeydown = store.handleAppKeyDown;
    // document.onkeyup = store.handleAppKeyUp;

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }

    // Creating List Cards
    let listCard = "";
    if (store) {
        console.log('refreshed');
        console.log(store);
        listCard = 
            <List sx={{ width: '100%', alignItems: 'center' }}>
            {
                store.idNamePairs.map((pair) => (
                    <Grid item xs={12} sx={{ ml: 1, mb: 1 }}>
                        <ListCard
                            key={pair._id}
                            idNamePair={pair}
                            selected={false}
                        />
                    </Grid>
                ))
            }
            </List>;
    }

    // Checking for Modals
    let modalJSX = "";
    if (store.listMarkedForDeletion) {
        modalJSX = <MUIDeleteModal />;
    }

    // Using the appropriate Sorting Menu
    let menuId = 'guest-account-menu'; // default, when not logged in
    let menu = <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    id={menuId}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={isMenuOpen}
                    onClose={handleSortMenuClose}
                    disableScrollLock={true}
                >
                    <MenuItem onClick={handleSortName}>By Name (A-Z)</MenuItem>
                    <MenuItem onClick={handleSortCreationDate}>By Creation Date (Old-New)</MenuItem>
                    <MenuItem onClick={handleSortEditDate}>By Last Edit Date (New-Old)</MenuItem>
                </Menu>
    if (auth.loggedIn) {
        menuId = 'logged-account-menu';
    }

    // checks if other buttons should be disabled during foolproof
    const foolProofStatus = false;
    

    return (
        // <Box sx={{...style}}>
        //     <Box sx={{
        //                 height: '15%',
        //             }}
        //     >

        //                 <Typography variant="h2" align='center'>Your Lists</Typography>
        //     </Box>
        //     <Box sx={{
        //                 height: '85%',
        //                 bgcolor: 'background.paper'
        //             }}
        //     >
        //         {
        //             listCard
        //         }
        //     </Box>
        //     { modalJSX }
        // </Box>
        <Box sx ={{
                    height: '80%', maxHeight: '80%'
        }}>
            <Grid container columnSpacing={2} sx={{ mt:1, height: '7%' }}>
                <Grid item xs={3}>
                    <Grid container spacing={2} justifyContent="flex-start" alignItems="center">
                        {/* home icon */}
                        <Grid item sx={{ ml: 1 }}>
                            <HomeIcon></HomeIcon>
                        </Grid>
                        <Grid item>
                            <GroupsIcon></GroupsIcon>
                        </Grid>
                        <Grid item>
                            <PersonIcon></PersonIcon>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    {/* search bar */}
                    <Paper component="form" sx={{  }}>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search"
                            inputProps={{ 'aria-label': 'search playlists'}}
                        >

                        </InputBase>
                    </Paper>
                </Grid>
                <Grid item xs={3}>
                    <Grid container spacing={2} justifyContent="flex-end" alignItems="center">
                        {/* 'SORT BY' text */}
                        <Grid item>
                            SORT BY
                        </Grid>
                        <Grid item sx={{ mr: 1 }}>
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="Sort Own Playlists"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                disabled={foolProofStatus}
                                onClick={handleSortMenuOpen}
                            >
                                <SortIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            { menu }
            <Grid container sx={{ height: '93%' }}>
                <Grid item xs={7.2} sx={{ overflowY: 'auto', height: '100%'}}>
                    <Grid container>
                        {/* <Grid item xs={12}>
                            listCard
                        </Grid> */}
                        { listCard }
                    </Grid>
                </Grid>
                <Grid item xs={4.8}>
                    <Grid container sx={{ height: '100%'}}>
                        test
                    </Grid>
                </Grid>
            </Grid>
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