import React, {FC, memo, useRef, RefObject, useEffect} from "react";
import {FormControl, TextField} from "@mui/material";
import {InputPropsComponent} from "../../common/types";
import {FieldType} from "../../common/enums";

/**
 * InputText is a functional component that renders a text input field with customizable properties.
 * It handles input changes, input blur events, and sets a reference to the input element.
 *
 * Properties expected in the field object include:
 * - `type`: Specifies the type of the input field.
 * - `id`: Unique identifier for the input element.
 * - `label`: Label for the input field.
 *
 * Options under the field object may include:
 * - `required`: Boolean indicating if the field is mandatory.
 * - `size`: Size of the input component (e.g., 'small', 'medium').
 * - `disabled`: Boolean indicating if the input is disabled.
 * - `placeholder`: Placeholder text for the input.
 * - `variant`: Variant style of the input component.
 * - `helperText`: Text providing additional context or instructions for the user.
 * - `extraProps`: Additional properties to be spread onto the TextField component.
 *
 * @param {Object} props - The props object.
 * @param {Object} props.field - Contains configuration and options for the input field.
 * @param {*} props.value - The current value of the input field.
 * @param {string} [props.error] - Error message text to indicate input validation errors.
 * @param {Function} props.handleOnChange - Callback function to handle changes in the input field.
 * @param {Function} props.handleOnBlur - Callback function to handle when the input field loses focus.
 * @param {Function} props.handleSetRef - Callback function to set a reference to the input element.
 * @returns {JSX.Element} The rendered input text component.
 */
export const InputText: FC<InputPropsComponent> = memo(
  ({
     field,
     value,
     error,
     handleOnChange,
     handleOnBlur,
     handleSetRef
   }) => {

    const {
      required,
      size,
      disabled,
      placeholder,
      variant,
      helperText,
      extraProps = {}
    } = field?.options ?? {};

    const ref = useRef<RefObject<any>>(null);

    useEffect(() => {
      if (ref.current) {
        handleSetRef(ref);
      }
    }, []);

    return (
      <FormControl error={!!error} fullWidth>
        <TextField
          ref={ref as any}
          type={field.type}
          error={!!error}
          id={field.id}
          value={value ?? ''}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
          required={required}
          disabled={disabled}
          label={field.label}
          size={size || 'small'}
          placeholder={placeholder}
          variant={variant}
          multiline={field.type === FieldType.TEXTAREA}
          helperText={error || helperText}
          {...extraProps}
        />
      </FormControl>
    )
  });
