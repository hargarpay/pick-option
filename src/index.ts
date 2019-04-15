import * as utility  from "./helpers/pickoption";

export default class PickOption {
  private placeholder = 'Select';
  private parentWidthActive = false;
  private parentWidth = '100%';
  private arraySelectIDs: string[] = [];
  constructor(config: IConfig = {}) {
    this.placeholder = 'placeholder' in config ? (config.placeholder as string) : this.placeholder;
    this.parentWidthActive =
      'parentWidthActive' in config ? (config.parentWidthActive as boolean) : this.parentWidthActive;
    this.parentWidth = 'parentWidth' in config ? (config.parentWidth as string) : this.parentWidth;
    this.createCustomMenu();
  }
  /**
   * @function createCustomMenu
   * @description grt all select elements that have pick-option as class and generate their custom dropdown
   */
  public createCustomMenu() {
    // Get all select element with pick-option class
    const selectMenuDisplay = Array.from(document.querySelectorAll('select.pick-option')) as HTMLSelectElement[];
    if (selectMenuDisplay) {
      this.callCreatemenu(selectMenuDisplay);
    }
  }

  private callCreatemenu(selectMenuDisplay: HTMLSelectElement[]){
    // Close all custom dropdown when click outside;
    (document as Document).addEventListener('click', e => {
      /**
       * Check if select-menu and select-item are closest
       * to the event target else closes all drop down
       */
      utility.eventOnDocumentElmOnly(e);
    });
    // Use for...of loop to run through each of the element
    for (const menu of selectMenuDisplay) {
      // Get all option elements of the current select element
      const menuOptions = Array.from(menu.querySelectorAll('option')) as HTMLOptionElement[];
      /**
       * Check if the current select element has id
       * if it has id get the id
       * if it does not have generate a unique id
       * if two select element has the same id
       * generate a new id for the second element
       * and append character a to the generate id
       * because some generate id might start with number
       * which is an invalid variable
       */
      let selectID = menu.getAttribute('id') || ''; // Check if the select element has id attribute
      selectID = this.getIds(selectID);
      this.arraySelectIDs.push(selectID);

      // Generate the custom select
      this.generateCustomMenu(menu, menuOptions, selectID, '', true);
    }
  }

  private getIds(id: string): string{
    let selectID: string = id;
    if (this.arraySelectIDs.indexOf(selectID) === -1) {
      selectID = selectID === "" ? utility.generateID() : selectID;
    } else {
      selectID = utility.generateID()
    }
    return selectID;
  }

  // Create the custom menu and display it
  private async generateCustomMenu(
    menu: HTMLSelectElement,
    options: HTMLOptionElement[],
    selectID: string,
    value: string = '',
    onload = false,
  ): Promise<void> {
    const customMenuOptions = await this.prepareOptions(menu, options, value);
    const currentCustomSelect = (document as Document).querySelector(`div#${selectID} .select-item-options .wrapper`);
    if (currentCustomSelect) {
      (currentCustomSelect.parentNode as HTMLElement).removeChild(currentCustomSelect);
    }
    if (onload) {
      this.intanceCallMenthod(menu, selectID, customMenuOptions);
    } else {
      const selectItemOptions = (document as Document).querySelector(`div#${selectID} .select-item-options`) as HTMLElement;
      selectItemOptions.insertAdjacentHTML(
        'beforeend',`<div class="wrapper">${customMenuOptions}</div>`,
      );
    }
    this.addScrollbar(selectID, onload);
    if (onload) {
      this.addSearchableEvent(selectID);
    }
  }

  private prepareOptions(menu: HTMLSelectElement, options: HTMLOptionElement[],value: string = ''): Promise<string>{
    return new Promise((resolve, reject) => {
      let optionsList = '';
      // let numberOfLength: number;
      const currentSelectValue: string | string[] = utility.getSelectedOptions(menu);

      const newOptions = options.filter((option: HTMLOptionElement) =>
        utility.getFilterConditions(currentSelectValue, option, value));

      if (newOptions.length > 0) {
        optionsList = this.getMenuItems(newOptions);
        return resolve(optionsList)
      }
      
      return resolve(optionsList);
    });
  }

  private intanceCallMenthod(menu: HTMLSelectElement, selectID: string, customMenuOptions: string){
    const selectPlaceholder = menu.getAttribute('placeholder');
      const selectedOption = this.getSelectOption(menu);
      let placeholder: string;
      if (selectedOption !== null) {
        placeholder = utility.getPlaceholder(menu, selectedOption, selectPlaceholder, this.placeholder);
      } else {
        placeholder = this.getElsePlaceholder(selectPlaceholder);
        menu.value = '';
      }
      /**
       * if the select element has multiple attribute add multiple class else do not add multiple class
       */
      const mulitpleClass = utility.checkMultipleAttr(menu) ? ' multiple' : '';
      menu.insertAdjacentHTML('beforebegin',`<div class="select-menu${mulitpleClass}" id="${selectID}">
                        <div class="select-item no-select">${placeholder}</div>
                        <div class="select-item-options">
                            <div class="select-item">
                                <input type="text" placeholder="Select Item">
                            </div>
                            <div class="wrapper">
                                ${customMenuOptions}
                            </div>
                        </div>
                </div>`);
      this.setParentWidthIfActive(menu);
  }

  private getSelectOption(menu: HTMLSelectElement): HTMLOptionElement | HTMLOptionElement[] | null {
    return utility.checkMultipleAttr(menu)
    ? (Array.from(menu.querySelectorAll('option[selected]')) as HTMLOptionElement[] | null)
    : (menu.querySelector('option[selected]') as HTMLOptionElement | null);
  }

  private getElsePlaceholder(selectPlaceholder: string | null): string{
    return selectPlaceholder === null ? this.placeholder : selectPlaceholder;
  }

  private setParentWidthIfActive(menu: HTMLSelectElement){
    const parentElement = menu.parentElement as HTMLElement | null;

      const parentWidthActive = menu.getAttribute('data-parent-width-active');
      const parentWidth = menu.getAttribute('data-parent-width');

      const pwactive = parentWidthActive === null ? this.parentWidthActive : parentWidthActive === 'true';
      const assignWidth = parentWidth === null ? this.parentWidth : parentWidth;
      if (pwactive) {
        this.setParentWidth(parentElement, assignWidth);
      }
  }

  private setParentWidth(parentElement: HTMLElement|null, assignWidth: string){
    if (parentElement instanceof HTMLElement) {
      parentElement.style.width = assignWidth;
    }
  }

  private getMenuItems(newOptions: HTMLOptionElement[]): string{
    let optionsList = '';
    newOptions.forEach((option) => {
      optionsList += utility.generateCustomMenuItems(option);
    });
    return optionsList;
  }

  /**
   * @name addScrollbar
   * @param selectID
   * @param onload
   * @description
   * Add scrollbar to the wrapper of the items if it can not contain all the items
   * Add toggle event for the show and hide items wrapper on the intial call
   * Add click event to each of the items
   */
  private addScrollbar(selectID: string, onload: boolean): void {
    const getCustomMenu = document.querySelector(`#${selectID} .select-item-options`) as HTMLElement;
    const items = getCustomMenu.querySelectorAll('.wrapper .select-item') as NodeListOf<HTMLElement>;
    try {
      const optionsMenuProp = getCustomMenu.getBoundingClientRect() as DOMRect;
      const lastItemProp = items[items.length - 1].getBoundingClientRect() as DOMRect;
      const optionsMenuHeight = optionsMenuProp.y + optionsMenuProp.height;
      const lastItemHeight = lastItemProp.y + lastItemProp.height;
      if (lastItemHeight > optionsMenuHeight) {
        getCustomMenu.classList.add('scrollbar');
      } else {
        getCustomMenu.classList.remove('scrollbar');
      }
    } catch (e) {
      getCustomMenu.classList.remove('scrollbar');
    }

    if (onload) {
      this.selectElementEventListener(selectID);
    }
  }

  private selectElementEventListener(selectID: string){
    // initial call
      // Add click event to the current select element
      const $this = this;
      (document.querySelector(`#${selectID}`) as HTMLElement).addEventListener('click', function(e) {
        const customSelect = e.target as HTMLElement;
        if (customSelect.nodeName.toLowerCase() === 'input') {
          return false;
        }
        /**
         * @description
         * when select have active class dropdown show else it closes the dropdown
         * if the select element contain active class remove the active class
         * else add the active class and remove active class
         * from other select elements that has active class
         */
        if (this.classList.contains('multiple')) {
          $this.addClickEventToCloseButton(this, customSelect, selectID);
        }

        if (customSelect.classList.contains('select-item') && customSelect.closest('.wrapper') !== null) {
          $this.eventListenerHandler(e as Event, selectID);
        }
  
        $this.addRemoveActiveClass(this, selectID);
       
      });
  }

  private addClickEventToCloseButton(selectElement: HTMLElement, customSelect: HTMLElement, selectID: string){
    if (customSelect.nodeName.toLowerCase() === 'span' && customSelect.classList.contains('close')) {
      const selectOptions = Array.from(
        (selectElement.nextElementSibling as HTMLSelectElement).querySelectorAll('option[selected]'),
      );
      selectOptions
        .filter(
          option =>
            option.textContent === (customSelect.parentElement as HTMLSpanElement).getAttribute('data-label'),
        )
        .forEach(option => {
          option.removeAttribute('selected');
          (customSelect.parentElement as HTMLSpanElement).remove();
          const searchInput = (document as Document).querySelector(
            `#${selectID} .select-item-options input`,
          ) as HTMLInputElement;
          this.rerenderMenuList(selectID, (searchInput.value as string).trim());
          selectElement.classList.add('active');
        });
      /**
       * If the select remain one
       * replace it with the placeholder
       * because the remaining element would have been
       * remove before the script will run
       */
      this.setPlaceholderWhenEmpty(selectElement, selectOptions);
    }
  }

  private setPlaceholderWhenEmpty(selectElement: HTMLElement, selectOptions: Element[]){
    if (selectOptions.length === 1) {
      const selectPlaceholder = selectElement.getAttribute('placeholder');
      selectElement.children[0].textContent = selectPlaceholder === null ? this.placeholder : selectPlaceholder;
    }
  }

  private addRemoveActiveClass(customSelect: HTMLElement, selectID: string){
    if (customSelect.classList.contains('active')) {
      /**
       * if the select elment contain multiple class
       * check if the event target is within the
       * select element that if the user is still selecting
       * more options if not close the dropdown
       */
      if (!customSelect.classList.contains('multiple')) {
        customSelect.classList.remove('active');
      }
    } else {
      customSelect.classList.add('active');
      // Close other custom select dropdown
      document.querySelectorAll(`.select-menu:not(#${selectID})`).forEach(item => {
        item.classList.remove('active');
      });
    }
  }
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

  private eventListenerHandler = (evt: Event, selectID: string) => {
    const elemTarget = evt.target as HTMLElement;
    const customSelect = utility.getCurrentSelect(elemTarget);
    const selectElement = customSelect.nextElementSibling as HTMLSelectElement;
    (Array.from(selectElement.querySelectorAll('option')) as HTMLOptionElement[]).forEach((option, index) => {
      if (elemTarget.getAttribute('data-value') === option.value) {
        option.setAttribute('selected', 'selected');
        if ('createEvent' in document) {
          const dispatch = (document as Document).createEvent('CustomEvent') as CustomEvent;
          dispatch.initCustomEvent('change', true, false, { value: option.value, label: option.textContent });
          selectElement.dispatchEvent(dispatch);
        }
      } else {
        if (!utility.checkMultipleAttr(selectElement)) {
          option.removeAttribute('selected');
        }
      }
    });
    if (utility.checkMultipleAttr(selectElement)) {
      const selctedOptions = Array.from(selectElement.querySelectorAll('option[selected]')) as HTMLOptionElement[];
      if (selctedOptions.length > 0) {
        customSelect.children[0].innerHTML = utility.getOptionString(selctedOptions);
      }
    } else {
      customSelect.children[0].textContent = elemTarget.textContent;
    }
    const searchInput = (document as Document).querySelector(
      `#${selectID} .select-item-options input`,
    ) as HTMLInputElement;
    this.rerenderMenuList(selectID, (searchInput.value as string).trim());
  };

  /**
   * @name addSearchableEvent
   * @param selectID
   */
  private addSearchableEvent(selectID: string) {
    const searchInput = (document as Document).querySelector(`#${selectID} .select-item-options input`) as HTMLElement;

    searchInput.addEventListener('input', e => {
      const $this = e.target as HTMLInputElement;
      const searchValue = ($this.value as string).trim();
      this.rerenderMenuList(selectID, searchValue);
    });
  }

  private rerenderMenuList(selectID: string, searchValue = '') {
    const selectOptions = utility.getCurrentSelectElement(selectID);
    const menuOptions = Array.from(selectOptions.querySelectorAll('option')) as HTMLOptionElement[];
    this.generateCustomMenu(selectOptions, menuOptions, selectID, searchValue);
  }
}

interface ISCEventListenerArgs {
  capture?: boolean;
}

interface ISCAddEventListenerArgs extends ISCEventListenerArgs {
  passive?: boolean;
  once?: boolean;
}

type SCAddEventListener = (
  type: string,
  listener: (event: Event, id: string) => void,
  options?: ISCAddEventListenerArgs,
) => void;

interface IConfig {
  placeholder?: string;
  parentWidthActive?: boolean;
  parentWidth?: string;
}
/**
 * interface IElement extends Element {
 *     mozMatchesSelector(selectors: string): boolean;
 *     msMatchesSelector(selectors: string): boolean;
 * }
 */

// declare let SCElement: {
//     prototype: IElement;
//     new(): IElement;
// }

// if (!('matches' in  SCElement)) {
//     SCElement.prototype.matches = SCElement.prototype.msMatchesSelector ||
//                                 SCElement.prototype.mozMatchesSelector ||
//                                 SCElement.prototype.webkitMatchesSelector;
//     if(
//         !('msMatchesSelector' in SCElement)
//         && !('mozMatchesSelector' in SCElement)
//         && !('webkitMatchesSelector' in SCElement)
//     ){
//         SCElement.prototype.matches = function(sel: string): boolean{
//                                         const elm = this;
//                                         const elems = (elm.ownerDocument as Document).querySelectorAll(sel);
//                                         let index = 0;
//                                         while (elems[index] && elems[index] !== elm) {
//                                             ++index;
//                                         }

//                                         return Boolean(elems[index]);
//                                     };
//         }
// }

//   if (!('closest' in SCElement)) {
//     SCElement.prototype.closest = function(s: string) {
//       let el = this;
//       do {
//         if (el.matches(s)){
//             return el;
//         }
//         el = (el.parentElement || el.parentNode) as IElement;
//       } while (el !== null && el.nodeType === 1);
//       return null;
//     };
//   }
// export {SCAddEventListener}

(window as any).PickOption = PickOption;
