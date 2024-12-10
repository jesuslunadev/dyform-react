import {ArrayOfFieldsChange, ContextActionType, Field} from "../../common/types";
import React, {
  FC,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import {FieldType} from "../../common/enums";
import Grid from "@mui/material/Grid2";
import {Checkbox, Switch, Typography} from "@mui/material";
import {set} from "lodash";
import {FormContext} from "../context";
import {InputSelect} from "./InputSelect";
import {InputText} from "./InputText";
import {InputCheckbox} from "./InputCheckbox";
import {InputRadio} from "./InputRadio";
import {InputAutocomplete} from "./InputAutocomplete";
import {useField} from "../hooks";
import {InputFile} from "./InputFile";
import {InputDatetime} from "./InputDatetime";

interface RenderFieldProps {
  field: Field;
  parentGroupIsArray: boolean;
  parentGroupIndex?: number;
  handleArrayOfFieldsChange?: ArrayOfFieldsChange;
}

/**
 * RenderField is a functional component responsible for rendering various types of form fields
 * based on the field type specified in the props. It utilizes memoization to optimize re-renders.
 *
 * It supports the following functionalities:
 * - Conditional rendering of field components such as InputText, InputSelect, InputCheckbox, etc.,
 *   depending on the field type.
 * - Handles field interactions, including changes, blur events, and reference setting.
 * - Manages the display state of the field, including error handling and loading indicators.
 * - Can render within a grid layout and display a label as typography if specified.
 *
 * Properties:
 * - field: The field configuration object containing details such as field type, label, and validation.
 * - parentGroupIsArray: A boolean indicating if the parent group is an array.
 * - handleArrayOfFieldsChange: A function to handle changes in an array of fields.
 * - parentGroupIndex: The index of the field within the parent group, if applicable.
 */
export const RenderField: FC<RenderFieldProps> = React.memo(
  ({field, parentGroupIsArray, handleArrayOfFieldsChange, parentGroupIndex}) => {
    const {
      fieldProps,
      handleOnChange,
      handleOnBlur,
      handleSetRef,
      value,
      error,
      hidden,
      choicesList,
      errorGettingChoices,
      fieldLoading,
    } = useField(field, !parentGroupIsArray, handleArrayOfFieldsChange, parentGroupIndex);

    const fieldComponentProps = {
      field: fieldProps,
      value,
      error,
      handleSetRef,
      handleOnChange,
      handleOnBlur,
      choicesList,
      errorGettingChoices,
      fieldLoading,
    };

    const renderField = (): ReactElement => {
      switch (field.type) {
        case FieldType.TEXT:
        case FieldType.NUMBER:
        case FieldType.EMAIL:
        case FieldType.DATE:
        case FieldType.TIME:
        case FieldType.SECURE:
        case FieldType.COLOR:
        case FieldType.TEXTAREA:
          return <InputText {...fieldComponentProps} />;
        case FieldType.SELECT:
          return <InputSelect {...fieldComponentProps} />;
        case FieldType.CHECKBOX:
        case FieldType.SWITCH:
          const control =
            field.type === FieldType.SWITCH ? <Switch/> : <Checkbox/>;
          return <InputCheckbox {...fieldComponentProps} control={control}/>;
        case FieldType.RADIO:
          return <InputRadio {...fieldComponentProps} />;
        case FieldType.AUTOCOMPLETE:
          return <InputAutocomplete {...fieldComponentProps} />;
        case FieldType.FILE:
          return <InputFile {...fieldComponentProps} />;
        case FieldType.DATETIME:
          return <InputDatetime {...fieldComponentProps} />;
        default:
          return <></>;
      }
    };

    return (
      <>
        <Grid
          sx={{display: hidden ? "none" : "block"}}
          size={fieldProps?.options?.grid ?? 12}>
          {fieldProps?.options?.labelAsTypography && (
            <Typography
              sx={{color: error ? "error" : "inherit"}}
              marginBottom={field.type === FieldType.SELECT ? "18px" : "0"}
              variant={"inherit"}
            >
              {fieldProps.label} {fieldProps?.options?.required && "*"}
            </Typography>
          )}
          {renderField()}
        </Grid>
      </>
    );
  });
