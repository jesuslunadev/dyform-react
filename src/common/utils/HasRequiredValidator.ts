import {AnySchema} from "yup";

/**
 * Checks if there is a required validator in the provided validators.
 * @param validators The validators to check.
 * @returns True if there is a required validator, false otherwise.
 */
export const hasRequiredValidator = (validators: AnySchema[]): boolean => {
  return validators.some((validator) => {
    return !validator.describe().optional;
  });
};
