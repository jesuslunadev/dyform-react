import {Field, FormButton} from "./index";
import {SxProps} from "@mui/material";
import {ReactElement} from "react";

export interface ArrayOfFieldsOptions {
  modelPath?: string;
  canAdd?: boolean;
  isArraySimple?: boolean;
  canRemove?: boolean;
  value?: any;
  minItems?: number;
  maxItems?: number;
  addBtn?: ReactElement | FormButton;
  removeBtn?: ReactElement | FormButton;
}

export interface FormGroup {
  name: string;
  title?: string | ReactElement;
  description?: string | ReactElement;
  styles?: SxProps | object;
  isCard?: boolean;
  isCollapse?: boolean;
  isArrayOfFields?: boolean;
  arrayOfFieldsOptions?: ArrayOfFieldsOptions;
  fields: Field[];
}
