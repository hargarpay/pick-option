export default class PickOption {
    private placeholder;
    private parentWidthActive;
    private parentWidth;
    private arraySelectIDs;
    constructor(config?: IConfig);
    /**
     * @function createCustomMenu
     * @description grt all select elements that have pick-option as class and generate their custom dropdown
     */
    createCustomMenu(): void;
    testGenerateCustomMenuItems(option: HTMLOptionElement): string;
    private generateCustomMenu;
    private generateCustomMenuItems;
    /**
     * @name checkMultipleAttr
     * @param menu
     * @description
     * Check if the select element has multiple attribute or not
     * if it has return `true`
     * else return `false`
     */
    private checkMultipleAttr;
    /**
     * @name getSelectedOptions
     * @param menu
     * @description
     * Considering selected options of both select with multiple attribute and the select without
     * if select has mulitple attribute then the selected option will be array of the value i.e `string[]`
     * else if the selected ooption is empty return `[]`
     * if the select does not have multiple attribute the value will be a `string`
     */
    private getSelectedOptions;
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
    private getFilterConditions;
    /**
     * @name addScrollbar
     * @param selectID
     * @param onload
     * @description
     * Add scrollbar to the wrapper of the items if it can not contain all the items
     * Add toggle event for the show and hide items wrapper on the intial call
     * Add click event to each of the items
     */
    private addScrollbar;
    /**
     * @name eventListenerHandler
     * @param e
     * @param selectID
     * @description
     * Handle the click event of each of the options in the select
     * element
     */
    /**
     * Use when eventListener need to pass event to a named arrow function
     * private eventListenerHandler = (e: Event, selectID: string) => (event: Event): void => {
     */
    private eventListenerHandler;
    private getCurrentSelect;
    /**
     * @name addSearchableEvent
     * @param selectID
     */
    private addSearchableEvent;
    private getCurrentSelectElement;
    private rerenderMenuList;
}
interface IConfig {
    placeholder?: string;
    parentWidthActive?: boolean;
    parentWidth?: string;
}
export {};
