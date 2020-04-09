const cron = require("node-cron");
const express = require("express");
const axios = require('axios').default;
const constants = require('./constants');
// method to call corona.ps APIs 
const retrieveData = async () => {
  return axios.get(constants.SUMMARY_API_URL);
}

const isValidJSONResponse = (response) => {
  return response && response.status === 200 && response.headers["content-type"].includes("application/json");;
}

let data = {}; // variable to hold API results
const app = express();
// schedule a cron job to call corona.ps API every 30 minutes
cron.schedule(constants.CRON_JOB_NOTATION_EVERY_30_MIN, async () => {
  const response = await retrieveData();
  if (isValidJSONResponse(response)) {
    const responseData = response.data.data;
    console.log("RESPONSE:", responseData);
    // Parse the strings into dates
    const prevLastUpdated = Date.parse(data["LastUpdated"]);
    const lastUpdated = Date.parse(responseData["LastUpdated"]);
    console.log("PrevLastUpdated", data["LastUpdated"]);
    console.log("LastUpdated", responseData["LastUpdated"]);
    // compare the two dates, to check if the server data was updated
    if (Math.abs(prevLastUpdated - lastUpdated) !== 0) {
      data = JSON.parse(JSON.stringify(responseData));
      console.log("Sending to firebase"); // initial message until firebase is done
    }
  }
});

app.listen(3128);
