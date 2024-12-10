import {FieldType} from "../enums";

/**
 * List of field types that support masking.
 * @type {FieldType[]}
 */
export const availableMaskTypes: FieldType[] = [
  FieldType.TEXT,
  FieldType.NUMBER,
  FieldType.EMAIL,
  FieldType.DATE,
  FieldType.TIME,
];
