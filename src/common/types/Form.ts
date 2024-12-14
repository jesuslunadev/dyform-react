import {FormGroup} from "./FormGroup";
import {ReactElement} from "react";
import {FormButton} from "./FormButton";
import {SxProps} from "@mui/material";
import {CircularProgressProps} from "@mui/material/CircularProgress/CircularProgress";

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

export interface FormIsLoadingOpts  {
  sx?: SxProps | object;
  label?: ReactElement | string;
  spinner?: ReactElement | CircularProgressProps;
}

export interface FormSchema {
  name?: string;
  description?: string | ReactElement;
  groups: FormGroup[];
  submitButton?: ReactElement | FormButton;
  onSubmit?: (args: { output: any }) => any;
  onErrors?: (args: FormOnErrorsParams) => any;
  autocompleteOff?: boolean;
  outputFormat?: "json" | "model";
  isLoadingOpts?: FormIsLoadingOpts;
}
