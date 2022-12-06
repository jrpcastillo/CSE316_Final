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
import { useFormControl } from '@mui/material/FormControl';



const HomeScreen = () => {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [text, setText] = useState("");
    const isMenuOpen = Boolean(anchorEl);
    const [viewMode, setViewMode] = useState(0);

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

    const handleSortPublishDate = () => {
        setAnchorEl(null);
    }

    const handleSortListens = () => {
        setAnchorEl(null);
    }

    const handleSortLikes = () => {
        setAnchorEl(null);
    }

    const handleSortDislikes = () => {
        setAnchorEl(null);
    }

    const handleViewOwnLists = () => {
        setViewMode(0);
        store.loadIdNamePairs();
    }

    const handleViewAllLists = () => {
        setViewMode(1);
        store.getPublicPlaylists();
    }

    const handleViewUserLists = () => {
        setViewMode(2);
        store.clearIdNamePairs();
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(text);
        if (text === "") {
            store.clearIdNamePairs();
        }
        else if (viewMode == 0) {
            store.getOwnMatchingPlaylists(text);
        }
        else if (viewMode == 1) {
            store.getMatchingPlaylists(text);
        }
        else {
            store.getOtherPlaylists(text);
        }
    }

    // keybinds for undo/redo if needed
    // document.onkeydown = store.handleAppKeyDown;
    // document.onkeyup = store.handleAppKeyUp;

    useEffect(() => {
        console.log("passed useEffect")
        if (auth.loggedIn) {
            setViewMode(0);
            store.loadIdNamePairs();
        } else {
            setViewMode(1);
            store.getPublicPlaylists();
        }   
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

    // Using the proper account circle
    let menuId = 'guest-account-view';
    if (auth.loggedIn) {
        menuId = 'logged-account-view';
    }

    // Using the appropriate Sorting Menu
    let menu = <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
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
    if (viewMode != 0) {
        menu = <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
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
                    <MenuItem onClick={handleSortPublishDate}>Publish Date (Newest)</MenuItem>
                    <MenuItem onClick={handleSortListens}>Listens (High-Low)</MenuItem>
                    <MenuItem onClick={handleSortLikes}>Likes (High-Low)</MenuItem>
                    <MenuItem onClick={handleSortDislikes}>Dislikes (High-Low)</MenuItem>
                </Menu>;
    }

    // checks if other buttons should be disabled during foolproof
    const foolProofStatus = false;

    // searchbar
    useFormControl(()=> {

    })
    

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
                            <IconButton
                                id='home-view'
                                disabled={foolProofStatus}
                                onClick={handleViewOwnLists}
                                sx={(viewMode == 0) ? { border: 2, borderColor: 'primary' } : {}}
                            >
                                <HomeIcon />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton
                                id='all-view'
                                disabled={foolProofStatus}
                                onClick={handleViewAllLists}
                                sx={(viewMode == 1) ? { border: 2, borderColor: 'primary' } : {}}
                            >
                                <GroupsIcon />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton
                                id='user-view'
                                disabled={foolProofStatus}
                                onClick={handleViewUserLists}
                                sx={(viewMode == 2) ? { border: 2, borderColor: 'primary' } : {}}
                            >
                                <PersonIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    {/* search bar */}
                    <Paper component="form" sx={{  }} onSubmit={handleSubmit}>
                        <InputBase
                            sx={{ ml: 1, width: '95%', overflowX: 'hidden' }}
                            placeholder="Search"
                            inputProps={{ 'aria-label': 'search playlists'}}
                            onChange={e => setText(e.target.value)}
                        />  
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