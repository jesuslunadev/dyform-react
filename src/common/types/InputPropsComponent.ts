import {Field, FieldChoice} from "./index";

export interface InputPropsComponent {
  field: Field;
  value: any;
  error: string | null;
  fieldLoading: boolean;
  choicesList: FieldChoice[];
  errorGettingChoices: boolean;
  handleSetRef: (ref: any) => void;
  handleOnChange: (event: any) => void;
  handleOnBlur: (event: any) => void;
}
