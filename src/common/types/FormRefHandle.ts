import {SetErrorsProps} from "./SetErrorsProps";

export interface FormReactHandle {
  submit: (...args: any) => void;
  setErrors: (errors: SetErrorsProps[]) => void;
  setFormDisabled: (isDisabled: boolean) => void;
  setFormReadOnly: (isReadOnly: boolean) => void;
  clearForm: () => void;
  setFormValues: (args: { name: string; value: string }[]) => void;
}