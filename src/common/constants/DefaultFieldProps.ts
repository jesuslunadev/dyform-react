import {Field} from "../types";

/**
 * Default field properties.
 * @type {Partial<Field>}
 * @constant
 */
export const defaultFieldProps: Partial<Field> = {
  modelPath: undefined,
  options: {
    labelAsTypography: false,
    styles: {},
    hidden: false,
    size: 'medium',
    variant: 'outlined',
    choices: undefined,
    getChoices: undefined,
    getAsyncChoices: undefined,
    getChoicesErrorMessage: undefined,
    required: false,
    disabled: false,
    defaultValue: null,
    extraProps: {},
    grid: 12,
    onChange: undefined,
    onError: undefined,
    helperText: undefined,
    mask: undefined,
    errorMessage: undefined,
    autocompleteOff: false,
    isReadOnly: false,
    validators: [],
    dependsOn: undefined,
  },
};
