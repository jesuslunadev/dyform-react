import {
  ArrayOfFieldsChange,
  ContextActionType,
  Field,
  FieldChoice,
  FieldHook,
  GetChoicesSyncAsyncParams,
  OnEventContext,
  StateFieldType
} from "../../common/types";
import React, {useContext, useEffect, useState} from "react";
import {availableMaskTypes, defaultFieldProps, fieldsCanPopulate} from "../../common/constants";
import {FormContext} from "../context";
import {dependsOnCheckOperator, generateRandomUid, getYupSchemaByType, hasRequiredValidator} from "../../common/utils";
import {get, set} from "lodash";
import * as yup from 'yup';
import {AnySchema} from 'yup';
import {FieldType} from "../../common/enums";


/**
 * Initializes and manages the state and behaviors of a form field.
 * It integrates with the form context to dispatch updates and handle dependencies between fields.
 *
 * @param {Field} field - Configuration and properties of the form field.
 * @param {boolean} canHandleModelChange - Determines if the field can manage changes in the form model.
 * @param {ArrayOfFieldsChange | undefined} parentOnChangeHandler - Callback to handle changes at the parent level.
 * @param {number | undefined} parentIndex - Index of the parent element, if applicable.
 *
 * @returns {FieldHook} - Provides handlers and properties for managing field state, validation, choices, and UI interactions.
 */
export const useField = (field: Field, canHandleModelChange: boolean, parentOnChangeHandler: ArrayOfFieldsChange | undefined, parentIndex: number | undefined): FieldHook => {

  const {
    state: contextState = null,
    dispatch: contextDispatch = null
  } = useContext(FormContext) ?? {};

  const {
    fields: contextFields = [],
    formModel,
    formIsDisabled = false,
    formIsReadOnly = false,
  } = contextState ?? {};

  const [initialized, setInitialized] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<any>('');
  const [disabled, setDisabled] = useState<boolean>(
    field?.options?.disabled === true || field?.options?.isReadOnly === true
  );
  const [hidden, setHidden] = useState<boolean>(
    field?.options?.hidden || false
  );
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [dependsOnRef, setDependsOnRef] = useState<any>(null);
  const [fieldLoading, setFieldLoading] = useState<boolean>(false);
  const [choicesList, setChoicesList] = useState<FieldChoice[]>([]);
  const [errorGettingChoices, setErrorGettingChoices] = useState<boolean>(false);
  const [helperText, setHelperText] = useState<string | undefined>(field?.options?.helperText ?? undefined);

  const fieldId = React.useMemo(() => {
    const concatParent = parentIndex !== undefined ? `_sb_${parentIndex}` : '';
    return `${field.name}_${generateRandomUid()}${concatParent}`;
  }, [field.name, parentIndex]);

  const getInitialValue = () => {

    let value: any = "";

    if (field?.options?.defaultValue) {
      value = field?.options?.defaultValue;
    } else if (field?.modelPath) {
      value = get(formModel, field?.modelPath) ?? "";
    }

    if (field.type === FieldType.SWITCH
      || field.type === FieldType.CHECKBOX) {
      value = Boolean(value);
    }

    return value;
  }

  const initialValue = getInitialValue();

  const fieldProps: Field = {
    ...field,
    id: fieldId as unknown as string,
    modelPath: field?.modelPath ?? undefined,
    options: {
      ...defaultFieldProps.options,
      ...field?.options,
      placeholder: field?.options?.placeholder,
      disabled,
      helperText,
    }
  };

  const handleValidators = async (value: any) => {

    const validators = [...fieldProps?.options?.validators ?? []] as AnySchema[];

    if (fieldProps?.options?.required && !hasRequiredValidator(validators)) {
      validators.push(
        getYupSchemaByType(fieldProps.type).required()
      );
    }

    let errors = [];

    for (const validator of validators) {
      try {
        await validator.validate(value);
      } catch (err: unknown) {
        if (err instanceof yup.ValidationError) {
          errors.push(err.errors[0]);
        }
      }
    }

    if (errors.length) {
      const error = errors.join(" - ");
      setError(error);
    } else {
      setError(null);
      updateContext({isInvalid: false, error: null});
    }
  }


  const handleOnChange = async (event: React.ChangeEvent<HTMLInputElement>, initialValue = false) => {
    const newValue = event.target.value;
    handleMask(newValue);
    await handleValidators(newValue);
    if (!initialValue) {
      setIsDirty(true);
    }
    setValue(newValue);
  }


  const handleOnBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (fieldProps?.options?.onBlur) {
      fieldProps?.options?.onBlur(value, {
        ...eventContext, event
      } as OnEventContext);
    }
  }

  const hookProps: Partial<FieldHook> = {
    fieldId,
    setValue,
    setError,
    setIsDirty,
    setDisabled,
    handleValidators,
    handleOnChange,
    handleOnBlur,
    choicesList,
    setChoicesList,
    disabled,
    setHidden,
    hidden,
    fieldLoading,
    parentIndex,
    canHandleModelChange,
    parentOnChangeHandler
  }


  const getFieldChoices = async (dependsOnProps: GetChoicesSyncAsyncParams = {
    isByDependsOn: false,
    dependsOnValue: null
  }) => {

    const {
      choices,
      getAsyncChoices,
      getChoices,
      getChoicesErrorMessage,
      helperText: helperTextProp = null
    } = fieldProps?.options ?? {};

    if (choices) {
      setChoicesList(choices);
      return;
    }

    if (getChoices) {
      setChoicesList(getChoices(dependsOnProps));
      return;
    }

    if (getAsyncChoices) {
      setFieldLoading(true);
      setHelperText('Loading options...');

      try {
        const options = await getAsyncChoices(dependsOnProps);
        setChoicesList(options);
        setHelperText(helperTextProp ?? '');
      } catch (error) {
        setErrorGettingChoices(true);
        setHelperText(getChoicesErrorMessage || 'Error getting choices');
      } finally {
        setFieldLoading(false);
      }
    }
  }

  const applyMask = (mask: string, value: string) => {
    let maskedValue = "";
    let valueIndex = 0;

    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === "#") {
        if (value[valueIndex]) {
          maskedValue += value[valueIndex];
          valueIndex++;
        } else {
          break;
        }
      } else {
        maskedValue += mask[i];
      }
    }
    return maskedValue;
  }

  const handleMask = (value: string) => {

    if (field?.type === FieldType.FILE) {
      return;
    }

    if (field?.options?.mask && availableMaskTypes?.includes(field.type)) {
      return;
    }
    if (typeof field?.options?.mask === "string") {
      const rawValue = value.replace(/\W/g, "");
      const formattedValue = applyMask(field?.options?.mask, rawValue);
      setValue(formattedValue);
      return;
    }
    if (field?.options?.mask instanceof RegExp && field?.options?.mask?.test(value)) {
      setValue(value);
    }
  }

  const updateContext = (props: any) => {
    contextDispatch({
      type: ContextActionType.UpdateField,
      payload: {
        ...props,
        id: fieldId,
      }
    });
  };

  const handleSetRef = async (ref: any) => {
    contextDispatch({
      type: ContextActionType.AddField,
      payload: {
        id: fieldId, name: fieldProps.name, value, ref,
        isDirty,
        schema: fieldProps,
        useField: hookProps,
      }
    });
    if (fieldsCanPopulate.includes(fieldProps.type)) {
      await getFieldChoices();
    }
    setInitialized(true);
  }

  const getFieldByNameInContext = (fieldName: string): StateFieldType | null => {

    return contextFields.find((field) => {

        const nameCondition = field.name === fieldName;
        const fieldParentIndex = field.useField.parentIndex;

        if (parentIndex !== undefined && fieldParentIndex !== undefined) {
          return nameCondition && fieldParentIndex === parentIndex;
        }

        return nameCondition;
      }
    ) ?? null;
  }

  const eventContextSetValueByFieldName = (fieldName: string, value: any) => {
    const field = getFieldByNameInContext(fieldName);
    if (!field) {
      console.error(`Field ${fieldName} not found`);
    }
    field!.useField.handleOnChange({target: {value}} as any);
  }

  const eventContextSetHiddenByFieldName = (fieldName: string, hidden: boolean) => {
    const field = getFieldByNameInContext(fieldName);
    if (!field) {
      console.error(`Field ${fieldName} not found`);
    }
    field!.useField.setHidden(hidden);
  }

  const eventContextSetDisabledByFieldName = (fieldName: string, enabled: boolean) => {
    const field = getFieldByNameInContext(fieldName);
    if (!field) {
      console.error(`Field ${fieldName} not found`);
    }
    field!.useField.setDisabled(enabled);
  }

  const eventContextSetChoicesByFieldName = (fieldName: string, choices: FieldChoice[]) => {
    const field = getFieldByNameInContext(fieldName);
    if (!field || !fieldsCanPopulate.includes(field.schema.type)) {
      console.error(`Field ${fieldName} not found or not supported for choices`);
    }
    if (field?.value !== '') {
      field!.useField.handleOnChange({target: {value: null}} as any);
    }
    field!.useField.setChoicesList(choices);
  }

  const eventContext: Partial<OnEventContext> = {
    setValue: setValue,
    setError: setError,
    fieldSchema: field,
    setValueByFieldName: eventContextSetValueByFieldName,
    setHiddenByFieldName: eventContextSetHiddenByFieldName,
    setDisabledByFieldName: eventContextSetDisabledByFieldName,
    setChoicesByFieldName: eventContextSetChoicesByFieldName,
  }

  const handleDependsOn = async () => {
    const {
      setValue: dependsOnGetValue = null,
      value: dependsOnValueExpected,
      operator,
      action
    } = fieldProps?.options?.dependsOn ?? {};

    const dependsOnValue = dependsOnRef?.value;

    if (!operator) {
      return;
    }

    const operatorIsTrue = dependsOnCheckOperator(operator!, dependsOnValue, dependsOnValueExpected);

    if (operatorIsTrue) {
      switch (action) {
        case 'disable':
          setDisabled(true);
          break;
        case 'enable':
          setDisabled(false);
          break;
        case 'hide':
          setHidden(true);
          break;
        case 'show':
          setHidden(false);
          break;
        case 'clear':
          setValue('');
          break;
        case 'set':
          if (!dependsOnGetValue) {
            console.error('DependsOn > setValue not provided');
            break;
          }
          try {
            setDisabled(true);
            setFieldLoading(true);
            const toSetValue = await dependsOnGetValue({
              fieldValue: value,
              dependsOnValue,
              dependsOnValueExpected
            });
            setValue(toSetValue);
          } catch (e) {
            console.error('[DependsOn] SetValue error:', e);
          } finally {
            setDisabled(false);
            setFieldLoading(false);
          }
          break;
        case 'populate':
          if (!fieldsCanPopulate.includes(fieldProps.type)) {
            console.error('[DependsOn] Populate not supported for this field type: ', fieldProps.type);
            break;
          }
          await getFieldChoices({isByDependsOn: true, dependsOnValue});
          break;
        default:
          console.warn(`[DependsOn] Unknown action: ${action}`);
      }
    } else {
      switch (action) {
        case 'disable':
          setDisabled(false);
          break;
        case 'enable':
          setDisabled(true);
          break;
        case 'hide':
          setHidden(false);
          break;
        case 'show':
          setHidden(true);
          break;
      }
    }

  }


  useEffect(() => {
    if (initialValue) {
      handleOnChange({target: {value: initialValue}} as any, true).catch(e => {
        console.error(`[InitialValueSet] Error: `, e);
      });
    } else if (
      fieldProps?.options?.required ||
      hasRequiredValidator(fieldProps?.options?.validators ?? [])
    ) {
      updateContext({isInvalid: true});
    }

    if (!initialValue) {
      if (field.type === FieldType.CHECKBOX
        || field.type === FieldType.SWITCH) {
        setValue(false);
      }
    }
  }, []);


  useEffect(() => {
    if (initialized && fieldProps?.options?.dependsOn) {
      const fieldNameFind = fieldProps?.options?.dependsOn.fieldName ?? null;

      const dependsOnField = getFieldByNameInContext(fieldNameFind);

      if (!dependsOnField) {
        console.error('[DependsOn] DependsOn not found');
      }

      if (dependsOnField && dependsOnField.value !== dependsOnRef?.value) {
        setDependsOnRef(dependsOnField);
      }
    }
  }, [contextFields, parentIndex]);

  useEffect(() => {
    if (error) {
      if (fieldProps?.options?.onError && isDirty) {
        fieldProps?.options?.onError(error, value, {
          setValue,
          setError,
        });
      }
      updateContext({isInvalid: true, error});
    }
  }, [error]);

  useEffect(() => {
    if (fieldProps?.options?.onChange && isDirty) {
      fieldProps?.options?.onChange(value, {
        ...eventContext, event: null
      } as OnEventContext);
    }

    if ((fieldProps.modelPath && contextState?.formModel && contextDispatch)) {
      if (canHandleModelChange) {
        set(contextState?.formModel, fieldProps.modelPath, value);
        contextDispatch({type: ContextActionType.UpdateFormModel, payload: contextState.formModel});
      }
    }
    if (!canHandleModelChange && parentOnChangeHandler) {
      parentOnChangeHandler({
        props: fieldProps,
        hook: hookProps
      }, value, parentIndex ?? 0);
    }
    updateContext({value, isDirty});
  }, [value]);

  useEffect(() => {
    handleDependsOn().catch(e => {
      console.error('[DependsOn] Error: ', e);
    });
  }, [dependsOnRef]);

  useEffect(() => {
    setDisabled(formIsDisabled);
  }, [
    formIsDisabled,
    formIsReadOnly
  ]);

  useEffect(() => {
    if (formIsReadOnly) {
      setDisabled(false);
      return;
    }
    if (!disabled) {
      if (field?.options?.disabled === true
        || field?.options?.isReadOnly === true) {
        setDisabled(true);
      }
    }
  }, [disabled, formIsReadOnly])

  return {
    fieldProps,
    handleMask,
    handleValidators,
    updateContext,
    handleOnChange,
    handleOnBlur,
    handleSetRef,
    value,
    setValue,
    error,
    setError,
    isDirty,
    setIsDirty,
    fieldId,
    initialValue,
    disabled,
    setDisabled,
    hidden,
    setHidden,
    fieldLoading,
    getFieldChoices,
    choicesList,
    errorGettingChoices,
    setChoicesList,
    parentIndex,
    canHandleModelChange,
    parentOnChangeHandler
  }
}
