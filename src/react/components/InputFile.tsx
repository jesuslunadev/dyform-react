import React, {FC, memo, useRef, useEffect} from "react";
import {FormControl, TextField, Typography} from "@mui/material";
import {InputPropsComponent} from "../../common/types";

/**
 * InputFile is a functional component that provides a file input field
 * utilizing Material-UI's TextField and FormControl components. It supports
 * multiple files, file type validation, and custom input configurations.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.field - An object containing field configuration options.
 * @param {string} props.value - The current value of the input field.
 * @param {string} [props.error] - Error message to display when validation fails.
 * @param {Function} props.handleOnChange - Callback function fired when the input value changes.
 * @param {Function} props.handleOnBlur - Callback function fired when the input field loses focus.
 * @param {Function} props.handleSetRef - Callback function to set the ref of the input element.
 */
export const InputFile: FC<InputPropsComponent> = memo(
  ({
     field,
     value,
     error,
     handleOnChange,
     handleOnBlur,
     handleSetRef,
   }) => {
    const {
      required,
      size,
      disabled,
      placeholder,
      variant,
      helperText,
      extraProps = {},
      fileMultiple = false,
      fileShowAccepts = true,
      fileAccepts = [],
    } = field?.options ?? {};

    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (ref.current) {
        handleSetRef(ref);
      }
    }, [handleSetRef]);

    const fileAcceptsCleaned = Array.from(
      new Set(fileAccepts.map((accept) => accept.replace('image/', '')))
    );

    const handleOnChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = fileMultiple
        ? event.target.files : event.target.files?.[0];

      if (fileAcceptsCleaned.length) {
        const file = newValue as File;
        const isValid = fileAcceptsCleaned.some((accept) =>
          file.type.includes(accept)
        );

        if (!isValid) {
          if (ref.current) {
            ref.current.value = '';
          }
          alert('Invalid file type');
          return handleOnChange({target: {value: null}} as any);
        }
      }

      handleOnChange({target: {value: newValue}} as any);
    }

    return (
      <FormControl error={!!error} fullWidth>



        <TextField
          inputRef={ref}
          type={field.type}
          error={!!error}
          id={field.id}
          onChange={handleOnChangeFile}
          onBlur={handleOnBlur}
          required={required}
          disabled={disabled}
          size={size || "small"}
          placeholder={placeholder}
          variant={variant}
          helperText={error || helperText}
          slotProps={{
            htmlInput: {
              accept: fileAccepts.join(', '),
              multiple: fileMultiple,
            }
          }}
          {...extraProps}
        />
        {fileAcceptsCleaned.length > 0 && fileShowAccepts && (
          <Typography
            variant={'caption'}
            sx={{display: 'flex', justifyContent:'right', marginTop:'5px', color:'gray'}}>
            {fileAcceptsCleaned.join(', ')}
          </Typography>
        )}
      </FormControl>
    );
  }
);
