require("dotenv").config();


var keys = require("./keys.js");

var axios = require("axios");
var fs = require("fs");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);  //access keys

//store agruments in array - assistance from week 10 activities

var nodeArgs = process.argv;
var task = process.argv[2];

var mySearch = "";

for (var i=3; i < nodeArgs.length; i++){
    if(i > 3 && i < nodeArgs.length){
    mySearch = mySearch + "+" + nodeArgs[i];
}
else {
    mySearch += nodeArgs[i]
}
}
switch(task){
    case "concert-this":
        concertThis()
        break;
    case "movie-this":
        movieThis()
        break;
    case "spotify-this-song":
        spotifyThis()
        break;
    case "do-what-it-says":
        doThis()
        break;
}

function concertThis(){
    //console.log("This is for concert");
    if (mySearch === "") {
        mySearch = "Backstreet Boys"; //did not require a default band, but added
    }

    var queryUrl = "https://rest.bandsintown.com/artists/" + mySearch + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(
        function(response){
           for ( i = 0; i < 5; i++) { //setting to display 5
            console.log("Band: " + mySearch);
            console.log("Venue: " + response.data[i].venue.name);
            console.log("Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY"))
            console.log("")
        }
    }
    )

}


function movieThis(){
    //default movie to display if a movie is not provided
if (mySearch === "") {
        mySearch = "Mr. Nobody"
    }
var queryUrl = "http://www.omdbapi.com/?t=" + mySearch + "&y=&plot=short&apikey=trilogy";

axios.get(queryUrl).then(
    function(response) {
      console.log("Title: " + response.data.Title);
      console.log("Year: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.imdbRating);
      console.log("Rotten Tomato Rating: " + response.data.Ratings[1].Value);
      console.log("Production Country: " + response.data.Country);
      console.log("Language: " + response.data.Language);
      console.log("Plot: " + response.data.Plot );
      console.log("Release Year: " + response.data.Year);
      console.log("Actors: " + response.data.Actors);
    }
  );
}

function spotifyThis() {
    //console.log("This is for spotify");
if (mySearch === "") {
    mySearch = "The Sign" //set it up this way instead of sending song by Ace of Base. Will see 5 results
}
    spotify.search({ //from npm site example
        type:"track",
        query: mySearch,
        limit: 5},
        function (err, data){
            if(err) {
                console.log("Error occurred: " + err);
            }  
    for (i=0; i < data.tracks.items.length; i++){ //added so it only displays the limit
        console.log("Artist(s): " + data.tracks.items[i].artists[0].name);
        console.log("Song: " + data.tracks.items[i].name);
        console.log("Album: " + data.tracks.items[i].album.name);
        console.log("Preview: " + data.tracks.items[i].preview_url);
        console.log(" ");
    }
         } )

}


function doThis(){
    //console.log("This is for the random text file");
fs.readFile("random.txt", "utf8", function(error, data){
    if(error){
        return console.log(error);
    }
var content = data.split(",");
task = content[0];
mySearch = content[1];

switch (task) {
    case "spotify-this-song":
    spotifyThis(); //it is pulling 5 for the title. can there only be one case?
    break;
}
});

    
};



//should take in commands
// concert-this
//spotify-this-song
//movie-this
//do-what-it-says

