import React from 'react';
import YouTube from 'react-youtube';
import { useContext, useState, useRef } from 'react'
import { GlobalStoreContext } from '../store'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';


export default function YoutubePlaylisterReact() {
    // THIS EXAMPLE DEMONSTRATES HOW TO DYNAMICALLY MAKE A
    // YOUTUBE PLAYER AND EMBED IT IN YOUR SITE. IT ALSO
    // DEMONSTRATES HOW TO IMPLEMENT A PLAYLIST THAT MOVES
    // FROM ONE SONG TO THE NEXT
    
    const { store } = useContext(GlobalStoreContext);
    const [player, setPlayer] = useState(null);
    const [playerStatus, setPlayerStatus] = useState(null);
    const [currentSong, setCurrentSong] = useState(0);

    if (store.currentList == null)
        return "";

    // YT player buttons
    const handleSkipPrev = (event) => {
        decSong();
        loadAndPlayCurrentSong(player);
    }

    const handleStop = () => {
        if (playerStatus !== 2) {
            player.pauseVideo();
        }
    }

    const handlePlay = () => {
        if (playerStatus !== 1) {
            player.playVideo();
        }
    }

    const handleSkipNext = () => {
        incSong();
        loadAndPlayCurrentSong(player);
    }
    
    // THIS HAS THE YOUTUBE IDS FOR THE SONGS IN OUR PLAYLIST

    let playlist = store.currentList.songs.map(song => song.youTubeId);

    // THIS IS THE INDEX OF THE SONG CURRENTLY IN USE IN THE PLAYLIST
    const playerOptions = {
        height: '100%',
        width: '100%',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        console.log("pass here")
        let song = playlist[currentSong];
        player.loadVideoById(song);
        player.playVideo();
        console.log("pass here too")
    }

    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function incSong() {
        let curr = (currentSong+1) % playlist.length;
        setCurrentSong(curr);
    }
    
    function decSong() {
        let curr = (currentSong-1) % playlist.length;
        setCurrentSong(curr);
    }

    function onPlayerReady(event) {
        loadAndPlayCurrentSong(event.target);
        event.target.playVideo();
    }

    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        console.log("statechange")
        setPlayerStatus(event.data)
        setPlayer(event.target)
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            incSong();
            loadAndPlayCurrentSong(player);
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
        }
    }

    return( 
        <Grid container sx={{height: '100%'}}>
            <Grid container sx={{ height: '65%', width: '100%' }}>
                <div className="player-wrapper">
                    <YouTube
                        className='react-player'
                        videoId={playlist[currentSong]}
                        opts={playerOptions}
                        onReady={onPlayerReady}
                        onStateChange={onPlayerStateChange}
                        />
                </div>
            </Grid>
            <Grid container sx={{ height: '35%' }}>
                <Grid item container justifyContent='center' alignItems='center' xs={12}>
                    <Typography>
                        Now Playing
                    </Typography>
                </Grid>
                <Grid item container justifyContent='flex-start' alignItems='center' xs={12}>
                    <Typography>
                        { (store.currentList != null && store.currentList.songs.length > 0) ? "Playlist: " + store.currentList.name : "" }
                    </Typography>
                </Grid>
                <Grid item container justifyContent='flex-start' alignItems='center' xs={12}>
                    <Typography>
                        { (store.currentList != null && store.currentList.songs.length > 0) ? "Song#: " + (currentSong+1) : "" }
                    </Typography>
                </Grid>
                <Grid item container justifyContent='flex-start' alignItems='center' xs={12}>
                    <Typography>
                        { (store.currentList != null && store.currentList.songs.length > 0) ? "Title: " + store.currentList.songs[currentSong].title : "" }
                    </Typography>
                </Grid>
                <Grid item container justifyContent='flex-start' alignItems='center' xs={12}>
                    <Typography>
                        { (store.currentList != null && store.currentList.songs.length > 0) ? "Artist: " + store.currentList.songs[currentSong].artist : "" }
                    </Typography>
                </Grid>
                <Grid item container justifyContent='center' alignItems='center' xs={12}>
                    <Grid item>
                        <IconButton 
                            disabled={false}
                            onClick={handleSkipPrev}
                        >
                            <SkipPreviousIcon/>
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton 
                            disabled={false}
                            onClick={handleStop}
                        >
                            <StopIcon/>
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton 
                            disabled={false}
                            onClick={handlePlay}
                        >
                            <PlayArrowIcon/>
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton 
                                disabled={false}
                                onClick={handleSkipNext}
                            >
                                <SkipNextIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

