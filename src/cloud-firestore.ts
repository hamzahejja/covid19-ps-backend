import { firebase } from './firebase';
import { generateUniqueCaseID, getLocalDateFormat } from './utils';

import {
  ICase,
  IGovernorate,
  ISummaryResponse,
  IDetailsResponse,
  IGovernoratesSummaryResponse
} from './interfaces';

import {
  CASES_COLLECTION_REF,
  SUMMARIES_COLLECTION_REF,
  GOVERNORATES_COLLECTION_REF,
} from './constants';

/**
 * Write/Upload Governorates Status JSON
 * Objects retrieved from corona.ps API to
 * Firebase's Cloud Firestore Storage
 * Under `GOVERNORATES` Collection
 *
 * @param {IGovernoratesSummaryResponse} governoratesResponse
 * @return {Promise<void[]>}
 */
export async function writeGovernoratesStatsDocuments(
  governoratesResponse: IGovernoratesSummaryResponse
): Promise<void[]> {
  const collectionRef = firebase
    .firestore()
    .collection(GOVERNORATES_COLLECTION_REF);

  const writePromises: Promise<void>[] = governoratesResponse.data
    .Governorates
    .map((gov: IGovernorate) => {
      return collectionRef
        .doc(gov.Name.toUpperCase())
        .set(gov);
    });

  return Promise.all(writePromises)
}

/**
 * Write/Upload Cases Details JSON
 * Objects retrieved from corona.ps API to
 * Firebase's Cloud Firestore Storage
 * Under `CASES` collection.
 *
 * @param {IGovernoratesSummaryResponse} governoratesResponse
 * @return {Promise<void[]>}
 */
export async function writeCasesDocuments(casesDetailsResponse: IDetailsResponse): Promise<void[]> {
  const collectionRef = firebase
    .firestore()
    .collection(CASES_COLLECTION_REF);

  const writePromises: Promise<void>[] = casesDetailsResponse.data
    .cases
    .map((value: ICase) => {
      return collectionRef
      .doc(generateUniqueCaseID(value))
      .set(value);
    });

    return Promise.all(writePromises);
}

/**
 * Write/Upload Summary JSON object
 * retrieved from corona.ps API to
 * Firebase's Cloud Firestore Storage
 * Under `SUMMARIES` collection
 *
 * @param {IGovernoratesSummaryResponse} governoratesResponse
 * @return {Promise<void[]>}
 */
export async function writeSummaryDocument(summaryResponse: ISummaryResponse): Promise<void> {
  /** Every Summary has unique key: dd-mm-yyyy, so we keep track of all Summaries distinctly  */
  const key = getLocalDateFormat(summaryResponse.data.LastUpdated);
  const collectionRef = firebase
    .firestore()
    .collection(SUMMARIES_COLLECTION_REF);

  return collectionRef
    .doc(key)
    .set(summaryResponse.data);
}
