const cron = require("node-cron");
const express = require("express");
const axios = require('axios').default;

// method to call corona.ps APIs 
const retrieveData = async () => {
  return axios.get('https://corona.ps/API/summary');
}

let data = {}; // variable to hold API results
app = express();
// schedule a cron job to call corona.ps API every 30 minutes
cron.schedule("*/30 * * * *", async () => { 
  const response = await retrieveData();
  if (response && response.status === 200) {
    const responseData = response.data.data;
    console.log("RESPONSE:", responseData);
    console.log("PrevLastUpdated", data["LastUpdated"]);
    console.log("LastUpdated", responseData["LastUpdated"]);
    if (responseData["LastUpdated"] !== data["LastUpdated"]) {
      data = responseData;
      console.log("sending to firebase"); // initial message until firebase is done
    }
  }
});

app.listen(3128);
