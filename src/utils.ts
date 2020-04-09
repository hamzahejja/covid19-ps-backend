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
const generateSchemaFromInterface = (interfaceRef: string) => {
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
 * Check if Resposne has status: 200 (OK) and
 * has JSON response (i.e. application/json)
 *
 * @param {axios.AxiosResponse} response
 * @return {boolean}
 */
export const isValidJSONResponse = (response: axios.AxiosResponse) => {
  return response &&
    response.status === 200 &&
    response.headers["content-type"].includes("application/json");
};

/**
 * Check if object is empty JSON.
 *
 * @param {object} obj
 * @return {boolean}
 */
export const isEmpty = (obj: object) => {
  return !Object.keys(obj).length &&
    JSON.stringify(obj) === JSON.stringify({});
};

/**
 * Perform HTTP Get
 *
 * @param {string} url
 * @param {axios.AxiosRequestConfig|{}} config
 * @return {Promise<axios.AxiosResponse>}
 */
export const httpGet = (
  url: string,
  config: axios.AxiosRequestConfig = {}
): Promise<axios.AxiosResponse> => {
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
export const validateObjectAgainstSchema = (obj, interfaceRef) => {
  const validator = new AJV({allErrors: true});
  const schema = generateSchemaFromInterface(interfaceRef);

  if (! validator.validate(schema, obj)) {
    console.error(validator.errorsText());
    return false;
  }

  return true;
}
