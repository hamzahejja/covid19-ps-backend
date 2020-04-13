import * as axios from 'axios';
import { DETAILS_API_URL, GOVERNORATE_SUMMARY_URL, SUMMARY_API_URL } from './constants';
import { IDetailsResponse, IGovernoratesSummaryResponse, ISummaryResponse } from './interfaces';
import { httpGet } from './utils';

// method to call corona.ps APIs and get the summary JSON
export async function getSummaryHttpResponse(): Promise<axios.AxiosResponse<ISummaryResponse>> {
  return httpGet(SUMMARY_API_URL);
};

// method to call corona.ps APIs and get the details JSON
export async function getDetailsHttpResponse(): Promise<axios.AxiosResponse<IDetailsResponse>> {
  return httpGet(DETAILS_API_URL);
};

// method to call corona.ps APIs and get the governorate summary JSON
export async function getGovernoratesSummaryHttpResponse(): Promise<axios.AxiosResponse<IGovernoratesSummaryResponse>> {
  return httpGet(GOVERNORATE_SUMMARY_URL);
};
