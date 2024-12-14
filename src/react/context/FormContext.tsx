import React from "react";
import {ContextActionType, ContextType} from "../../common/types";


export const FormContext = React.createContext<ContextType>({} as ContextType);

/**
 * ContextReducer is a reducer function that manages the state of a form within an application. It handles various actions to update the form's state by modifying properties such as form model, fields, schema, and form status.
 *
 * @param {any} state - The current state of the form context.
 * @param {Object} action - An action object containing type and payload to perform state transitions.
 * @param {ContextActionType} action.type - The type of action that determines how the state should be updated.
 * @param {any} action.payload - The data needed to execute the updates as specified by the action type.
 *
 * @returns {any} The new state after applying the specified action.
 *
 * Actions handled by the ContextReducer include:
 * - UpdateFormModel: Updates the form model with new values.
 * - AddField: Adds a new field to the form if it doesn't already exist.
 * - UpdateField: Updates existing field attributes.
 * - RemoveField: Removes a field from the form by its identifier.
 * - SetSchema: Updates the form schema.
 * - SetFormIsDisabled: Sets the form's disabled status.
 * - SetFormIsReadOnly: Sets the form's read-only status.
 */
export const ContextReducer = (state: any, action: {
  type: ContextActionType;
  payload: any;
}): any => {
  switch (action.type) {
    case ContextActionType.UpdateFormModel:
      const newFormModel = Array.isArray(action.payload)
        ? [...action.payload]
        : typeof action.payload === 'object' && action.payload !== null
          ? { ...action.payload }
          : action.payload;
      return {
        ...state,
        formModel: newFormModel
      };
    case ContextActionType.AddField:
      if (!state.fields.find((field: any) => field.id === action.payload.id)) {

        const {name, ref, id, schema, useField, value = null, isDirty = false, isInvalid = false, error = false} = action.payload;

        return {
          ...state, fields: [...state.fields, {
            id,
            name,
            value,
            isDirty,
            ref,
            isInvalid,
            error,
            schema,
            useField
          }]
        };
      }
      return state;
    case ContextActionType.UpdateField:
      const {id, ...rest} = action.payload;
      const fieldIndex = state.fields.findIndex((field: any) => field.id === id);
      if (fieldIndex > -1) {
        state.fields[fieldIndex] = {...state.fields[fieldIndex], ...rest};
        return {...state, fields: [...state.fields]};
      }
      return state;
    case ContextActionType.RemoveField:
      const fieldId = action.payload;
      return {
        ...state,
        fields: state.fields.filter((field: any) => field.id !== fieldId)
      };
    case ContextActionType.SetSchema:
      return {...state, schema: action.payload};
    case ContextActionType.SetFormIsDisabled:
      return {...state, formIsDisabled: action.payload};
    case ContextActionType.SetFormIsReadOnly:
      return {...state, formIsReadOnly: action.payload};
    default:
      return state;
  }
}
