import React, {
  useEffect,
  forwardRef,
  useRef,
  useReducer,
  ReactElement,
  useImperativeHandle,
  Reducer,
  FormEvent, useState,
} from 'react';
import {Box, ButtonProps, Typography} from '@mui/material';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';

import {
  ContextActionType,
  ContextStateType,
  FormReactHandle,
  FormButton,
  RenderDynamicFormProps,
  StateFieldType,
  FormGroup, FormSchema, FormIsLoadingOpts
} from "../common/types";
import {RenderGroup} from "./components";
import {ContextReducer, FormContext} from "./context";
import {createFormOutput, flattenModel, hasDuplicateGroupNames} from "../common/utils";
import {BackdropFormLoading, FormButtonComponent} from "./components/utils";

/**
 * `RenderForm` is a React functional component that serves as a dynamic and customizable form renderer.
 * It utilizes a schema-based approach to build forms and provides extensive control over form behaviors, validation,
 * and submission mechanisms. The component relies on React's `forwardRef` to expose imperative handlers
 * for advanced interactions and state manipulations.
 *
 * The component offers several key features:
 *
 * - Schema-driven form generation: Dynamically builds form fields and groups based on a provided schema.
 * - State management: Manages form state, including field values, validation states, disabled/read-only states, and loading states.
 * - Imperative API: Exposes methods for submitting the form, setting errors, clearing values, disabling/enabling the form,
 *   updating field values, and marking the form as loading.
 * - Field validation: Handles validation mechanisms within fields, including marking invalid fields and disabling the
 *   submit button if necessary.
 * - Customization: Allows custom rendering of form elements, including submit buttons and field groups.
 *
 * The schema provided as a prop is expected to include the following:
 * - A description of the form (optional).
 * - Groups of fields to be rendered.
 * - Settings for autocomplete behavior, default disabled/read-only states, and loading indication.
 * - Information on the output format of the form data.
 *
 * Props:
 * - `schema`: The schema for the form indicating its layout, fields, and behavior.
 * - `model`: The initial model containing field values to populate the form.
 *
 * Exposed imperative methods:
 * - `submit`: Triggers the form submission logic.
 * - `setErrors`: Accepts an array of error messages to apply to specific fields.
 * - `setFormDisabled`: Disables or enables the entire form.
 * - `setFormReadOnly`: Marks the form as read-only or editable.
 * - `clearForm`: Clears all field values to reset the form.
 * - `setFormValues`: Updates field values programmatically.
 * - `setFormIsLoading`: Toggles the loading state for the form.
 *
 * The component also ensures duplicate group names in the schema are avoided and provides mechanisms
 * to perform customizations and validations on field groups during the rendering process.
 */
export const RenderForm = forwardRef<FormReactHandle, RenderDynamicFormProps>(
  ({schema, isLoading, isDisabled, isReadOnly, model}, ref) => {

    const {
      description,
      groups = [],
      submitButton = null,
      onSubmit,
      autocompleteOff,
      isLoadingOpts = {
        sx: {},
        label: '',
        spinner: undefined,
      },
      outputFormat = 'model'
    } = schema as FormSchema;

    const initialState: ContextStateType = {
      formModel: model,
      fields: [],
      schema,
      formIsDisabled: isDisabled as boolean,
      formIsReadOnly: isReadOnly as boolean,
    };


    const [state, dispatch] = useReducer<Reducer<ContextStateType, any>>(
      ContextReducer,
      initialState
    );
    const [isLoadingForm, setIsLoadingForm] = useState<boolean>(isLoading ?? false);
    const [isLoadingFormOpts, setIsLoadingFormOpts] = useState<FormIsLoadingOpts>(isLoadingOpts);
    const formRef = useRef<HTMLFormElement>(null);
    const someInvalid = state.fields.some(field => field.isInvalid);

    useEffect(() => {
      hasDuplicateGroupNames(groups);
    }, [groups]);

    useEffect(() => {
      if (model && typeof model === 'object') {
        const values = flattenModel(model);
        updateFieldValues(
          values, (field, value) => field.useField.handleOnChange({target: {value}} as any),
        );
      }
    }, [model]);

    useEffect(() => {
      setIsLoadingForm(isLoading as boolean);
    }, [isLoading]);

    useEffect(() => {
      dispatch({
        type: ContextActionType.SetFormIsReadOnly,
        payload: isReadOnly as boolean,
      })
    }, [isReadOnly]);

    useEffect(() => {
      dispatch({
        type: ContextActionType.SetFormIsDisabled,
        payload: isDisabled as boolean,
      })
    }, [isDisabled]);

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      if (someInvalid) {
        return;
      }
      const output = createFormOutput(state.fields, outputFormat, state.formModel);
      onSubmit?.({output});
      return output;
    };


    const updateFieldValues = (
      updates: Array<{ name?: string, modelPath?: string; value: any }>,
      callback: (field: StateFieldType, value: any) => void
    ) => {
      updates.forEach(({name, modelPath, value}) => {
        state.fields.forEach((field: StateFieldType) => {
          if (name) {
            if (field.name === name) {
              callback(field, value);
            }
          }
          if (modelPath && field?.schema?.modelPath) {
            if (field?.schema?.modelPath === modelPath) {
              callback(field, value);
            }
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
          args, (field, value) => field.useField.handleOnChange({target: {value}} as any),
        );
      },

      setFormIsLoading: (isLoading: boolean, options?: FormIsLoadingOpts) => {
        setIsLoadingForm(isLoading);
        if (options) {
          setIsLoadingFormOpts(options);
        }
      }
    }));

    const submitButtonDisabled = someInvalid || (isDisabled as boolean) || (isReadOnly as boolean);

    const renderSubmitButton = (): ReactElement | null => {
      if (!submitButton) return null;

      if (React.isValidElement(submitButton)) {
        return React.cloneElement(submitButton as ReactElement<ButtonProps>, {
          onClick: async (e: FormEvent) => {
            (submitButton as ReactElement)?.props?.onClick?.(e as any);
            await handleSubmit(e);
          },
          disabled: submitButtonDisabled,
        });
      }

      return (
        <FormButtonComponent
          submitButton={submitButton as FormButton}
          handleSubmit={handleSubmit}
          isDisabled={submitButtonDisabled}
        />
      );
    };

    return (
      <Box style={{position: 'relative'}}>
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

              {!isReadOnly && renderSubmitButton()}
            </form>

            {isLoadingForm && <BackdropFormLoading options={isLoadingFormOpts}/>}

          </LocalizationProvider>
        </FormContext.Provider>
      </Box>
    );
  }
);

RenderForm.displayName = 'RenderForm';
