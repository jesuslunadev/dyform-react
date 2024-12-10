import {Field} from "../types";
import {LogsMessages} from "../constants";

/**
 * Checks if there are duplicate field names in the provided fields.
 * @param fields The fields to check.
 * @returns True if there are duplicate field names, false otherwise.
 */
export const hasDuplicateFieldNames = (fields: Field[]) => {
  const nameCounts: Record<string, number> = {};
  fields.forEach((field) => {
    nameCounts[field.name] = (nameCounts[field.name] || 0) + 1;
  });

  const duplicates = Object.keys(nameCounts).filter((key) => nameCounts[key] > 1);
  if (duplicates.length > 0) {
    const msg = LogsMessages.duplicateFieldNames;
    console.error(msg.replace('$names', duplicates.join(', ')));
  }
};
