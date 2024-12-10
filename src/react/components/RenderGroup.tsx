import {ArrayOfFieldsChange, ContextActionType, FormButton, FormGroup} from "../../common/types";
import React, {
  FC,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Button,
  ButtonProps,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {RenderField} from "./RenderField";
import {hasDuplicateFieldNames, renderGenericReactComponent} from "../../common/utils";
import {GroupComponent} from "./GroupComponent";
import {RenderArrayFieldsGroup} from "./RenderArrayFieldsGroup";
import {Add} from "@mui/icons-material";
import {FormContext} from "../context";
import {LogsMessages} from "../../common/constants";
import {cloneDeep, set, get} from "lodash";

/**
 * RenderGroup is a React functional component that renders groups of form fields.
 * It handles both simple and grouped array forms, providing dynamic add/remove functionalities.
 *
 * Properties of the `group` object:
 *
 * @property {boolean} [isArrayOfFields] - Indicates if the group is an array of fields.
 * @property {Array<Field>} fields - Fields to be rendered within the group.
 * @property {ArrayOfFieldsOptions} [arrayOfFieldsOptions] - Configuration options when dealing with arrays of fields.
 *
 * Functionality:
 * - Renders either a static group of fields or a dynamic array of fields based on `isArrayOfFields`.
 * - Initializes the form model based on the array configuration.
 * - Provides functionality to add and remove items when dealing with arrays.
 * - Manages the array indices and maintains form state consistency.
 *
 * Internal hooks:
 * - `useState` hooks to manage total items, deleted indices, and initial values of the array.
 * - `useEffect` hook to check for duplicate field names and initialize form models on mount.
 * - `useCallback` for memorizing handlers for adding and removing items, changing array fields.
 *
 * Rendering:
 * - Returns fields wrapped inside a `GroupComponent` with options for spacing.
 * - When fields are arrays, renders add and remove buttons with conditions on visibility and interactivity.
 *
 * @param {Object} params
 * @param {FormGroup} params.group - The group configuration object.
 */
export const RenderGroup: FC<{ group: FormGroup }> = React.memo(({group}) => {
    const {
      state: contextState = null,
      dispatch: contextDispatch = null
    } = useContext(FormContext) ?? {};

    const {
      isArrayOfFields = false,
      fields,
      arrayOfFieldsOptions,
    } = group;

    const {
      modelPath,
      isArraySimple = false,
      canAdd = true,
      canRemove = true,
      addBtn = null,
      removeBtn = null,
      maxItems = null,
      minItems = null,
    } = arrayOfFieldsOptions ?? {};

    const [totalItems, setTotalItems] = useState(0);
    const [deletedIndices, setDeletedIndices] = useState<Set<number>>(new Set());
    const [arrayInitialValues, setArrayInitialValues] = useState<any[]>([]);

    useEffect(() => {
      hasDuplicateFieldNames(fields);
    }, [fields]);

    useEffect(() => {
      if (!isArrayOfFields || !contextState?.formModel) return;

      const newFormModel = cloneDeep(contextState.formModel);
      const groupName = modelPath ?? group.name;
      let initialCount = minItems ?? 1;


      let initialValues;

      if (modelPath) {
        initialValues = get(contextState?.formModel, modelPath);
        if (Array.isArray(initialValues)) {
          initialCount = initialValues.length;
          setArrayInitialValues(initialValues);
        } else {
          initialValues = null;
        }
      }

      if (isArraySimple) {

        const initialArray = initialValues ?? Array(initialCount).fill(null);
        set(newFormModel, groupName, initialArray);

      } else {
        const initialArray = Array.from({length: initialCount}, () => {
          const groupObject: any = {};
          fields.forEach(field => {
            const fieldPath = field.modelPath ?? field.name;
            groupObject[fieldPath] = null;
          });
          return groupObject;
        });
        set(newFormModel, groupName, initialArray);
      }

      setTotalItems(initialCount);
      setDeletedIndices(new Set());

      contextDispatch({
        type: ContextActionType.UpdateFormModel,
        payload: newFormModel
      });
    }, []);

    const getVisibleItemsCount = useCallback(() => {
      return totalItems - deletedIndices.size;
    }, [totalItems, deletedIndices]);

    const isAddBtnDisabled = useCallback(() => {
      return maxItems ? getVisibleItemsCount() >= maxItems : false;
    }, [maxItems, getVisibleItemsCount]);

    const handleAddItems = useCallback(() => {
      const newFormModel = cloneDeep(contextState?.formModel);
      const groupName = modelPath ?? group.name;
      const currentArray = get(newFormModel, groupName) || [];

      if (isArraySimple) {
        currentArray.push(null);
      } else {
        const newObject: any = {};
        fields.forEach(field => {
          const fieldPath = field.modelPath ?? field.name;
          newObject[fieldPath] = null;
        });
        currentArray.push(newObject);
      }

      set(newFormModel, groupName, currentArray);
      setTotalItems(prev => prev + 1);

      contextDispatch({
        type: ContextActionType.UpdateFormModel,
        payload: newFormModel
      });
    }, [
      contextState?.formModel,
      modelPath,
      group.name,
      fields,
      isArraySimple
    ]);

    const handleRemoveGroup = useCallback((indexToRemove: number) => {
      if (getVisibleItemsCount() <= (minItems ?? 1)) return;

      const newDeletedIndices = new Set(deletedIndices);
      newDeletedIndices.add(indexToRemove);
      setDeletedIndices(newDeletedIndices);

      const newFormModel = cloneDeep(contextState?.formModel);
      const arrayPath = modelPath ?? group.name;
      const currentArray = get(newFormModel, arrayPath);

      if (Array.isArray(currentArray)) {
        currentArray.splice(indexToRemove, 1);
        set(newFormModel, arrayPath, currentArray);

        contextDispatch({
          type: ContextActionType.UpdateFormModel,
          payload: newFormModel
        });
      }

      contextState?.fields.filter(field => fields.some(
          groupField => groupField.name === field.name
            && field.useField.parentIndex === indexToRemove
        )
      ).forEach(field =>
        contextDispatch({
          type: ContextActionType.RemoveField,
          payload: field.id
        })
      );

    }, [
      getVisibleItemsCount,
      minItems,
      deletedIndices,
      contextState?.formModel,
      modelPath,
      group.name
    ]);

    const handleArrayOfFieldsChange: ArrayOfFieldsChange = useCallback((field, value, indexGroup) => {

      let setToPath = `${modelPath ?? group.name}[${indexGroup}]`;
      const formModel = contextState?.formModel

      if (isArraySimple) {
        if (fields.length > 1) {
          console.error(LogsMessages.isArraySimpleFieldsCount);
          return;
        }
        set(formModel, setToPath, value);
      } else {
        setToPath += `.${field.props.modelPath ?? field.props.name}`;
        set(formModel, setToPath, value);
      }

      contextDispatch({
        type: ContextActionType.UpdateFormModel,
        payload: formModel
      });

    }, [
      contextState?.formModel,
      modelPath,
      group.name,
      fields,
      isArraySimple
    ]);

    const renderAddButton = (): ReactElement => {
      if (React.isValidElement(addBtn)) {
        return React.cloneElement(addBtn as ReactElement<ButtonProps>, {
          onClick: handleAddItems,
          disabled: isAddBtnDisabled(),
        });
      }

      if (addBtn && typeof addBtn === 'object') {
        const {
          label,
          variant = 'contained',
          color = 'primary',
          size = 'small',
          sx = {},
          startIcon: StartIcon,
          endIcon: EndIcon,
        } = addBtn as FormButton;

        return (
          <Button
            startIcon={renderGenericReactComponent(StartIcon)}
            endIcon={renderGenericReactComponent(EndIcon)}
            onClick={handleAddItems}
            disabled={isAddBtnDisabled()}
            variant={variant}
            size={size}
            color={color}
            sx={sx}>
            {label}
          </Button>
        );
      }

      return (
        <Button
          size={'small'}
          startIcon={<Add/>}
          onClick={handleAddItems}
          disabled={isAddBtnDisabled()}
          variant="text"
          color="success">
          Add item
        </Button>
      );
    };


    return (
      <GroupComponent props={group}>
        <Grid container spacing={2} sx={{mt: 4}}>
          {!isArrayOfFields ? (
            fields.map((field, index) => (
              <RenderField
                key={`${field.name}_${index}`}
                field={field}
                parentGroupIsArray={false}
              />
            ))
          ) : (
            <Grid size={12}>
              {Array.from({length: totalItems})
                .map((_, index) => !deletedIndices.has(index) && (
                  <RenderArrayFieldsGroup
                    key={`arr_field_group_${index}`}
                    fields={fields}
                    index={index}
                    removeBtn={removeBtn}
                    onRemove={handleRemoveGroup}
                    canRemove={canRemove}
                    minItems={minItems}
                    initialValues={arrayInitialValues}
                    isArraySimple={isArraySimple}
                    handleArrayOfFieldsChange={handleArrayOfFieldsChange}
                  />
                ))
                .filter(Boolean)}
            </Grid>
          )}
        </Grid>
        {isArrayOfFields && canAdd && (
          <Divider flexItem textAlign={'right'} variant={'middle'} sx={{mt: 4}}>
            {renderAddButton()}
          </Divider>
        )}
      </GroupComponent>
    );
  },
  (prevProps, nextProps) => prevProps.group === nextProps.group
);
