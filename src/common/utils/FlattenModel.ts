type FlattenedResult = { modelPath: string; value: any };


/**
 * Recursively flattens a nested object into an array of key-value pairs,
 * where keys are represented in a dot notation reflecting the nesting structure.
 *
 * @param {Record<string, any>} obj - The object to be flattened.
 * @param {string} [parentKey=''] - The key of the parent object, used for constructing the dot notation path.
 * @param {FlattenedResult[]} [result=[]] - The accumulator array that stores flattened key-value pairs.
 * @returns {FlattenedResult[]} An array of objects, each containing the flattened key as `modelPath`
 * and the associated value.
 */
export const flattenModel = (
  obj: Record<string, any>,
  parentKey: string = '',
  result: FlattenedResult[] = []
): FlattenedResult[] => {
  for (const key in obj) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      flattenModel(obj[key], fullKey, result);
    } else {
      result.push({ modelPath: fullKey, value: obj[key] });
    }
  }
  return result;
};
