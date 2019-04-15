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
    private callCreatemenu;
    private getIds;
    private generateCustomMenu;
    private prepareOptions;
    private intanceCallMenthod;
    private getSelectOption;
    private getElsePlaceholder;
    private setParentWidthIfActive;
    private setParentWidth;
    private getMenuItems;
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
    private selectElementEventListener;
    private addClickEventToCloseButton;
    private setPlaceholderWhenEmpty;
    private addRemoveActiveClass;
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
    /**
     * @name addSearchableEvent
     * @param selectID
     */
    private addSearchableEvent;
    private rerenderMenuList;
}
interface IConfig {
    placeholder?: string;
    parentWidthActive?: boolean;
    parentWidth?: string;
}
export {};
