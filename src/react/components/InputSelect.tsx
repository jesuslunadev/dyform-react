import React, {FC, memo, RefObject, useContext, useEffect, useRef} from "react";
import {CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select} from "@mui/material";
import {FieldChoice, InputPropsComponent} from "../../common/types";
import {FormContext} from "../context";

/**
 * InputSelect is a functional component that renders a select input field with various custom configurations.
 * It is memoized for performance optimization and uses Material-UI components.
 *
 * @param {Object} props - The props used to configure the InputSelect component.
 * @param {Object} props.field - Contains definitions for the select input's behavior and appearance.
 * @param {any} props.value - The current value of the select input.
 * @param {string|null} props.error - An error message string if the select input has validation errors.
 * @param {Function} props.handleOnChange - A callback function to be executed when the value of the select input changes.
 * @param {Function} props.handleOnBlur - A callback function that triggers on the onBlur event of the select input.
 * @param {Function} props.handleSetRef - A function to set the reference of the select input.
 * @param {Array} props.choicesList - An array of choice objects to populate the select input options.
 * @param {boolean} props.errorGettingChoices - A flag indicating if there was an error fetching choices for the input.
 * @param {boolean} props.fieldLoading - Displays a loading indicator if choices are being fetched.
 * @returns {JSX.Element} A React component that renders a stylized select input with label, options, and error handling capabilities.
 */
export const InputSelect: FC<InputPropsComponent> = memo((
  {
    field,
    value,
    error,
    handleOnChange,
    handleOnBlur,
    handleSetRef,
    choicesList,
    errorGettingChoices,
    fieldLoading,
  }) => {

  const {
    helperText: helperTextProp = null,
    size,
    variant,
    disabled = false,
    required = false,
    labelAsTypography,
    placeholder,
    extraProps = {},
  } = field?.options ?? {};

  const {
    state: {formIsReadOnly}
  } = useContext(FormContext);

  const ref = useRef<RefObject<any>>(null);


  useEffect(() => {
    if (ref.current) {
      handleSetRef(ref);
    }
  }, [ref]);

  const helperTextSx = !!error || errorGettingChoices
    ? {color: 'error !important'} : {};

  const slotProps = {
    input: {readOnly: formIsReadOnly}
  }

  const loadingEndAdornment = <CircularProgress sx={{marginLeft: '-80px'}} color="inherit" size={20}/>

  return (
    <FormControl error={!!error || errorGettingChoices} variant={variant} fullWidth>
      {!labelAsTypography && (
        <InputLabel id={`${field.id}_label`}>{field.label}</InputLabel>
      )}
      <Select
        ref={ref as any}
        labelId={`${field.id}_label`}
        id={field.id}
        onChange={(e) => {
          handleOnChange(e as any);
        }}
        value={value ?? ''}
        endAdornment={
          <React.Fragment>
            {fieldLoading ? loadingEndAdornment : null}
          </React.Fragment>
        }
        onBlur={handleOnBlur}
        required={required}
        disabled={disabled || fieldLoading || errorGettingChoices}
        label={field.label}
        size={size || 'small'}
        placeholder={placeholder}
        variant={variant}
        {...extraProps}
        slotProps={slotProps}
      >
        {choicesList &&
          choicesList.map((option: FieldChoice) => (
            <MenuItem key={option.key} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
      </Select>
      <FormHelperText sx={helperTextSx}>
        {error ?? helperTextProp}
      </FormHelperText>
    </FormControl>
  )
});
