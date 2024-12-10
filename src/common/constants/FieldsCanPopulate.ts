import {FieldType} from "../enums";

/**
 * List of field types that can populate choices.
 * @type {FieldType[]}
 * @constant
 */
export const fieldsCanPopulate: FieldType[] = [
  FieldType.SELECT,
  FieldType.AUTOCOMPLETE,
  FieldType.RADIO,
];
