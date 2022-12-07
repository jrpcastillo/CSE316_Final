/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()
const auth = require('../auth')

router.post('/playlist', auth.verify, PlaylistController.createPlaylist)
router.delete('/playlist/:id', auth.verify, PlaylistController.deletePlaylist)
router.get('/playlist/:id', PlaylistController.getPlaylistById) // removed auth requirement
router.get('/playlistpairs', auth.verify, PlaylistController.getPlaylistPairs)
router.get('/playlists', auth.verify, PlaylistController.getPlaylists)
router.put('/playlist/:id', auth.verify, PlaylistController.updatePlaylist)
// new routes for non-auth
router.get('/otherplaylists/:username', PlaylistController.getOtherPlaylists)
router.get('/matchingplaylists/:name', PlaylistController.getMatchingPlaylists)
router.get('/ownmatchingplaylists/:name', auth.verify, PlaylistController.getOwnMatchingPlaylists)
router.get('/publicplaylists', PlaylistController.getPublicPlaylists)
router.put('/updatestats/:id', auth.verify, PlaylistController.updateListStats)
router.put('/updatelistens/:id', PlaylistController.updateListens)

module.exports = router