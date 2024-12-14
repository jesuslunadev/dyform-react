import {FormSchema} from "./Form";

export interface RenderDynamicFormProps {
  schema: FormSchema;
  model?: any;
  isLoading?: boolean;
  isReadOnly?: boolean;
  isDisabled?: boolean;
}
