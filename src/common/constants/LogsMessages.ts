/**
 * Log messages.
 * @constant
 */
export const LogsMessages: {
  duplicateFieldNames: string;
  duplicateGroupNames: string;
  isArraySimpleFieldsCount: string;
} = {
  duplicateFieldNames: `Duplicate field names detected: "$names". \n If interactions between fields (dependencies and conditionals) have been defined in the schema, they will not work until unique field names are specified`,
  duplicateGroupNames: `Duplicate group names detected: "$names". \n Each group of fields defines a context space. Some features will not work unless a unique name is assigned to each group.`,
  isArraySimpleFieldsCount: `You cannot set the isArraySimple property to true when there is more than one field defined.`
}
