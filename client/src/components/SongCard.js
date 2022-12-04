import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
//add
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [ draggedTo, setDraggedTo ] = useState(0);
    const { song, index } = props;

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
            store.showEditSongModal(index, song);
        }
    }

    let cardClass = "list-card";
    return (
        <ListItem
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
            onClick={(event) => {
                handleClick(event)
            }}
        >
            {index + 1}.
            <Box sx={{ p: 1, flexGrow: 1 }}>
                <Link id={'song-' + index + '-link'}
                    className="song-link"
                    href={"https://www.youtube.com/watch?v=" + song.youTubeId}
                    target="_blank"
                >
                    {song.title} by {song.artist}
                </Link>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => {
                        handleRemoveSong(event)
                    }} aria-label='delete'>
                    <DeleteIcon style={{fontSize:'18pt'}} />
                </IconButton>
            </Box>
        </ListItem>
        
    );
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