import express from 'express';
import cron from 'node-cron';
import { getDetailsHttpResponse, getGovernoratesSummaryHttpResponse, getSummaryHttpResponse } from './APIs';
import * as constants from './constants';
import { IDetailsResponse, IGovernoratesSummaryResponse, ISummaryResponse } from './interfaces';
import { isValidJSONResponse } from './utils';

/**
 * Check whether to Update Firebase Data or not.
 *
 * @param {object} prevSummaryJSON
 * @param {object} currentSummaryJSON
 * @return {boolean}
 */
function shouldPerformUpdate(
  prevSummaryJSON: ISummaryResponse,
  currentSummaryJSON: ISummaryResponse
): boolean {

  const prevLastUpdatedAt = prevSummaryJSON.data ? Date.parse(prevSummaryJSON.data.LastUpdated) : -1;
  const currentLastUpdatedAt = Date.parse(currentSummaryJSON.data.LastUpdated);
  return Math.abs(prevLastUpdatedAt - currentLastUpdatedAt) !== 0;
};

let summaryJSON = ({} as ISummaryResponse); // variable to hold summary API results
let detailsJSON = ({} as IDetailsResponse); // variable to hold details API results
let governoratesSummaryJSON = ({} as IGovernoratesSummaryResponse); // variable to hold governorate summary API results
const app = express()

// schedule a cron job to call corona.ps API every 30 minutes
cron.schedule(constants.CRON_JOB_NOTATION_EVERY_30_MIN, async () => {
  const incomingSummaryHttpResponse = await getSummaryHttpResponse();
  if (isValidJSONResponse(incomingSummaryHttpResponse)) {
    const incomingSummaryJSON = incomingSummaryHttpResponse.data as ISummaryResponse;
    console.log("Summary as JSON:", incomingSummaryJSON);
    console.log("Previous LastUpdated: ", ((summaryJSON.data) || {}).LastUpdated || undefined);
    console.log("Current LastUpdated: ", incomingSummaryJSON.data.LastUpdated);
    // compare the two dates, to check if the server data was updated
    if (shouldPerformUpdate(summaryJSON, incomingSummaryJSON)) {
      summaryJSON = JSON.parse(JSON.stringify(incomingSummaryJSON));
      const incomingDetailsHttpResponse = await getDetailsHttpResponse();
      if (isValidJSONResponse(incomingDetailsHttpResponse)) {
        detailsJSON = JSON.parse(JSON.stringify(incomingDetailsHttpResponse.data as IDetailsResponse));
        console.log('Details as JSON: ', detailsJSON);
      }
      const incomingGovernorateSummaryHttpResponse = await getGovernoratesSummaryHttpResponse();
      if (isValidJSONResponse(incomingGovernorateSummaryHttpResponse)) {
        governoratesSummaryJSON = JSON.parse(JSON.stringify(incomingGovernorateSummaryHttpResponse.data as IGovernoratesSummaryResponse));
        console.log('Governorates summary as JSON: ', governoratesSummaryJSON);
      }
      console.log("Sending to firebase"); // initial message until firebase is done
    }
  }
});

app.listen(3128);
