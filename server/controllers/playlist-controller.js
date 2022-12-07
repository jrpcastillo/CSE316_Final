const Playlist = require('../models/playlist-model')
const User = require('../models/user-model');
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
    const body = req.body;
    console.log("createPlaylist body: " + JSON.stringify(body));

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    const playlist = new Playlist(body);
    console.log("playlist: " + playlist.toString());
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }

    User.findOne({ _id: req.userId }, (err, user) => {
        if (user.email != playlist.ownerEmail) {
            return res.status(400).json({ success: false, description: 'listCreated.ownerEmail does not match the current user.email'})
        }

        console.log("user found: " + JSON.stringify(user));
        user.playlists.push(playlist._id);
        user
            .save()
            .then(() => {
                playlist
                    .save()
                    .then(() => {
                        return res.status(201).json({
                            playlist: playlist
                        })
                    })
                    .catch(error => {
                        return res.status(400).json({
                            errorMessage: 'Playlist Not Created!'
                        })
                    })
            });
    })
}
deletePlaylist = async (req, res) => {
    console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    Playlist.findById({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            User.findOne({ email: list.ownerEmail }, (err, user) => {
                // removes playlistId from corresponding user.playlists
                user.playlists = user.playlists.filter(id => id != req.params.id);
                user.save();
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    Playlist.findOneAndDelete({ _id: req.params.id }, () => {
                        return res.status(200).json({
                            success: true
                        });
                    }).catch(err => console.log(err))
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ 
                        errorMessage: "authentication error" 
                    });
                }
            });
        }
        asyncFindUser(playlist);
    })
}
getPlaylistById = async (req, res) => {
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    await Playlist.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        console.log("Found list: " + JSON.stringify(list));

        // remove user auth to accommodate guest and updateListStats functions
        return res.status(200).json({ success: true, playlist: list });

        // DOES THIS LIST BELONG TO THIS USER?
        // async function asyncFindUser(list) {
        //     await User.findOne({ email: list.ownerEmail }, (err, user) => {
        //         console.log("user._id: " + user._id);
        //         console.log("req.userId: " + req.userId);
        //         if (user._id == req.userId) {
        //             console.log("correct user!");
        //             return res.status(200).json({ success: true, playlist: list })
        //         }
        //         else {
        //             console.log("incorrect user!");
        //             return res.status(400).json({ success: false, description: "authentication error" });
        //         }
        //     });
        // }
        // asyncFindUser(list);
    }).catch(err => console.log(err))
}
getPlaylistPairs = async (req, res) => {
    console.log("getPlaylistPairs");
    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("find user with id " + req.userId);
        async function asyncFindList(email) {
            console.log("find all Playlists owned by " + email);
            await Playlist.find({ ownerEmail: email },
                                { name: 1, ownerUser: 1, likes: 1, dislikes: 1, listens: 1, publishDate: 1, createdAt: 1, updatedAt: 1 },
                                (err, playlists) => {
                console.log("found Playlists: " + JSON.stringify(playlists));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!playlists) {
                    console.log("!playlists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Playlists not found' })
                }
                else {
                    console.log("Send the Playlist pairs");
                    return res.status(200).json({ success: true, idNamePairs: playlists })
                }
            }).catch(err => console.log(err))
        }
        asyncFindList(user.email);
    }).catch(err => console.log(err))
}
getPlaylists = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
    }).catch(err => console.log(err))
    
    console.log("Getting owned playlists...");
    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("Current User exists: " + req.userId);
        async function asyncFindList(email) {
            console.log("Now compiling all owned playlists for User with email: " + email);
            await Playlist.find({ ownerEmail: email }, (err, playlists) => {
                console.log("Found: " + JSON.stringify(playlists));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!playlists) {
                    console.log("!playlists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'No owned playlists :c' })
                }
                else {
                    console.log("Sending owned playlists...")
                    return res.status(200).json({ success: true, data: playlists})
                }
            }).catch(err => console.log(err))
        }
        asyncFindList(user.email);
    }).catch(err => console.log(err))
}
getOtherPlaylists = async (req, res) => {
    console.log(req.params.username);

    async function asyncFindOtherList(req) {
        console.log("Finding lists that is published by usernames containing " + req);
        let regex = new RegExp(req.params.username, "i");
        console.log(regex);
        let dateRef = new Date(0);
        await Playlist.find( {
                                $and: [
                                    { ownerUser: { $regex: regex } },
                                    { publishDate: { $gt: dateRef } }
                                ]
                             },
                             { name: 1, ownerUser: 1, likes: 1, dislikes: 1, listens: 1, publishDate: 1, createdAt: 1, updatedAt: 1 },
                             (err, playlists) => {
            console.log("Found:  " + JSON.stringify(playlists));
            if (err) {
                return res.status(400).json({ success: false, error: err})
            }
            if (!playlists) {
                console.log("!playlists.length");
                return res
                    .status(404)
                    .json({ success: false, error: 'No playlists found :c' })
            }
            else {
                console.log("Sending found public playlists matching user regex...");
                return res.status(200).json({ success: true, idNamePairs: playlists })
            }
        })
    }
    asyncFindOtherList(req);
}
getMatchingPlaylists = async (req, res) => {
    console.log(req.params.name);

    async function asyncFindMatchingList(req) {
        console.log("Finding lists with names containing " + req);

        let regex = new RegExp(req.params.name, "i");
        console.log(regex);
        let dateRef = new Date(0);
        await Playlist.find( {
                                $and: [
                                    { name: { $regex: regex } },
                                    { publishDate: { $gt: dateRef } }
                                ]
                             },
                             { name: 1, ownerUser: 1, likes: 1, dislikes: 1, listens: 1, publishDate: 1, createdAt: 1, updatedAt: 1 },
                             (err, playlists) => {
            console.log("Found:  " + JSON.stringify(playlists));
            if (err) {
                return res.status(400).json({ success: false, error: err})
            }
            if (!playlists) {
                console.log("!playlists.length");
                return res
                    .status(404)
                    .json({ success: false, error: 'No playlists found :c' })
            }
            else {
                console.log("Sending found public playlists matching name regex...");
                return res.status(200).json({ success: true, idNamePairs: playlists })
            }
        })
    }
    asyncFindMatchingList(req);
}
getOwnMatchingPlaylists = async (req, res) => {
    console.log(req.params.name);

    console.log("getOwnMatchingPlaylistPairs");
    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("find user with id " + req.userId);
        async function asyncFindOwnMatchingList(user) {
            console.log("find all Playlists owned by " + user.username + " matching the string " + req.params.name);
            let regex = new RegExp(req.params.name, "i");
            console.log(regex);
            await Playlist.find( {
                                    $and: [
                                        { ownerUser: user.username },
                                        { name: { $regex: regex } }
                                    ]
                                },
                                { name: 1, ownerUser: 1, likes: 1, dislikes: 1, listens: 1, publishDate: 1, createdAt: 1, updatedAt: 1 },
                                (err, playlists) => {
                console.log("found Playlists: " + JSON.stringify(playlists));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!playlists) {
                    console.log("!playlists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Playlists not found' })
                }
                else {
                    console.log("Send the Playlist pairs");
                    return res.status(200).json({ success: true, idNamePairs: playlists })
                }
            }).catch(err => console.log(err))
        }
        asyncFindOwnMatchingList(user);
    }).catch(err => console.log(err))
}
getPublicPlaylists = async (req, res) => {
    console.log("Getting all published playlists...");
    let dateRef = new Date(0);
    await Playlist.find({ publishDate: { $gt: dateRef } },
                        { name: 1, ownerUser: 1, likes: 1, dislikes: 1, listens: 1, publishDate: 1, createdAt: 1, updatedAt: 1 },
                        (err, playlists)=> {
        console.log("Found: " + JSON.stringify(playlists));
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists) {
            console.log("!playlists.length");
            return res
                .status(404)
                .json({ success: false, error: 'No playlists found :c'})
        }
        else {
            console.log("Sending found public playlists...");
            return res.status(200).json({ success: true, idNamePairs: playlists })
        }
    })
}
updateListStats = async (req, res) => {
    const body = req.body
    console.log("updateListStats: " + JSON.stringify(body));
    console.log("req.body.arr[0]: " + req.body.arr[0] + " req.body.arr[1]: " + req.body.arr[1]);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    User.findOne({ _id: req.userId }, (err, user) => {
        console.log("Found user: " + user.username);
        console.log("Users current liked lists: " + JSON.stringify(user.likedPlaylists))
        console.log("Users current disliked lists: " + JSON.stringify(user.dislikedPlaylists))
        Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
            console.log("Found target playlist: " + playlist.name);
            if (req.body.arr[0] > 0) { // update likes
                if (req.body.arr[1] > 0) { // increment likes
                    user.likedPlaylists.push(playlist._id);
                    playlist.likes += 1;
                }
                else { // decrement likes
                    user.likedPlaylists = user.likedPlaylists.filter((id) => !id.equals(playlist._id));
                    playlist.likes -= 1;
                }
            }
            else { // update dislikes
                if (req.body.arr[1] > 0) { // increment dislikes
                    user.dislikedPlaylists.push(playlist._id);
                    playlist.dislikes += 1;
                }
                else { // decrement dislikes
                    user.dislikedPlaylists = user.dislikedPlaylists.filter((id) => !id.equals(playlist._id));
                    playlist.dislikes -= 1;
                }
            }

            user
                .save()
                .then(() => {
                    playlist
                        .save()
                        .then(() => {
                            return res.status(200).json({
                                success: true
                            })
                        })
                        .catch(error => {
                            return res.status(400).json({
                                success: false,
                                errorMessage: 'Playlist stats not updated!'
                            })
                        })
                })
        })
    })
}
updateListens = async (req, res) => {
    console.log("Updating listens...")
    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        console.log("Found target playlist: " + playlist.name);
        
        playlist.listens += 1
        playlist
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    playlist: playlist
                })
            })
            .catch(error => {
                return res.status(400).json({
                    success: false,
                    errorMessage: 'Playlist stats not updated!'
                })
            })
    })
}
updatePlaylist = async (req, res) => {
    const body = req.body
    console.log("updatePlaylist: " + JSON.stringify(body));
    console.log("req.body.name: " + req.body.name);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    console.log("req.body.name: " + req.body.name);

                    list.name = body.playlist.name;
                    list.songs = body.playlist.songs;
                    list.publishDate = body.playlist.publishDate;
                    list.comments = body.playlist.comments;
                    list
                        .save()
                        .then(() => {
                            console.log("SUCCESS!!!");
                            return res.status(200).json({
                                success: true,
                                id: list._id,
                                message: 'Playlist updated!',
                            })
                        })
                        .catch(error => {
                            console.log("FAILURE: " + JSON.stringify(error));
                            return res.status(404).json({
                                error,
                                message: 'Playlist not updated!',
                            })
                        })
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(playlist);
    })
}
module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist,
    getOtherPlaylists,
    getPublicPlaylists,
    getMatchingPlaylists,
    getOwnMatchingPlaylists,
    updateListStats,
    updateListens
}