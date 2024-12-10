import {ArrayOfFieldsChange, Field, FieldChoice, GetChoicesSyncAsyncParams} from "./index";
import React, {Dispatch, SetStateAction} from "react";

export interface FieldHook {
  fieldProps: Field;
  handleMask: (value: any) => void;
  handleValidators: (value: any) => Promise<void>;
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>, initialValue?: boolean) => void;
  handleOnBlur: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSetRef: (ref: any) => void;
  updateContext: (props: any) => void;
  fieldId: string;
  initialValue: any;
  value: any;
  setValue: SetStateAction<any>;
  error: any;
  setError: Dispatch<SetStateAction<string | null>>;
  isDirty: boolean;
  setIsDirty: Dispatch<SetStateAction<boolean>>;
  disabled: boolean;
  setDisabled: Dispatch<SetStateAction<boolean>>;
  hidden: boolean;
  setHidden: Dispatch<SetStateAction<boolean>>;
  fieldLoading: boolean;
  choicesList: FieldChoice[];
  errorGettingChoices: boolean;
  setChoicesList: Dispatch<SetStateAction<FieldChoice[]>>;
  getFieldChoices: (arg: GetChoicesSyncAsyncParams) => Promise<void>;
  canHandleModelChange: boolean;
  parentOnChangeHandler: ArrayOfFieldsChange | undefined;
  parentIndex: number | undefined;
}
