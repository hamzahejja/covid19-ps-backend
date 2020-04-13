import * as axios from 'axios';
import { httpGet, isValidJSONResponse, validateObjectAgainstSchema } from './utils';
import { DETAILS_API_URL, GOVERNORATE_SUMMARY_URL, SUMMARY_API_URL } from './constants';
import { IDetailsResponse, IGovernoratesSummaryResponse, ISummaryResponse } from './interfaces';

// method to call corona.ps APIs and get the summary JSON
export async function getSummaryHttpResponse(): Promise<axios.AxiosResponse<ISummaryResponse>> {
  const schemaRef = 'ISummaryResponse'; // Corresponding TS Interface will be used
  const response = await httpGet(SUMMARY_API_URL);

  return isValidJSONResponse(response) &&
    validateObjectAgainstSchema(response.data as ISummaryResponse, schemaRef) ?
      response : null;
};

// method to call corona.ps APIs and get the details JSON
export async function getDetailsHttpResponse(): Promise<axios.AxiosResponse<IDetailsResponse>> {
  const schemaRef = 'IDetailsResponse'; // Corresponding TS Interface will be used
  const response = await httpGet(DETAILS_API_URL);

  return isValidJSONResponse(response) &&
    validateObjectAgainstSchema(response.data as IDetailsResponse, schemaRef) ?
      response : null;
};

// method to call corona.ps APIs and get the governorate summary JSON
export async function getGovernoratesSummaryHttpResponse(): Promise<axios.AxiosResponse<IGovernoratesSummaryResponse>> {
  const schemaRef = 'IGovernoratesSummaryResponse'; // Corresponding TS Interface will be used
  const response = await httpGet(GOVERNORATE_SUMMARY_URL);

  return isValidJSONResponse(response) &&
    validateObjectAgainstSchema(response.data as IGovernoratesSummaryResponse, schemaRef) ?
      response : null;

};
