declare function getPlaceholder(menu: HTMLSelectElement, selectedOption: HTMLOptionElement | HTMLOptionElement[], selectPlaceholder: string | null, classPlaceholder: string): string;
declare function getOptionString(selectedOption: HTMLOptionElement[]): string;
/**
 * @name getFilterConditions
 * @param selectedOptions
 * @param option
 * @param value
 * @description
 * Since two different data types `string|string[]` was consider for the selected option
 * conditional statement was use. if the `selectedOptions` is a string, check each of the options' value
 * is not equal to selectedOptions
 * else if it is array of string `string[]` or empty array [] then check if each of the options' value is not
 * included
 */
declare function getFilterConditions(selectedOptions: string | string[], option: HTMLOptionElement, value: string): boolean;
/**
 * @name checkMultipleAttr
 * @param menu
 * @description
 * Check if the select element has multiple attribute or not
 * if it has return `true`
 * else return `false`
 */
declare function checkMultipleAttr(menu: HTMLSelectElement): boolean;
/**
 * @name getSelectedOptions
 * @param menu
 * @description
 * Considering selected options of both select with multiple attribute and the select without
 * if select has mulitple attribute then the selected option will be array of the value i.e `string[]`
 * else if the selected ooption is empty return `[]`
 * if the select does not have multiple attribute the value will be a `string`
 */
declare function getSelectedOptions(menu: HTMLSelectElement): string | string[];
declare function eventOnDocumentElmOnly(e: Event): void;
declare function generateID(): string;
declare function getCurrentSelect(targetElem: HTMLElement): HTMLElement;
declare function getCurrentSelectElement(selectID: string): HTMLSelectElement;
declare function generateCustomMenuItems(option: HTMLOptionElement): string;
declare function testGenerateCustomMenuItems(option: HTMLOptionElement): string;
export { getPlaceholder, getOptionString, getFilterConditions, getSelectedOptions, checkMultipleAttr, generateID, eventOnDocumentElmOnly, getCurrentSelect, getCurrentSelectElement, generateCustomMenuItems, testGenerateCustomMenuItems };
