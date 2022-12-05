const mongoose = require('mongoose')
const Schema = mongoose.Schema
/*
    This is where we specify the format of the data we're going to put into
    the database.
    
    @author McKilla Gorilla
*/
const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerUser: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        listens: { type: Number, required: true },
        likes: { type: Number, required: true },
        dislikes: { type: Number, required: true },
        publishDate: { type: Date, required: true },
        comments: [{ author: String, text: String }],
        songs: { type: [{
            title: String,
            artist: String,
            youTubeId: String,
        }], required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Playlist', playlistSchema)
