import {FieldChoice} from "./FieldChoice";
import {FieldType} from "../enums";
import {SxProps} from "@mui/material";
import {AnySchema} from "yup";

export interface FieldDependsOn {
  fieldName: string;
  operator: 'equals' | 'notEquals' | 'in' | 'notIn' | 'greaterThan' | 'lessThan' | 'contains' | 'notContains' | 'startsWith' | 'endsWith' | 'matches' | 'notMatches';
  value: any;
  action: 'hide' | 'enable' | 'disable' | 'show' | 'set' | 'populate' | 'clear';
  setValue?: (args: {
    fieldValue: any;
    dependsOnValue: any;
    dependsOnValueExpected: any
  }) => Promise<any>;
}

export interface GetChoicesSyncAsyncParams {
  isByDependsOn?: boolean;
  dependsOnValue?: any;

  [key: string]: any;
}

export interface OnEventContext {
  event: any;
  setValue: (value: any) => void;
  setError: (error: string) => void;
  setValueByFieldName: (fieldName: string, value: any) => void;
  setHiddenByFieldName: (fieldName: string, hidden: boolean) => void;
  setDisabledByFieldName: (fieldName: string, disabled: boolean) => void;
  setChoicesByFieldName: (fieldName: string, choices: FieldChoice[]) => void;
}

export interface FieldOptions {
  labelAsTypography?: boolean;
  styles?: SxProps | object | string
  placeholder?: string;
  size?: 'small' | 'medium';
  hidden?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  choices?: FieldChoice[];
  getChoices?: (args: GetChoicesSyncAsyncParams) => FieldChoice[];
  getAsyncChoices?: (args: GetChoicesSyncAsyncParams) => Promise<FieldChoice[]>;
  getChoicesErrorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: any;
  extraProps?: { [key: string]: any };
  grid?: number | object;
  onChange?: (value: any, context: OnEventContext) => any;
  onBlur?: (value: any, context: OnEventContext) => any;
  onError?: (error: any, value: any, context: any) => any;
  helperText?: string;
  mask?: string | RegExp;
  errorMessage?: string;
  autocompleteOff?: boolean;
  isReadOnly?: boolean;
  fileMultiple?: boolean;
  fileAccepts?: string[];
  fileShowAccepts?: boolean;
  validators?: AnySchema[];
  dependsOn?: FieldDependsOn;
}

export interface Field {
  id?: string;
  name: string;
  label: any;
  type: FieldType;
  modelPath?: string;
  options?: FieldOptions;
}
