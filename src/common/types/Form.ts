import {FormGroup} from "./FormGroup";
import {ReactElement} from "react";
import {FormButton} from "./FormButton";

export interface FormOnSubmitParams {
  fields: {
    id: string;
    name: string;
    value: any;
    modelPath: string;
  }[];
  model: any | null;
}


export interface FormOnErrorsParams {
  fields: {
    id: string;
    name: string;
    error: string;
    modelPath: string;
  }[];
}


export interface FormSchema {
  name?: string;
  description?: string | ReactElement;
  groups: FormGroup[];
  submitButton?: ReactElement | FormButton;
  onSubmit?: (args: { output: any }) => any;
  onErrors?: (args: FormOnErrorsParams) => any;
  autocompleteOff?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  outputFormat?: "json" | "model";
}
