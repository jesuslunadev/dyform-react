import {FormSchema} from "./Form";

export interface RenderDynamicFormProps {
  schema: FormSchema;
  model?: object;
  isLoading?: boolean;
  isReadOnly?: boolean;
  isDisabled?: boolean;
}
