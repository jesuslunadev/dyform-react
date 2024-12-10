import {Field, FormSchema} from "./index";
import {FieldHook} from "./FieldHook";

export interface StateFieldType {
  id: string;
  name: string;
  value: any;
  isDirty: boolean;
  ref: any;
  isInvalid: boolean;
  error: string;
  schema: Field;
  useField: FieldHook;
  dependsOnField?: StateFieldType
}

export interface ContextStateType {
  formModel: any;
  fields: StateFieldType[];
  schema: FormSchema;
  formIsReadOnly: boolean;
  formIsDisabled: boolean;
}

export interface ContextType {
  state: ContextStateType;
  dispatch: any;
}

export enum ContextActionType {
  UpdateFormModel = 'UpdateFormModel',
  AddField = 'AddField',
  RemoveField = 'RemoveField',
  UpdateField = 'UpdateField',
  SetSchema = 'SetSchema',
  SetFormIsDisabled = 'SetFormIsDisabled',
  SetFormIsReadOnly = 'SetFormIsReadOnly',
}
