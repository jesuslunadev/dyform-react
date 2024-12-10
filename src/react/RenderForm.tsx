import React, {
  useEffect,
  forwardRef,
  useRef,
  useReducer,
  ReactElement,
  useImperativeHandle,
  Reducer,
  FormEvent,
} from 'react';
import {ButtonProps, Typography} from '@mui/material';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';

import {
  ContextActionType,
  ContextStateType,
  FormReactHandle,
  FormButton,
  RenderDynamicFormProps,
  StateFieldType,
  FormGroup, FormSchema
} from "../common/types";
import {RenderGroup} from "./components";
import {ContextReducer, FormContext} from "./context";
import {createFormOutput, hasDuplicateGroupNames} from "../common/utils";
import {FormButtonComponent} from "./components/utils";

/**
 * RenderForm is a React forwardRef component designed to render a dynamic form
 * based on provided schema and model properties. It leverages internal hooks
 * to manage the form's state, handle submission, and update field values.
 *
 * The component supports features such as:
 * - Rendering form fields grouped by categories.
 * - Dynamically updating field values and errors.
 * - Toggling form disability and read-only states.
 * - Providing a mechanism for form submission through an accessible submit button.
 *
 * The schema defines the form structure, including description, groups, submission
 * button properties, and other attributes relevant to the form's configuration.
 *
 * @param {RenderDynamicFormProps} props - The properties required to render the dynamic form.
 * @param {FormSchema} props.schema - The schema defining the form's structure and behavior.
 * @param {object} props.model - The data model associated with the form, representing initial field values.
 *
 * @param {React.Ref<FormReactHandle>} ref - A reference object allowing imperative form methods
 * such as submit, setErrors, setFormDisabled, setFormReadOnly, clearForm, and setFormValues.
 *
 * @returns {ReactElement} The React element representing the rendered form.
 *
 */
export const RenderForm = forwardRef<FormReactHandle, RenderDynamicFormProps>(
  ({schema, model}, ref) => {

    const {
      description,
      groups = [],
      submitButton = null,
      onSubmit,
      autocompleteOff,
      isDisabled: FormIsDisabled = false,
      isReadOnly: FormIsReadOnly = false,
      outputFormat = 'model'
    } = schema as FormSchema;

    const initialState: ContextStateType = {
      formModel: model,
      fields: [],
      schema,
      formIsDisabled: FormIsDisabled,
      formIsReadOnly: FormIsReadOnly,
    };

    const [state, dispatch] = useReducer<Reducer<ContextStateType, any>>(
      ContextReducer,
      initialState
    );
    const formRef = useRef<HTMLFormElement>(null);
    const someInvalid = state.fields.some(field => field.isInvalid);

    useEffect(() => {
      hasDuplicateGroupNames(groups);
    }, [groups]);


    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      const output = createFormOutput(state.fields, outputFormat, state.formModel);
      onSubmit?.({output});
      return output;
    };


    const updateFieldValues = (
      updates: Array<{ name: string, value: any }>,
      callback: (field: StateFieldType, value: any) => void
    ) => {
      updates.forEach(({name, value}) => {
        state.fields.forEach((field: StateFieldType) => {
          if (field.name === name) {
            callback(field, value);
          }
        });
      });
    };

    useImperativeHandle(ref, () => ({
      submit: handleSubmit,

      setErrors: (errors: Array<any>) => {
        updateFieldValues(
          errors.map(({name, message}) => ({name, value: message})),
          (field, message) => field.useField.setError(message)
        );
      },

      setFormDisabled: (isDisabled: boolean) => {
        dispatch({
          type: ContextActionType.SetFormIsDisabled,
          payload: isDisabled,
        });
      },

      setFormReadOnly: (isReadOnly: boolean) => {
        dispatch({
          type: ContextActionType.SetFormIsReadOnly,
          payload: isReadOnly,
        });
      },

      clearForm: () => {
        state.fields.forEach(field => field.useField.setValue(''));
      },

      setFormValues: (args: any) => {
        updateFieldValues(
          args, (field, value) => field.useField.setValue(value)
        );
      },
    }));


    const renderSubmitButton = (): ReactElement | null => {
      if (!submitButton) return null;

      if (React.isValidElement(submitButton)) {
        return React.cloneElement(submitButton as ReactElement<ButtonProps>, {
          onClick: async (e: FormEvent) => {
            (submitButton as ReactElement)?.props?.onClick?.(e as any);
            await handleSubmit(e);
          },
          disabled: someInvalid,
        });
      }

      return (
        <FormButtonComponent
          submitButton={submitButton as FormButton}
          handleSubmit={handleSubmit}
          isDisabled={someInvalid}
        />
      );
    };

    return (
      <FormContext.Provider value={{state, dispatch}}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <form
            autoComplete={autocompleteOff ? 'off' : 'on'}
            onSubmit={handleSubmit}
            ref={(ref ?? formRef) as any}
          >
            {description && (
              <Typography variant="body1">{description}</Typography>
            )}

            {groups.map((group: FormGroup) => (
              <RenderGroup key={group.name} group={group}/>
            ))}

            {renderSubmitButton()} 
          </form>
        </LocalizationProvider>
      </FormContext.Provider>
    );
  }
);

RenderForm.displayName = 'RenderForm';
