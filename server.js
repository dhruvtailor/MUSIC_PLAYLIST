const express = require('express');
const mongoose = require('mongoose');
const { title } = require('process');

const app = express();

const port = 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

const mongoURI = 'mongodb+srv://dhruvtailor:7698557272dt@dhruv.y8xa2gz.mongodb.net/music?retryWrites=true&w=majority';

const mongoOptions = {
    useNewUrlPArser: true,
    useUnifiedTopology: true,
}

const songsSchema = new mongoose.Schema({
    title: String,
    artist: String,
    image: String
});

const playlistEntriesSchema = new mongoose.Schema({
    title: String,
    artist: String,
    image: String
});

const Songs = mongoose.model("songs_collections", songsSchema);
const PlaylistEntries = mongoose.model("playlist_entries_collections", playlistEntriesSchema);

const connectToDatabase = async () => {
    try {
        await mongoose.connect(mongoURI, mongoOptions);
        console.log('Çonnected to MongoDB');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}

app.get('/', async (req, res) => {
    try {
        const songsData = await Songs.find();
        const playlistData = await PlaylistEntries.find();
        return res.render('index.ejs', { songs: songsData, playlist: playlistData });
    } catch (err) {
        console.error('Error fetching songs or playlist data', err);
        return res.send('Error fetching songs or playlist data');
    }
});

app.post('/add-to-playlist/:docid', async (req, res) => {
    try {
        const songtoAdd = await Songs.find({ _id: req.params.docid });
        
        const song = {
            title: songtoAdd[0].title,
            artist: songtoAdd[0].artist,
            image: songtoAdd[0].image
        }

        console.log(song);
        await new PlaylistEntries(song).save();
        return res.redirect('/');
    } catch (err) {
        console.error('Error adding song to playlist', err);
        return res.send('Error adding song to playlist');
    }
});

app.post('/remove-from-playlist/:docid', async (req, res) => {
    try {
        const songtoAdd = await PlaylistEntries.findByIdAndDelete({ _id: req.params.docid });
        return res.redirect('/');
    } catch (err) {
        console.error('Error deleting song from playlist', err);
        return res.send('Error deleting song from playlist');
    }
});

app.post('/add-song', async (req, res) => {
    try {
        const songToAdd = {
            title: req.body.inputTitle,
            artist: req.body.inputArtist,
            image: req.body.inputImageURL
        }

        console.log(songToAdd);
        await new Songs(songToAdd).save();
        return res.redirect('/');
    } catch (err) {
        console.error('Error adding to website', err);
        return res.send('Error adding to website');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('Press Ctrl + C to stop the server.');
    connectToDatabase();
})