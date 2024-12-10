/**
 * Determines whether a given component is valid.
 *
 * This function checks whether the provided component has a valid structure
 * by ensuring that it possesses a `render` function within its type definition.
 *
 * @param {any} component - The component to validate.
 * @returns {boolean} Returns true if the component is valid, false otherwise.
 */
export const isValidComponent = (component: any): boolean => {
  const {
    render = null
  } = component?.type ?? {}

  return !(!component || !render || typeof render !== 'function');

};
