import * as axios from 'axios';
import cron from 'node-cron';
import express from 'express';
import * as constants from './constants';
import { ISummaryResponse } from './interfaces';
import {
  isEmpty,
  httpGet,
  isValidJSONResponse,
  validateObjectAgainstSchema,
} from './utils';

// method to call corona.ps APIs
const getSummaryHttpResponse = async (): Promise<axios.AxiosResponse<ISummaryResponse>> => {
  return httpGet(constants.SUMMARY_API_URL);
};

/**
 * Check whether to Update Firebase Data or not.
 *
 * @param {object} prevSummaryJSON
 * @param {object} currentSummaryJSON
 * @return {boolean}
 */
const shouldPerformUpdate = (
  prevSummaryJSON: ISummaryResponse,
  currentSummaryJSON: ISummaryResponse
) => {
  /** Should Update at first Data Read from API */
  if (isEmpty(prevSummaryJSON)) {
    return true;
  }

  const prevLastUpdatedAt = Date.parse(prevSummaryJSON.data.LastUpdated);
  const currentLastUpdatedAt = Date.parse(currentSummaryJSON.data.LastUpdated);

  return Math.abs(prevLastUpdatedAt - currentLastUpdatedAt) !== 0;
};

let summaryJSON = ({} as ISummaryResponse); // variable to hold API results
const app = express()

// schedule a cron job to call corona.ps API every 30 minutes
cron.schedule(constants.CRON_JOB_NOTATION_EVERY_30_MIN, async () => {
  const incomingSummaryHttpResponse = await getSummaryHttpResponse();
  if (isValidJSONResponse(incomingSummaryHttpResponse)) {
    const incomingSummaryJSON = incomingSummaryHttpResponse.data as ISummaryResponse;
    console.log(validateObjectAgainstSchema(incomingSummaryJSON, 'ISummaryResponse'));
    console.log("Summary as JSON:", incomingSummaryJSON);
    console.log("Previous LastUpdated: ", ((summaryJSON.data)||{}).LastUpdated || undefined);
    console.log("Current LastUpdated: ", incomingSummaryJSON.data.LastUpdated);
    // compare the two dates, to check if the server data was updated
    if (shouldPerformUpdate(summaryJSON, incomingSummaryJSON)) {
      summaryJSON = JSON.parse(JSON.stringify(incomingSummaryJSON));
      console.log("Sending to firebase"); // initial message until firebase is done
    }
  }
});

app.listen(3128);
