import {StateFieldType} from "../types";


export type FormOutput = Record<string, any>;

/**
 * Generates a form output based on specified fields, output format, and form model.
 *
 * @param {StateFieldType[]} fields - An array of field objects representing the form's state,
 * each containing attributes such as name and value.
 * @param {string} outputFormat - The requested format for the output. The function has specific
 * behavior for 'json' output format.
 * @param {any} formModel - An existing form model that can be returned if the outputFormat is not 'json'.
 * @returns {FormOutput} A form output object formatted according to the specified outputFormat.
 * If outputFormat is 'json', returns an object with key-value pairs derived from the fields array,
 * where keys are the field names and values are their corresponding values. Otherwise, returns the
 * provided formModel.
 */
export const createFormOutput = (
  fields: StateFieldType[],
  outputFormat: string,
  formModel: any
): FormOutput => {
  if (outputFormat === 'json') {
    return fields.reduce((acc, item) => ({
      ...acc,
      [item.name]: item.value
    }), {});
  }
  return formModel;
};
