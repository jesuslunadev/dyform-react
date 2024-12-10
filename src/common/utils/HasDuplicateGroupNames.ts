import {FormGroup} from "../types";
import {LogsMessages} from "../constants";

/**
 * Checks if there are duplicate group names in the provided groups.
 * @param groups The groups to check.
 * @returns True if there are duplicate group names, false otherwise.
 */
export const hasDuplicateGroupNames = (groups: FormGroup[]) => {
  const nameCounts: Record<string, number> = {};
  groups.forEach((group) => {
    nameCounts[group.name] = (nameCounts[group.name] || 0) + 1;
  });

  const duplicates = Object.keys(nameCounts).filter((key) => nameCounts[key] > 1);
  if (duplicates.length > 0) {
    const msg = LogsMessages.duplicateGroupNames;
    console.error(msg.replace('$names', duplicates.join(', ')));
  }
};
