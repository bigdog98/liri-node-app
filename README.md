# liri-node-app

Language Interpretation and Recognition interface (LIRI) using Spotify, Bands in Town and OMDB API's.  There are four essential commands that this uses to operate.

liri usage

NPM Modules Required

For liri to work, you must install the following:

Node-Spotify-API
Request
Moment
DotEnv

You must also remember to acquire Spotify, Bands in Town and OMDB API keys and create a .env file with the following setup:

SPOTIFY_ID=*key*
SPOTIFY_SECRET=*key*
OMDB_ID=*key*
BANDSINTOWN_ID=*key*

liri call

to use liri, enter this command:

node liri.js <command> <argument>

liri commands

Concert-this uses an argument containing a band name. It processes the Bands in Town API to produce the following information for all upcoming concerts for the band entered:

Name of the venue
Venue location
Date of the Event (use moment to format this as "MM/DD/YYYY")
If there is not a concert matching the information entered , it gives the user that message.

Spotify-this-song uses an argument containing a song name. It processes the Spotify API to produce the following information for the song entered:

Artist(s)
The song's name
A preview link of the song from Spotify
The album that the song is from
If no song is entered the function provides information about "The Sign" by Ace of Base.


Movie-this runs a movie name as an argument. It then uses the OMDB API to produce the following information about the movie:

Title of the movie.
Year the movie came out.
IMDB Rating of the movie.
Rotten Tomatoes Rating of the movie.
Country where the movie was produced.
Language of the movie.
Plot of the movie.
Actors in the movie.
If no movie is entered the function returns information about the movie "Mr. Nobody"


Do-what-it-says reads a user provided text file random.txt which is a comma delimited file that takes one of the previous function and optionally an argument. It then performs the function's described actions.

Additional features

Logging

The user command, arguments, and results are recorded to a log.txt file using append mode. This allows the user to view their past searches with the LIRI.

Error checking

The program also checks for acceptable commands. If not it gracefully exits telling the user that no valid command was used.