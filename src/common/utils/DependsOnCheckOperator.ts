/**
 * Check if the actual value matches the expected value based on the operator.
 * @param operator The operator to use.
 * @param actualValue The actual value to check.
 * @param valueExpected The expected value to compare against.
 * @returns True if the actual value matches the expected value, false otherwise.
 */
export const dependsOnCheckOperator = (operator: string, actualValue: any, valueExpected: any): boolean => {
  switch (operator) {
    case 'equals':
      return actualValue === valueExpected;
    case 'notEquals':
      return actualValue !== valueExpected;
    case 'in':
      return Array.isArray(valueExpected) && valueExpected.includes(actualValue);
    case 'notIn':
      return Array.isArray(valueExpected) && !valueExpected.includes(actualValue);
    case 'greaterThan':
      return actualValue > valueExpected;
    case 'lessThan':
      return actualValue < valueExpected;
    case 'contains':
      return typeof actualValue === 'string' && actualValue.includes(valueExpected);
    case 'notContains':
      return typeof actualValue === 'string' && !actualValue.includes(valueExpected);
    case 'startsWith':
      return typeof actualValue === 'string' && actualValue.startsWith(valueExpected);
    case 'endsWith':
      return typeof actualValue === 'string' && actualValue.endsWith(valueExpected);
    case 'matches':
      return new RegExp(valueExpected).test(actualValue);
    case 'notMatches':
      return !new RegExp(valueExpected).test(actualValue);
    default:
      console.warn(`[DependsOn] Unknown operator: ${operator}`)
      return false;
  }
}
