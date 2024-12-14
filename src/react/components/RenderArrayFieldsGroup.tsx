import React, {Fragment, memo, ReactElement, useContext} from "react";
import {ArrayOfFieldsChange, Field, FormButton} from "../../common/types";
import {Button, ButtonProps, Divider} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {RenderField} from "./RenderField.js";
import {renderGenericReactComponent} from "../../common/utils";
import {FormContext} from "../context";

type RenderArrayFieldsGroupProps = {
  fields: Field[];
  index: number;
  onRemove: (index: number) => void;
  canRemove: boolean;
  removeBtn: ReactElement | FormButton | null;
  minItems: number | null;
  handleArrayOfFieldsChange: ArrayOfFieldsChange;
  initialValues: any[];
  isArraySimple: boolean;
}

const DEFAULT_MIN_ITEMS = 1;

/**
 * A function that creates a default button component with specified properties.
 *
 * @param {number} index - The index used for identifying the button and displaying its order in the label.
 * @param {function(number): void} onRemove - A callback function invoked when the button is clicked, receiving the button's index as an argument.
 * @param {boolean} isDisabled - A boolean indicating whether the button is disabled.
 * @returns {ReactElement} A JSX button element.
 */
const createDefaultButton = (index: number, onRemove: (index: number) => void, isDisabled: boolean): ReactElement => (
  <Button
    size="small"
    onClick={() => onRemove(index)}
    disabled={isDisabled}
    variant="text"
    color="error"
  >
    Remove item #{index + 1}
  </Button>
);

/**
 * Creates a custom button component based on the provided configuration.
 *
 * @param {FormButton} removeBtn - An object containing properties to define the button appearance and functionality.
 * @param {number} index - The index to be used when invoking the onRemove callback.
 * @param {function} onRemove - A callback function to be executed upon button click, receiving the index as an argument.
 * @param {boolean} isDisabled - A boolean indicating whether the button should be disabled.
 * @returns {ReactElement} A button component constructed with the specified attributes.
 */
const createCustomButton = (
  removeBtn: FormButton,
  index: number,
  onRemove: (index: number) => void,
  isDisabled: boolean
): ReactElement => {
  const {
    label,
    variant = 'contained',
    color = 'primary',
    size = 'small',
    sx = {},
    startIcon: StartIcon,
    endIcon: EndIcon,
  } = removeBtn;

  return (
    <Button
      size={size}
      startIcon={renderGenericReactComponent(StartIcon)}
      endIcon={renderGenericReactComponent(EndIcon)}
      onClick={() => onRemove(index)}
      disabled={isDisabled}
      variant={variant}
      color={color}
      sx={sx}
    >
      {label}
    </Button>
  );
};


/**
 * A memoized functional component that renders a group of form fields within an array structure.
 * It handles displaying and managing multiple fields grouped together, often used in form scenarios
 * where dynamic addition and removal of field groups is required.
 *
 * @param {RenderArrayFieldsGroupProps} props - The properties required to render the array fields group.
 * @property {Array<Field>} props.fields - The array of field configurations to be rendered.
 * @property {number} props.index - The index position of the current group within the array of field groups.
 * @property {Function} props.onRemove - Callback function to be invoked when the remove button is clicked.
 * @property {boolean} props.canRemove - Flag indicating whether the current group can be removed.
 * @property {ReactElement|FormButton} props.removeBtn - Custom remove button component or configuration object.
 * @property {number} props.minItems - The minimum number of items required in the field array.
 * @property {Function} props.handleArrayOfFieldsChange - Handler function for managing changes within the field array.
 * @property {Object} props.initialValues - Initial values for the fields, provided as an object keyed by index.
 * @property {boolean} props.isArraySimple - Flag indicating if the array is of simple types rather than complex objects.
 *
 * @returns {ReactElement} The rendered group of fields enclosed within a Fragment.
 */
export const RenderArrayFieldsGroup = memo((props: RenderArrayFieldsGroupProps) => {

  const {
    fields,
    index,
    onRemove,
    canRemove,
    removeBtn,
    minItems,
    handleArrayOfFieldsChange,
    initialValues,
    isArraySimple
  } = props;

  const {
    state: {formIsReadOnly, formIsDisabled}
  } = useContext(FormContext);

  const initialValuesByIndex = initialValues?.[index] ?? null;
  const isRemoveDisabled = !(index >= (minItems ?? DEFAULT_MIN_ITEMS));

  const getRemoveButton = (): ReactElement => {
    if (React.isValidElement(removeBtn)) {
      return React.cloneElement(removeBtn as ReactElement<ButtonProps>, {
        onClick: () => onRemove(index),
        disabled: isRemoveDisabled || formIsDisabled || formIsReadOnly,
      });
    }

    if (removeBtn && typeof removeBtn === 'object') {
      return createCustomButton(removeBtn as FormButton, index, onRemove, isRemoveDisabled);
    }

    return createDefaultButton(index, onRemove, isRemoveDisabled);
  };

  const getFieldWithInitialValue = (field: Field): Field => {
    if (!initialValuesByIndex) return field;

    const defaultValue = isArraySimple
      ? initialValuesByIndex
      : initialValuesByIndex[field.modelPath ?? field.name];

    return {
      ...field,
      options: {
        ...field.options,
        defaultValue
      }
    };
  };

  return (
    <Fragment>
      <Divider
        variant="middle"
        textAlign="right"
        flexItem
        sx={{mb: 4, mt: index > 0 ? 4 : 0}}
      >
        {canRemove && !isRemoveDisabled && getRemoveButton()}
      </Divider>

      <Grid container spacing={2}>
        {fields.map((field, fieldIndex) => (
          <RenderField
            key={`group_${index}_${field.name}_${fieldIndex}`}
            field={getFieldWithInitialValue(field)}
            parentGroupIsArray={true}
            parentGroupIndex={index}
            handleArrayOfFieldsChange={handleArrayOfFieldsChange}
          />
        ))}
      </Grid>
    </Fragment>
  );
});
