import * as yup from "yup";
import {FieldType} from "../enums";
import {AnySchema} from "yup";

/**
 * Returns a Yup schema based on the field type.
 * @param fieldType The field type.
 * @returns A Yup schema.
 * @param fieldType
 */
export const getYupSchemaByType = (fieldType: FieldType): AnySchema => {
  switch (fieldType) {
    case FieldType.TEXT:
    case FieldType.TEXTAREA:
    case FieldType.SELECT:
    case FieldType.AUTOCOMPLETE:
    case FieldType.RADIO:
    case FieldType.SECURE:
    default:
      return yup.string();
    case FieldType.DATE:
      return yup.date();
    case FieldType.EMAIL:
      return yup.string().email();
    case FieldType.NUMBER:
      return yup.number();
    case FieldType.CHECKBOX:
    case FieldType.SWITCH:
      return yup.boolean();
    case FieldType.COLOR:
      return yup.string().matches(/^#[0-9A-Fa-f]{6}$/, 'Color is not valid');
    case FieldType.TIME:
      return yup.string().matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'Time is not valid');

  }
}
