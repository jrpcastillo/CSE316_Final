import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
//add
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [ draggedTo, setDraggedTo ] = useState(0);
    const { isSong, song, index, isPublished } = props;

    function handleDragStart(event) {
        event.dataTransfer.setData("song", index);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let targetIndex = index;
        let sourceIndex = Number(event.dataTransfer.getData("song"));
        setDraggedTo(false);

        // UPDATE THE LIST
        store.addMoveSongTransaction(sourceIndex, targetIndex);
    }
    function handleRemoveSong(event) {
        event.stopPropagation();
        store.showRemoveSongModal(index, song);
    }
    function handleClick(event) {
        // DOUBLE CLICK IS FOR SONG EDITING
        if (event.detail === 2) {
            event.stopPropagation();
            store.showEditSongModal(index, song);
        }
    }
    function handleAddSong(event) {
        event.stopPropagation();
        event.preventDefault();
        store.addNewSong();
    }

    let cardElement = <ListItem
                        sx={{ marginTop: '15px', display: 'flex', p: 1, border: 1 , borderColor: 'primary', justifyContent: 'center' }}
                        style={{ width: '100%', fontSize: '18pt'}}
                        button
                        >
                            <Box style={{ justifyContent: 'center', display: 'flex' }}>
                                <Button disabled={store.listNameActive} variant='contained' onClick={handleAddSong}>+</Button>
                            </Box>
                        </ListItem>
    if (isSong && !isPublished) {
        cardElement = <ListItem
                        sx={{ marginTop: '15px', display: 'flex', p: 1, border: 1 , borderColor: 'primary'}}
                        style={{ width: '100%', fontSize: '18pt'}}
                        id={'song-' + index + '-card'}
                        key={index}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        draggable="true"
                        button
                        disabled={store.listNameActive}
                        onClick={(event) => {
                            handleClick(event)
                        }}
                        >
                        <Typography fontSize={18}>
                            {index + 1}.
                        </Typography>
                        <Box sx={{ p: 1, flexGrow: 1 }}>
                            <Typography fontSize={18}>                                    
                                {song.title} by {song.artist}
                            </Typography>
                        </Box>
                        <Box sx={{ p: 1 }}>
                            <IconButton disabled={store.listNameActive} onClick={(event) => {
                                    handleRemoveSong(event)
                                }} aria-label='delete'>
                                <DeleteIcon style={{fontSize:'18pt'}} />
                            </IconButton>
                        </Box>
                    </ListItem>
    }
    else if (isSong && isPublished) {
        cardElement = <ListItem
                        sx={{ marginTop: '15px', display: 'flex', p: 1, border: 0 , borderColor: 'primary'}}
                        style={{ width: '100%', fontSize: '18pt'}}
                        id={'song-' + index + '-card'}
                        key={index}
                        >
                            <Typography fontSize={18}>
                                {index + 1}.
                            </Typography>
                            <Box sx={{ p: 1, flexGrow: 1 }}>
                                <Typography fontSize={18}>
                                        {song.title} by {song.artist}
                                </Typography>
                            </Box>
                        </ListItem>
    }
    return cardElement;
}

/*
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
                onClick={handleRemoveSong}
            />
            */

/*
<div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
            onClick={handleClick}
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}
                target="_blank">
                {song.title} by {song.artist}
            </a>
            <IconButton onClick={(event) => {
                        handleRemoveSong(event)
                    }} aria-label='delete'>
                    <DeleteIcon style={{fontSize:'24pt'}} />
            </IconButton>
            
        </div>*/

export default SongCard;