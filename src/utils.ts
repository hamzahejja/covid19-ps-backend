import AJV from 'ajv';
import * as axios from 'axios';
import * as TJS from 'typescript-json-schema';
import * as path from 'path';
import { SRC_BASE_PATH, TYPES_FILE_PATH } from './constants';

/**
 * Generate/Compile Schema from TS Interface/Type
 *
 * @param {string} interfaceRef
 * @return {object}
 */
function generateSchemaFromInterface (interfaceRef: string): TJS.Definition {
  const compilerOptions: TJS.CompilerOptions = { //TS Compiler Settings
    strictNullChecks: true
  };

  const settings: TJS.PartialArgs = { // Schema Generator Settings
    required: true, // Get Alerted for Missing Required Properties
    noExtraProps: true, // Get Alerted for Additional Properties in JSON
  };

  return TJS.buildGenerator(
    TJS.getProgramFromFiles([path.join(SRC_BASE_PATH, TYPES_FILE_PATH)], compilerOptions),
    settings
  ).getSchemaForSymbol(interfaceRef);
}

/**
 * Check if Http Response has status: 200 (OK) and
 * has JSON content (i.e. application/json)
 *
 * @param {axios.AxiosResponse} response
 * @return {boolean}
 */
export function isValidJSONResponse (response: axios.AxiosResponse): boolean {
  return response &&
    response.status === 200 &&
    response.headers['content-type'].includes('application/json');
};

/**
 * Perform HTTP Get
 *
 * @param {string} url
 * @param {axios.AxiosRequestConfig|{}} config
 * @return {Promise<axios.AxiosResponse>}
 */
export function httpGet (
  url: string,
  config: axios.AxiosRequestConfig = {}
): Promise<axios.AxiosResponse> {
  return axios.default.get(url, config);
};

/**
 * Validate JSON object against Schema,
 * Using AJV library/package.
 * Reference: https://github.com/epoberezkin/ajv
 *
 * @param {object} obj
 * @param {object} schema
 * @return {boolean}
 */
export function validateObjectAgainstSchema (obj: object, interfaceRef: string): boolean {
  const validator = new AJV({allErrors: true});
  const schema = generateSchemaFromInterface(interfaceRef);

  if (!validator.validate(schema, obj)) {
    console.error(validator.errorsText());
    return false;
  }

  return true;
}

/**
 * Format JavaScript Date as dd-mm-yyyy
 * and Return it as string
 *
 * @param {string} dateTimeString
 * @return {string}
 */
export function getLocalDateFormat(dateTimeString: string): string {
  const dateTimeFormat: Intl.DateTimeFormat = new Intl.DateTimeFormat(
    'en',
    { day: '2-digit', month: '2-digit', year: 'numeric'}
  );

  const [
    {value: month},,
    {value: day},,
    {value: year}
  ] = dateTimeFormat.formatToParts(new Date(dateTimeString));

  return `${day}-${month}-${year}`;
}
