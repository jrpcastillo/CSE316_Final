import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'

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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import YoutubePlaylisterReact from './YoutubePlaylisterReact';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ListItem from '@mui/material/ListItem';

const HomeScreen = () => {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [text, setText] = useState("");
    const [comment, setComment] = useState("");
    const [value, setValue] = useState(0);
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
        store.sortByName(store.idNamePairs);
        // sorting method for name
    }
    const handleSortCreationDate = () => {
        setAnchorEl(null);
        store.sortByCreationDate(store.idNamePairs);
        // sorting method for creation date
    }
    const handleSortEditDate = () => {
        setAnchorEl(null);
        store.sortByEditDate(store.idNamePairs);
        // sorting method for last edit date
    }

    const handleSortPublishDate = () => {
        setAnchorEl(null);
        store.sortByPublishDate(store.idNamePairs);
    }

    const handleSortListens = () => {
        setAnchorEl(null);
        store.sortByListens(store.idNamePairs);
    }

    const handleSortLikes = () => {
        setAnchorEl(null);
        store.sortByLikes(store.idNamePairs);
    }

    const handleSortDislikes = () => {
        setAnchorEl(null);
        store.sortByDislikes(store.idNamePairs);
    }

    // looks at current sort option:

    const handleViewOwnLists = () => {
        setText("");
        store.searchBy = null;
        store.currentList = null;
        store.loadIdNamePairs();
    }

    const handleViewAllLists = () => {
        setText("");
        store.searchBy = null;
        store.currentList = null;
        store.getPublicPlaylists();
    }

    const handleViewUserLists = () => {
        setText("");
        store.searchBy = null;
        store.currentList = null;
        store.clearIdNamePairs();
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(text);
        if (text === "") {
            store.currentList = null;
            store.clearIdNamePairs();
        }
        else if (store.viewMode == 0) {
            store.currentList = null;
            store.getOwnMatchingPlaylists(text);
        }
        else if (store.viewMode == 1) {
            store.currentList = null;
            store.getMatchingPlaylists(text);
        }
        else {
            store.currentList = null;
            store.getOtherPlaylists(text);
        }
    }

    // tabs

    function TabPanel(props) {
        const { children, value, index, ...other } = props;
      
        return (
          <Box
            hidden={value !== index}
            sx={{ height: '93%' }}
          >
            {value === index && (
              <Box sx={{ height: '100%' }}>
                {children}
              </Box>
            )}
          </Box>
        );
      }
      
      TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
      };
      
      function a11yProps(index) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
      }
      

    const handleTabChange = (event, newValue) => {
        event.stopPropagation();
        setValue(newValue);
    }

    // comments

    const handleComment = (event) => {
        event.preventDefault();
        console.log(comment);
        if (comment !== "") {
            store.addComment(store.currentList._id, auth.user.username, comment);
            setComment("");
        }        
    }

    // keybinds for undo/redo if needed
    // document.onkeydown = store.handleAppKeyDown;
    // document.onkeyup = store.handleAppKeyUp;

    useEffect(() => {
        console.log("passed useEffect")
        if (auth.loggedIn && auth.user != null) {
            store.loadIdNamePairs();
        } else {
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
            <Grid item xs={12}>
                <List sx={{ maxWidth: '100%', alignItems: 'center', pl: 1, pr: 1}}>
                {
                    store.idNamePairs.map((pair) => (
                            <ListCard
                                key={pair._id}
                                idNamePair={pair}
                                selected={false}
                            />
                    ))
                }
                </List>
            </Grid>
    }

    // Checking for Modals
    let modalJSX;
    if (store.currentModal == "NONE") {
        modalJSX = "";
    } else if (store.currentModal == "DELETE_LIST") {
        modalJSX = <MUIDeleteModal />;
    } else if (store.currentModal == "EDIT_SONG") {
        modalJSX = <MUIEditSongModal />;
    } else if (store.currentModal == "REMOVE_SONG") {
        modalJSX = <MUIRemoveSongModal />;
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
                    disabled={store.listNameActive}
                    onClose={handleSortMenuClose}
                    disableScrollLock={true}
                >
                    <MenuItem onClick={handleSortName}>By Name (A-Z)</MenuItem>
                    <MenuItem onClick={handleSortCreationDate}>By Creation Date (Old-New)</MenuItem>
                    <MenuItem onClick={handleSortEditDate}>By Last Edit Date (New-Old)</MenuItem>
                    <MenuItem onClick={handleSortPublishDate}>By Publish Date (Newest)</MenuItem>
                    <MenuItem onClick={handleSortListens}>By Listens (High-Low)</MenuItem>
                    <MenuItem onClick={handleSortLikes}>By Likes (High-Low)</MenuItem>
                    <MenuItem onClick={handleSortDislikes}>By Dislikes (High-Low)</MenuItem>
                </Menu>

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
                                disabled={store.listNameActive || auth.user == null}
                                onClick={handleViewOwnLists}
                                sx={(store.viewMode == 0) ? { border: 2, borderColor: 'primary' } : {}}
                            >
                                <HomeIcon />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton
                                id='all-view'
                                disabled={store.listNameActive}
                                onClick={handleViewAllLists}
                                sx={(store.viewMode == 1) ? { border: 2, borderColor: 'primary' } : {}}
                            >
                                <GroupsIcon />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton
                                id='user-view'
                                disabled={store.listNameActive}
                                onClick={handleViewUserLists}
                                sx={(store.viewMode == 2) ? { border: 2, borderColor: 'primary' } : {}}
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
                            key="search"
                            autoFocus
                            value={text}
                            inputProps={{ 'aria-label': 'search playlists'}}
                            onChange={e => setText(e.target.value)}
                        />  
                    </Paper>
                </Grid>
                <Grid item xs={3}>
                    <Grid container spacing={2} justifyContent="flex-end" alignItems="center">
                        {/* 'SORT BY' text */}
                        <Grid item>
                            <Typography>
                                SORT BY
                            </Typography>
                        </Grid>
                        <Grid item sx={{ mr: 1 }}>
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="Sort Own Playlists"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                disabled={store.listNameActive}
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
                <Grid item xs={7} sx={{ overflowY: 'auto', height: '100%', border: 2, mt: 1 }}>
                    <Grid container>
                        {/* <Grid item xs={12}>
                            listCard
                        </Grid> */}
                        { listCard }
                    </Grid>
                </Grid>
                <Grid item xs={5} sx={{ maxWidth: '100%', height: '100%', border: 2, mt: 1 }}>
                    <Box sx={{ width: '100%', height: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example">
                                <Tab label="Player" {...a11yProps(0)} />
                                <Tab label="Comments" {...a11yProps(1)} />
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                            <YoutubePlaylisterReact />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Grid container sx={{ height: '100%' }}>
                                <Grid item container xs={12} sx={{ height: '80%' }}>
                                    <List sx={{ width: '100%', height: '100%', alignItems: 'flex-start', pl: 1, pr: 1, overflowY: 'auto' }}>
                                        {
                                            (store.currentList != null)
                                            ?
                                                store.currentList.comments.map((pair) => (
                                                    <ListItem
                                                        sx={{ marginTop: '15px', display: 'flex', p: 1, border: 0 , borderColor: '#', borderRadius: 2, bgcolor: '#82C4E4', width: '100%' }}
                                                        style={{ wordWrap: 'break-text' }}
                                                        >
                                                        <Grid container sx={{ width: '100%' }}>
                                                            <Grid item container justifyContent='flex-start' alignItems='flex-start' xs={12}>
                                                                <Typography fontSize={12} style={{ whiteSpace: 'nowrap', fontSize: 12, mr: 1,  overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                { pair.author +":" }
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item container justifyContent='flex-start' alignItems='flex-start' xs={12} sx={{ width: '100%' }}>
                                                                <Typography fontSize={20} sx={{ width: '100%' }} style={{ wordWrap: 'break-word', fontSize: 20, mr: 1, whiteSpace: 'normal' }}>
                                                                    { pair.text }
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </ListItem>
                                                ))
                                            : ""
                                        }
                                        </List>
                                </Grid>
                                <Grid item container justifyContent='center' alignItems='center' xs={12} sx={{ height: '20%' }}>
                                    { (store.currentList != null)
                                    ? <Paper component="form" sx={{ height: '60%', width: '90%' }} onSubmit={handleComment}>
                                        <InputBase
                                            sx={{ ml: 1, width: '95%', overflowX: 'hidden' }}
                                            placeholder="Comment"
                                            key="comment"
                                            value={comment}
                                            inputProps={{ 'aria-label': 'add comments'}}
                                            onChange={e => setComment(e.target.value)}
                                            autoFocus
                                        />  
                                    </Paper>
                                    : ""
                                    }
                                </Grid>
                            </Grid>
                        </TabPanel>
                    </Box>
                </Grid>
            </Grid>
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