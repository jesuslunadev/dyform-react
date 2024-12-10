import {Field} from "./Field";
import {FieldHook} from "./FieldHook";

export type ArrayOfFieldsChange = (field: {
  props: Field,
  hook: Partial<FieldHook>
}, value: any, indexGroup: number) => void;

