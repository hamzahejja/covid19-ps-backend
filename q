[1mdiff --git a/constants.js b/constants.js[m
[1mindex aa944e2..7e3fcb1 100644[m
[1m--- a/constants.js[m
[1m+++ b/constants.js[m
[36m@@ -1,7 +1,6 @@[m
[31m-[m
 const SUMMARY_API_URL = 'https://corona.ps/API/summary';[m
 const CRON_JOB_NOTATION_EVERY_30_MIN = '*/30 * * * *';[m
 module.exports = {[m
     SUMMARY_API_URL,[m
     CRON_JOB_NOTATION_EVERY_30_MIN[m
[31m-}[m
\ No newline at end of file[m
[32m+[m[32m}[m
[1mdiff --git a/index.js b/index.js[m
[1mindex 81f67fd..3a5bae0 100644[m
[1m--- a/index.js[m
[1m+++ b/index.js[m
[36m@@ -7,12 +7,16 @@[m [mconst retrieveData = async () => {[m
   return axios.get(constants.SUMMARY_API_URL);[m
 }[m
 [m
[32m+[m[32mconst isValidJSONResponse = (response) => {[m
[32m+[m[32m  return response && response.status === 200 && response.headers["content-type"].includes("application/json");;[m
[32m+[m[32m}[m
[32m+[m
 let data = {}; // variable to hold API results[m
 const app = express();[m
 // schedule a cron job to call corona.ps API every 30 minutes[m
 cron.schedule(constants.CRON_JOB_NOTATION_EVERY_30_MIN, async () => {[m
   const response = await retrieveData();[m
[31m-  if (response && response.status === 200) {[m
[32m+[m[32m  if (isValidJSONResponse(response)) {[m
     const responseData = response.data.data;[m
     console.log("RESPONSE:", responseData);[m
     // Parse the strings into dates[m
[36m@@ -22,8 +26,8 @@[m [mcron.schedule(constants.CRON_JOB_NOTATION_EVERY_30_MIN, async () => {[m
     console.log("LastUpdated", responseData["LastUpdated"]);[m
     // compare the two dates, to check if the server data was updated[m
     if (Math.abs(prevLastUpdated - lastUpdated) !== 0) {[m
[31m-      data = responseData;[m
[31m-      console.log("sending to firebase"); // initial message until firebase is done[m
[32m+[m[32m      data = JSON.parse(JSON.stringify(responseData));[m
[32m+[m[32m      console.log("Sending to firebase"); // initial message until firebase is done[m
     }[m
   }[m
 });[m
