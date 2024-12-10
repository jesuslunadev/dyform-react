import React, {FC, memo, useRef, RefObject, useEffect} from "react";
import {
  FormControl,
  FormControlLabel,
  FormHelperText, FormLabel, Radio,
  RadioGroup,
} from "@mui/material";
import {InputPropsComponent} from "../../common/types";

/**
 * InputRadio functional component renders a group of radio buttons based on provided choices.
 * It utilizes `memo` for performance optimization to avoid unnecessary re-renders.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.field - Field configuration options.
 * @param {string} props.value - The current selected value of the radio group.
 * @param {string} [props.error] - Error message to display in case of validation or data fetching issues.
 * @param {Function} props.handleOnChange - Callback function to handle changes in the selected radio button.
 * @param {Function} props.handleOnBlur - Callback function to handle blur events.
 * @param {Function} props.handleSetRef - Function to set the ref of the component.
 * @param {Array} props.choicesList - List of choices to be presented as radio buttons.
 * @param {boolean} [props.errorGettingChoices] - Indicates if there was an error retrieving choicesList.
 * @param {boolean} [props.fieldLoading] - Indicates whether the field data is still loading.
 *
 * @returns {JSX.Element} A set of radio buttons wrapped in a FormControl component with labels and helper text based on the props provided.
 */
export const InputRadio: FC<InputPropsComponent> = memo(
  ({
     field,
     value,
     error,
     handleOnChange,
     handleOnBlur,
     handleSetRef,
     choicesList,
     errorGettingChoices,
     fieldLoading
   }) => {


    const {
      helperText: helperTextProp = null,
      size,
      variant,
      disabled = false,
      required = false,
      labelAsTypography,
      extraProps = {},
    } = field?.options ?? {};

    const ref = useRef<RefObject<any>>(null);

    useEffect(() => {
      if (ref.current) {
        handleSetRef(ref);
      }
    }, []);

    const helperTextSx = !!error || errorGettingChoices
      ? {color: 'error.main', marginLeft: 0} : {};

    return (
      <FormControl error={!!error} variant={variant} fullWidth>
        {!labelAsTypography && (
          <FormLabel id={`${field.id}_label`}>
            {field.label} {required && '*'}
          </FormLabel>
        )}
        <RadioGroup
          row
          id={field.id}
          ref={ref as any}
          value={value ?? ''}
          onChange={handleOnChange}
          onBlur={handleOnBlur}>
          {!errorGettingChoices && choicesList?.map(
            (option, index) => (
              <FormControlLabel
                key={option.key}
                value={option.value}
                control={<Radio/>}
                label={option.label}
              />
            ))}
        </RadioGroup>
        <FormHelperText sx={helperTextSx}>
          {error ?? helperTextProp}
        </FormHelperText>
      </FormControl>
    )
  });
