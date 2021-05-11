//import { connectToDatabase } from "../../util/mongodb";
var querystring = require("querystring");
let express = require("express");
let bodyParser = require("body-parser");
const axios = require("axios");
let app = express();

var AccessTokenSet = false;
var AccessToken = null;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

const setAccessToken = () => {
  let tokenPromise = null;

  if (!AccessTokenSet) {
    tokenPromise = getAccessToken()
      .then((response) => {
        AccessTokenSet = true;
        return response.access_token;
      })
      .catch((error) => {
        AccessTokenSet = false;
        console.log(error);
      });
    AccessToken = tokenPromise.then((accessToken) => {
      return accessToken;
    });
  }
  return AccessToken;
};
var clientString =
  process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET;

var encodedAuth = new Buffer(clientString).toString("base64");
const getAccessToken = () => {
  return axios({
    url: "https://accounts.spotify.com/api/token",
    method: "POST",
    params: {
      grant_type: "client_credentials",
    },
    headers: {
      Authorization: "Basic " + encodedAuth,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((respond) => {
      console.log("New Token Recieved");
      return respond.data;
    })
    .catch((error) => {
      console.log(error);
    });
};
const getSongs = (token) => {
  console.log(token);
  return axios({
    url: "https://api.spotify.com/v1/playlists/37i9dQZEVXbJvfa0Yxg7E7",
    method: "GET",
    params: { limit: 1 },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.data.tracks;
    })
    .catch((error) => {
      console.log(error);
    });
};

export default (req, res) => {
  setAccessToken()
    .then((token) => {
      return getSongs(token);
    })
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      console.log(error);
    });
};
