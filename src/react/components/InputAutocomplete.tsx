import {FC, memo, RefObject, useContext, useEffect, useRef} from "react";
import {
  Autocomplete, AutocompleteRenderInputParams, CircularProgress,
  FormControl,
  FormHelperText,
  TextField
} from "@mui/material";
import {FieldChoice, InputPropsComponent} from "../../common/types";
import React from "react";
import {FormContext} from "../context";

/**
 * InputAutocomplete is a React functional component designed to render an
 * autocomplete input field within a form. It utilizes Material-UI components
 * and provides an interface for user to select from a list of choices with
 * the support for various customization options.
 * @component
 * @param {InputPropsComponent} props - The input component properties.
 * @returns {JSX.Element} The rendered autocomplete input field component.
 */
export const InputAutocomplete: FC<InputPropsComponent> = memo((
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
    helperText,
    size,
    variant,
    disabled = false,
    required = false,
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

  const loadingEndAdornment = <CircularProgress sx={{marginTop: '-15px'}} color="inherit" size={20}/>

  return (
    <FormControl error={!!error || errorGettingChoices} variant={variant} fullWidth>
      <Autocomplete
        ref={ref as any}
        size={size || 'small'}
        id={field.id}
        isOptionEqualToValue={(option, value) => {
          return option.value === value.value;
        }}
        value={(choicesList || []).find(option => option.value === value) ?? null}
        loading={fieldLoading}
        disabled={disabled || errorGettingChoices || fieldLoading}
        options={choicesList || []}
        readOnly={formIsReadOnly}
        getOptionLabel={(option: FieldChoice) => option?.label ?? ''}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <TextField
            error={!!error || errorGettingChoices}
            variant={variant}
            required={required}
            label={field.label}
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {fieldLoading ? loadingEndAdornment : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              },
            }}
            {...extraProps}
            {...params}
          />
        )}
        onChange={(event, newValue) => {
          handleOnChange({target: {value: newValue?.value}});
        }}
        onBlur={handleOnBlur}
      />
      <FormHelperText sx={helperTextSx}>
        {error ?? helperText}
      </FormHelperText>
    </FormControl>
  )
});
