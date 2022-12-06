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

    function handleLoadList(event, id) {
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

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
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
    let cardStatus = false;
    if (store.listNameActive) {
        cardStatus = true;
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
    if (auth.loggedIn) {
        if (auth.user.likedPlaylists.includes(idNamePair._id)) {
            likeState = <IconButton
                        size="large"
                        disabled={false}
                        onClick={handleUnLike}
                        >
                            <ThumbUpIcon />
                        </IconButton>
        }
        else {
            likeState = <IconButton
                        size="large"
                        disabled={false}
                        onClick={handleLike}
                        >
                            <ThumbUpOffAltIcon />
                        </IconButton>
        }

        if (auth.user.dislikedPlaylists.includes(idNamePair._id)) {
            dislikeState = <IconButton
                            size="large"
                            disabled={false}
                            onClick={handleUnDislike}
                            >
                                <ThumbDownIcon />
                            </IconButton>
        }
        else {
            dislikeState = <IconButton
                            size="large"
                            disabled={false}
                            onClick={handleDislike}
                            >
                                <ThumbDownOffAltIcon />
                             </IconButton>
        }
    }

    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ display: 'flex', border: 1 , borderColor: 'primary', mb: 1 }}
            style={{ width: '100%', fontSize: '24pt'}}
            button
            disabled={cardStatus}
            onClick={(event) => {
                handleLoadList(event, idNamePair._id)
            }}
        >
            <Grid container>
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
                    </Grid>
                </Grid>
            </Grid>
            {/* <Box sx={{ p: 1, flexGrow: 1 }}>{idNamePair.name}</Box>
            <Box sx={{ p: 1 }}>
                <IconButton disabled={cardStatus} onClick={handleToggleEdit} aria-label='edit'>
                    <EditIcon style={{fontSize:'24pt'}} />
                </IconButton>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton disabled={cardStatus}
                            onClick={(event) => {
                                handleDeleteList(event, idNamePair._id)
                            }} aria-label='delete'
                >
                    <DeleteIcon style={{fontSize:'24pt'}} />
                </IconButton>
            </Box> */}
        </ListItem>

    if (editActive) {
        cardElement =
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
    return (
        cardElement
    );
}

export default ListCard;