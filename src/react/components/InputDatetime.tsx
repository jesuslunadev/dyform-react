import React, {FC, memo, useRef, RefObject, useEffect, useState, useContext} from "react";
import { FormControl } from "@mui/material";
import { InputPropsComponent } from "../../common/types";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import {FormContext} from "../context";

/**
 * InputDatetime is a memoized functional component that renders a date-time picker input field.
 *
 * This component uses the `Dayjs` library to handle date and time manipulations. It is wrapped with
 * `memo` to avoid unnecessary re-renders when the props have not changed. The component supports various
 * configurations through the `field` prop and manages its internal state for the date-time value.
 *
 * Props:
 * @param {Object} field - An object representing the configuration options for the input component.
 * @param {string} field.label - The label for the DateTimePicker.
 * @param {string} field.id - A unique identifier for the input field.
 * @param {Object} field.options - Additional options to configure the field.
 * @param {boolean} required - Specifies if the input is required.
 * @param {string} variant - Specifies the variant of the input field.
 * @param {string} placeholder - Placeholder text for the input field.
 * @param {string} size - Specifies the size of the input field.
 * @param {boolean} disabled - Specifies if the input is disabled.
 * @param {string} helperText - Helper text to display below the input.
 * @param {Object} extraProps - Additional properties to pass to the DateTimePicker component.
 *
 * @param {Dayjs | null} value - The initial value for the date-time picker.
 * @param {boolean} error - Indicates if there's an error state for the input field.
 * @param {function} handleOnChange - Callback function triggered when the input value changes.
 * @param {function} handleOnBlur - Callback function triggered when the input field loses focus.
 * @param {function} handleSetRef - Callback function to set the reference of the input field.
 *
 * Local State:
 * @param {Dayjs | null} localValue - The local state for managing the current date and time value.
 *
 * Effects:
 * useEffect is used to set the reference of the input field using the `handleSetRef` callback.
 */
export const InputDatetime: FC<InputPropsComponent> = memo(
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
      variant,
      placeholder,
      size,
      disabled,
      helperText,
      extraProps = {}
    } = field?.options ?? {};

    const {
      state: {formIsReadOnly}
    } = useContext(FormContext);

    const ref = useRef<RefObject<any>>(null);

    const [localValue, setLocalValue] = useState<Dayjs | null>(
      value ? dayjs(value) : null
    );

    useEffect(() => {
      if (ref.current) {
        handleSetRef(ref);
      }
    }, []);

    const handleLocalChange = (newValue: Dayjs | null) => {
      setLocalValue(newValue);
      if (handleOnChange) {
        handleOnChange({target: {value: newValue?.toISOString()}});
      }
    };

    return (
      <FormControl error={!!error} fullWidth>
        <DateTimePicker
          ref={ref as any}
          value={localValue}
          onChange={handleLocalChange}
          disabled={disabled}
          label={field.label}
          {...extraProps}
          slotProps={{
            textField: {
              id: field.id,
              required: required,
              error: !!error,
              variant: variant,
              size: size,
              placeholder: placeholder,
              helperText: error || helperText,
              inputProps: {
                readOnly: formIsReadOnly
              }
            }
          }}
        />
        {helperText && <p>{helperText}</p>}
      </FormControl>
    );
  }
);
