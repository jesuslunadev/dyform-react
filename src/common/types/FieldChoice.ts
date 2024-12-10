/**
 * Represents an option or choice in a field, typically used in form controls like dropdowns or radio buttons.
 *
 * @interface FieldChoice
 * @property {string} label - The display text for the choice, which is typically shown to the user.
 * @property {any} value - The internal value associated with the choice, which is submitted or processed.
 * @property {string} key - A unique identifier for the choice, often used as a reference in selection logic.
 */
export interface FieldChoice {
  label: string;
  value: any;
  key: string;
}
