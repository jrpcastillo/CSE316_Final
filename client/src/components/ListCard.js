import { useContext, useState } from 'react'
import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import List from '@mui/material/List';
import SongCard from './SongCard';
import Button from '@mui/material/Button';
import MUIRenameErrorModal from './MUIRenameErrorModal';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;
    const dateRef = new Date(0);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    function handleClick(event, id) {
        // DOUBLE CLICK IS FOR SONG EDITING
        if (event.detail === 2) {
            event.stopPropagation();
            if (Date.parse(idNamePair.publishDate) == Date.parse(dateRef)) {
                handleToggleEdit(event);
            }
        }
        if (event.detail === 1) {
            event.stopPropagation();
            console.log("handleLoadList for " + id);
            if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
            }
        }
    }

    function handleUndo(event) {
        event.stopPropagation();
        store.undo();
    }
    function handleRedo(event) {
        event.stopPropagation();
        store.redo();
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event) {
        event.stopPropagation();
        store.markListForDeletion(idNamePair._id);
    }

    function handleKeyPress(event) {
        if (text == idNamePair.name) {
        }
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }

    // process date
    let d = new Date(idNamePair.publishDate)
    let date = "";
    if ((Date.parse(idNamePair.publishDate) > Date.parse(dateRef))) {
        date = "Published: " + months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
    }

    // like/dislike button handlers
    const handleLike = (e) => {
        e.stopPropagation();
        store.incrementListStats(idNamePair._id, 1);
    }

    const handleDislike = (e) => {
        e.stopPropagation();
        store.incrementListStats(idNamePair._id, -1);
    }

    const handleUnLike = (e) => {
        e.stopPropagation();
        store.decrementListStats(idNamePair._id, 1);
    }

    const handleUnDislike = (e) => {
        e.stopPropagation();
        store.decrementListStats(idNamePair._id, -1);
    }

    const handleDuplicate = (e) => {
        e.stopPropagation();
        store.duplicateList(idNamePair._id, idNamePair.name);
    }

    const handlePublish = (e) => {
        e.stopPropagation();
        store.publishList(idNamePair._id);
    }

    // renders the appropriate buttons. defaulted to guest (disabled) then checking if liked/disliked
    let likeState = <IconButton
                        size="large"
                        disabled={true}
                    >
                        <ThumbUpOffAltIcon />
                    </IconButton>
    let dislikeState = <IconButton
                            size="large"
                            disabled={true}
                        >
                            <ThumbDownOffAltIcon />
                        </IconButton>
    let showLikes = <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: 12 }}>
                            { idNamePair.likes }
                        </Typography>
                    </Box>;
    let showDislikes = <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ fontSize: 12 }}>
                                { idNamePair.dislikes }
                            </Typography>
                        </Box>;
    let showListens = "Listens: " + idNamePair.listens;
    if (auth.loggedIn && auth.user != null) {
        if (!(Date.parse(idNamePair.publishDate) > Date.parse(dateRef))) {
            likeState = "";
            showLikes = "";
            dislikeState = "";
            showDislikes = "";
            showListens = "";
        }
        else {
            if (auth.user.likedPlaylists.includes(idNamePair._id)) {
                likeState = <IconButton
                            size="large"
                            disabled={(store.listNameActive)}
                            onClick={handleUnLike}
                            >
                                <ThumbUpIcon />
                            </IconButton>
            }
            else {
                likeState = <IconButton
                            size="large"
                            disabled={(store.listNameActive)}
                            onClick={handleLike}
                            >
                                <ThumbUpOffAltIcon />
                            </IconButton>
            }
    
            if (auth.user.dislikedPlaylists.includes(idNamePair._id)) {
                dislikeState = <IconButton
                                size="large"
                                disabled={(store.listNameActive)}
                                onClick={handleUnDislike}
                                >
                                    <ThumbDownIcon />
                                </IconButton>
            }
            else {
                dislikeState = <IconButton
                                size="large"
                                disabled={(store.listNameActive)}
                                onClick={handleDislike}
                                >
                                    <ThumbDownOffAltIcon />
                                 </IconButton>
            }
        }
    }

    const handleExpand = (e) => {
        e.stopPropagation();
        store.expandList(idNamePair._id);
    }

    const handleShrink = (e) => {
        e.stopPropagation();
        store.shrinkList();
    }

    // button show:
    let deleteShown = "";
    let duplicateShown = <Button variant='contained' disabled={(store.listNameActive)} onClick={handleDuplicate}>Duplicate</Button>;
    if (store.viewMode == 0) {
        deleteShown = <Button variant='contained' disabled={(store.listNameActive)} onClick={handleDeleteList}>Delete</Button>;
    }
    else if (true) { // make stuff to handle guest

    }

    // handles expandState
    let expandState = <IconButton
                        size="large"
                        disabled={(store.listNameActive)}
                        onClick={handleExpand}
                        >
                            <ExpandMoreIcon />
                        </IconButton>
    let canUndo = store.canUndo();
    let canRedo = store.canRedo();
    let songList = "";
    if (store.expandedList != null) {
        if (store.expandedList._id == idNamePair._id) {
            expandState = <IconButton
                            size="large"
                            disabled={(store.listNameActive)}
                            onClick={handleShrink}
                            >
                                <ExpandLessIcon />
                            </IconButton>
            if ((Date.parse(idNamePair.publishDate) > Date.parse(dateRef))) {
                songList = <Grid container justifyContent='flex-start' alignItems='center'>
                                <Grid item xs={12}>
                                    <List sx={{ maxWidth: '100%', alignItems: 'center', pt: 0, pb: 0,pl: 1, pr: 1, bgcolor: 'background.paper'}}>
                                    {
                                    store.expandedList.songs.map((song, index) => (
                                        <SongCard
                                            isSong={true}
                                            isPublished={true}
                                            id={'playlist-song-' + (index)}
                                            key={'playlist-song-' + (index)}
                                            index={index}
                                            song={song}
                                        />
                                    ))
                                    }
                                    </List>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container justifyContent='flex-end' spacing={1}>
                                        <Grid item>
                                            { deleteShown }
                                        </Grid>
                                        <Grid item>
                                            { duplicateShown }
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>;
            }
            else { // not published so  it means own, and able to edit
                songList = <Grid container>
                                <Grid item xs={12}>
                                    <List sx={{ maxWidth: '100%', alignItems: 'center', pl: 1, pr: 1 }}>
                                    {
                                        store.expandedList.songs.map((song, index) => (
                                            <SongCard
                                                isSong={true}
                                                isPublished={false}
                                                id={'playlist-song-' + (index)}
                                                key={'playlist-song-' + (index)}
                                                index={index}
                                                song={song}
                                            />
                                        ))
                                    }
                                    <SongCard isSong={false}/>
                                    </List>
                                </Grid>
                                <Grid item xs={5}>
                                    <Grid container justifyContent='flex-start' spacing={1}>
                                        <Grid item>
                                            <Button variant='contained' disabled={(store.listNameActive || !canUndo)} onClick={handleUndo}>Undo</Button>
                                        </Grid>
                                        <Grid item>
                                            <Button variant='contained' disabled={(store.listNameActive || !canRedo)} onClick={handleRedo}>Redo</Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={7}>
                                    <Grid container justifyContent='flex-end' spacing={1}>
                                        <Grid item>
                                            <Button variant='contained' disabled={(store.listNameActive)} onClick={handlePublish}>Publish</Button>
                                        </Grid>
                                        <Grid item>
                                            <Button variant='contained' disabled={(store.listNameActive)} onClick={handleDeleteList}>Delete</Button>
                                        </Grid>
                                        <Grid item>
                                            <Button variant='contained' disabled={(store.listNameActive)} onClick={handleDuplicate}>Duplicate</Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>;
            }
        }
    }

    // handles renaming
    let listName =  <Typography sx={{ whiteSpace: 'nowrap', fontSize: 30, height: 40, mr: 1,  overflow: 'hidden', textOverflow: 'ellipsis'}}>
                        { idNamePair.name }
                    </Typography>
    if (editActive) {
        console.log("im here but wtf")
        listName =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    // shows the song list
    let borderWeight = (store.currentList != null && store.currentList._id == idNamePair._id) ? 5 : 1;
    let isPublished = (!(Date.parse(idNamePair.publishDate) > Date.parse(dateRef))) ? 'background.paper' : "#ffe8b3";
    // foolproof for renaming
    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ display: 'flex', border: borderWeight , borderColor: 'primary', mb: 1, bgcolor: isPublished }}
            style={{ width: '100%', fontSize: '24pt' }}
            button
            onClick={(event) => { handleClick(event, idNamePair._id)}}
        >
            <Grid container>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={7.2}>
                            <Grid container columnSpacing={2}>
                                <Grid item xs={12}>
                                    { listName }
                                </Grid>
                                <Grid item container justifyContent='flex-start' alignItems='center' xs={12}>
                                    <Box>
                                        <Typography sx={{ fontSize: 12 }}>
                                            { "By: " + idNamePair.ownerUser }
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={4.8}>
                            <Grid container justifyContent='flex-end'>
                                <Grid item container justifyContent='flex-end' alignItems='flex-start' xs={3}>
                                    { likeState }
                                </Grid>
                                <Grid item container justifyContent='flex-start' alignItems='center' xs={2}>
                                    { showLikes }
                                </Grid>
                                <Grid item container justifyContent='flex-end' alignItems='flex-start' xs={3}>
                                    { dislikeState }
                                </Grid>
                                <Grid item container justifyContent='flex-start' alignItems='center' xs={2}>
                                    { showDislikes }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    { songList }
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item container justifyContent='flex-start' alignItems='flex-end' xs={6}>
                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ fontSize: 12 }}>
                                    { date }
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container justifyContent='flex-end'>
                                <Grid item container justifyContent='flex-end' alignItems='flex-end' xs={6}>
                                    <Box sx={{ display: 'flex' }}>
                                        <Typography sx={{ fontSize: 12 }}>
                                            { showListens }
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item container justifyContent='flex-end' alignItems='flex-end' xs={6}>
                                    { expandState }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {/* <Grid container>
                <Grid item xs={7.2}>
                    <Grid container columnSpacing={2}>
                        <Grid item xs={12} sx={{ height: 40, mr: 1,  overflow: 'hidden', textOverflow: 'ellipsis'}}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ fontSize: 30 }}>
                                    { idNamePair.name }
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{ height: 40, mr: 1,  overflow: 'hidden', textOverflow: 'ellipsis'}}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ fontSize: 12 }}>
                                    { "By: " + idNamePair.ownerUser }
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{ height: 40, mr: 1,  overflow: 'hidden', textOverflow: 'ellipsis'}}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ fontSize: 12 }}>
                                    { date }
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={4.8}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            { likeState }
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography sx={{ fontSize: 16 }}>
                                                { idNamePair.likes }
                                            </Typography>        
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            { dislikeState }
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography sx={{ fontSize: 16 }}>
                                                { idNamePair.dislikes }
                                            </Typography>        
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={6}>

                                </Grid>
                                <Grid item xs={6}>
                                    { expandState }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid> */}
            {/* <Box sx={{ p: 1, flexGrow: 1 }}>{idNamePair.name}</Box>
            <Box sx={{ p: 1 }}>
                <IconButton disabled={(cardStatus && store.listNameActive)} onClick={handleToggleEdit} aria-label='edit'>
                    <EditIcon style={{fontSize:'24pt'}} />
                </IconButton>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton disabled={(cardStatus && store.listNameActive)}
                            onClick={(event) => {
                                handleDeleteList(event, idNamePair._id)
                            }} aria-label='delete'
                >
                    <DeleteIcon style={{fontSize:'24pt'}} />
                </IconButton>
            </Box> */}
        </ListItem>
    return (
        cardElement
    );
}

export default ListCard;