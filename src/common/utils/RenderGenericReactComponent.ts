import {isValidComponent} from "./IsValidComponent";
import React from "react";

/**
 * Renders a generic React component if it is valid and available.
 *
 * This function takes a React component as an argument and attempts to render it.
 * It performs several checks to ensure that the component is valid before attempting
 * to render it. If the component is non-existent or invalid, the function will return null.
 *
 * @param {any} component - The React component to be rendered. This can be any valid React
 * component or element.
 * @returns {React.ReactElement | null} - Returns the rendered React element if valid,
 * otherwise returns null.
 */
export const renderGenericReactComponent = (component: any) => {
  if (!component) {
    return null;
  }

  if (!isValidComponent(component)) {
    return null;
  }

  try {
    const Component = React.createElement(component);
    if (React.isValidElement(Component)) {
      return Component;
    }

    return null;
  } catch (e) {
    return null;
  }
}
