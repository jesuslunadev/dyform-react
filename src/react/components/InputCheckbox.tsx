import React, {FC, memo, useRef, RefObject, useEffect, ReactElement} from "react";
import {FormControl, FormControlLabel, FormHelperText} from "@mui/material";
import {InputPropsComponent} from "../../common/types";


interface InputCheckboxProps extends InputPropsComponent {
  control: ReactElement;
}

/**
 * InputCheckbox is a functional component wrapped in `memo` that represents a customizable
 * checkbox input element. It integrates with form management systems and provides
 * functionalities for validation, change detection, and accessibility enhancements.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.field - Configuration for the checkbox field.
 * @param {boolean} props.value - The checked state of the checkbox.
 * @param {string} [props.error] - Optional error message associated with the checkbox.
 * @param {Function} props.handleOnChange - Callback to handle change events.
 * @param {Function} props.handleOnBlur - Callback to handle blur events.
 * @param {Function} props.handleSetRef - Function to set the reference for the checkbox.
 * @param {React.ReactElement} props.control - The control element to be cloned and rendered.
 *
 * This component utilizes useEffect to execute side-effects after rendering, such as setting the input reference.
 * The useRef hook is used to persist a mutable ref object throughout the component lifecycle.
 * The component also provides a streamlined interface for managing common form states and behaviors
 * such as 'disabled', 'required', and 'helperText'.
 */
export const InputCheckbox: FC<InputCheckboxProps> = memo(
  ({
     field,
     value,
     error,
     handleOnChange,
     handleOnBlur,
     handleSetRef,
     control
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
    }, [ref]);

    return (
      <FormControl error={!!error} variant={variant} fullWidth>

        <FormControlLabel
          id={field.id}
          ref={ref as any}
          disabled={disabled}
          required={required}
          control={
            React.cloneElement(control, {
              checked: typeof value === 'boolean' ? value : false,
              onChange: (e: any) => {
                handleOnChange({ target: { value: e.target.checked } });
              },
              onBlur: handleOnBlur,
            })
          }
          label={field.label}
        />

        {helperText || error && <FormHelperText>{error ?? helperText}</FormHelperText>}
      </FormControl>
    )
  });
