require('dotenv').config()

var Spotify = require('node-spotify-api');
var request = require('request');
var moment = require('moment');
var keys = require('./keys');
var fs= require("fs");

var spotify = new Spotify(keys.spotify);
var bit = keys.bit.id;
var omdb = keys.omdb.id;

//var to store command and data logged during command call
var logged =[];


// LIRI functions

// This function
function concertThis(artist,callback) {

    //generate API URL
    var bitURL = "https://rest.bandsintown.com/artists/"+artist+"/events?app_id="+bit;
    //console.log(bitURL);
    var datetime;

    //API call
    request(bitURL, function(error, response, body) {

        // If the request was successful...
        if (!error && response.statusCode === 200) {
        
            var data = JSON.parse(body);
            // loop through all concerts
            for (let i=0;i<body.length;i++) {

                //parse data
                if(data[i] != undefined) {
                    console.log("\nVenue: "+data[i].venue.name);
                    if(data[i].venue.city != '')
                        console.log("\nCity: "+data[i].venue.city);
                    if(data[i].venue.region != '')
                        console.log("\nRegion: "+data[i].venue.region);
                    if(data[i].venue.country != '')
                        console.log("\nCountry: "+data[i].venue.country);
                    datetime = moment(data[i].datetime,"YYYY-MM-DDtHH:mm:ss").format("MM/DD/YYYY");
                    console.log("\nDate: "+datetime+"\n");
                    logged.push(...[data[i].venue.name,data[i].venue.city,data[i].venue.region,data[i].venue.country,datetime]);
                }
                if(data[i] === undefined && i===0) {
                    console.log("\nSorry we don't see any concerts. :(")
                    logged.push("Sorry we don't see any concerts. :(");
                }
            }
        }
        callback();
    });
    
}

//Song function
function spotifyThisSong(song,callback) {
       
    //default song
    if(song == undefined) 
        song="\"The+Sign\"%20NOT%20times";
    else
        song= "\""+song+"\"";   
    
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        console.log("\nArtist(s):");
        for(let i=0; i <data.tracks.items[0].artists.length;i++) {
            console.log(data.tracks.items[0].artists[i].name);
            logged.push(data.tracks.items[0].artists[i].name);
        }
        console.log("\nSong Name:")
        console.log(data.tracks.items[0].name+"\n");
        console.log("Preview Link:")
        console.log(data.tracks.items[0].preview_url+"\n");
        console.log("Song Album:")
        console.log(data.tracks.items[0].album.name);
        logged.push(...[data.tracks.items[0].name,data.tracks.items[0].preview_url,data.tracks.items[0].album.name]);
        callback();
    });
    
}
//Movie function
function movieThis(title,callback) {
    if (!title) //if no title defined
        title = "Mr. Nobody";
    var omdbURL = "http://www.omdbapi.com/?t="+"\""+title+"\""+"&y=&plot=short&type=movie&tomatoes=true&apikey="+omdb;
    
    request(omdbURL, function(error, response, body) {

        if (!error && response.statusCode === 200) {
    
            var parsed= JSON.parse(body);
            
            console.log("\nMovie Title: "+ parsed.Title);
            console.log("\nYear Released: "+ parsed.Year);
            console.log("\nIMDB Rating: "+ parsed.Ratings[0].Value);
            console.log("\nRotten Tomatoes Rating: "+parsed.Ratings[1].Value);
            console.log("\nCountry Produced: "+parsed.Country );
            console.log("\nMovie Language(s): "+parsed.Language);
            console.log("\nMovie plot: "+parsed.Plot);
            console.log("\nMovie Actors: "+parsed.Actors);
        }
        logged.push(...[parsed.Title,parsed.Year,parsed.Ratings[0].Value,parsed.Ratings[1].Value,parsed.Country,parsed.Language,parsed.Plot,parsed.Actors]);

        callback();
    });
   
}

//This function
function doWhatItSays() {

    fs.readFile("random.txt","utf8",function(error,data){

    if (error) {
        return console.log(error);
    }

    //if no error lets parse what's in the file
    var parsed = data.split(",");

    
    //now execute function and pass arg
    selectCommand(parsed[0],parsed[1]);

    });

}


//This function logs the data and command to the log.txt file
function logger() {
    
    logged.push('');
    
    fs.appendFile("log.txt",logged,function (err) {

        if (err) {
            return console.log(error);
        }
        console.log('\ncommand logged.')

    });
}

function selectCommand(command,userArg) {
  

    //grab function name
    logged.push(command)
    if(userArg)
        logged.push(userArg);
    switch(command){
        case "concert-this":
        concertThis(userArg,function(){
            logger();
        });
        break;
        case "spotify-this-song":
        spotifyThisSong(userArg,function(){
            logger();
        });
        break;
        case "movie-this":
        movieThis(userArg,function() {
            logger();
        });
        break;
        case "do-what-it-says":
        doWhatItSays();
        break;
        default:
        console.log("Invalid command. Please try again.");
        break;
    }
    
}


//Variables to handle user input
var firstInput = process.argv[2];
var secondInput = process.argv[3];

