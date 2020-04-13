import cron from 'node-cron';
import express from 'express';
import * as constants from './constants';
import { IDetailsResponse, IGovernoratesSummaryResponse, ISummaryResponse } from './interfaces';
import { getDetailsHttpResponse, getGovernoratesSummaryHttpResponse, getSummaryHttpResponse } from './apis';
import { writeSummaryDocument, writeCasesDocuments, writeGovernoratesStatsDocuments} from './cloud-firestore';

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
  if (incomingSummaryHttpResponse) {
    const incomingSummaryJSON = incomingSummaryHttpResponse.data as ISummaryResponse;
    console.log("Summary as JSON:", incomingSummaryJSON);
    console.log("Previous LastUpdated: ", ((summaryJSON.data) || {}).LastUpdated || undefined);
    console.log("Current LastUpdated: ", incomingSummaryJSON.data.LastUpdated);
    // compare the two dates, to check if the server data was updated
    if (shouldPerformUpdate(summaryJSON, incomingSummaryJSON)) {
      summaryJSON = JSON.parse(JSON.stringify(incomingSummaryJSON));
      await writeSummaryDocument(summaryJSON);

      /** Cases Details API, Send JSON Resposne to Firebase Firestore on Update */
      const incomingDetailsHttpResponse = await getDetailsHttpResponse();
      if (incomingDetailsHttpResponse) {
        detailsJSON = JSON.parse(JSON.stringify(incomingDetailsHttpResponse.data as IDetailsResponse));
        console.log('Details as JSON: ', detailsJSON);
        await writeCasesDocuments(detailsJSON);
      }

      /** Governorates Stats/Numbers API, Send JSON Response to Firebase Firestore on Update */
      const incomingGovernorateSummaryHttpResponse = await getGovernoratesSummaryHttpResponse();
      if (incomingGovernorateSummaryHttpResponse) {
        governoratesSummaryJSON = JSON.parse(JSON.stringify(incomingGovernorateSummaryHttpResponse.data as IGovernoratesSummaryResponse));
        console.log('Governorates summary as JSON: ', governoratesSummaryJSON);
        await writeGovernoratesStatsDocuments(governoratesSummaryJSON);
      }
    }

    console.log('No Changes! Data is UP-TO-DATE, Skipping FIREBASE upload ...');
  }
});

app.listen(3128);
