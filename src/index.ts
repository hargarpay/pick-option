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
    const selectMenuDisplay = Array.from(
      document.querySelectorAll('select.pick-option'),
    ) as HTMLSelectElement[];
    if (selectMenuDisplay) {
      // Close all custom dropdown when click outside;
      (document as Document).addEventListener('click', e => {
        /**
         * Check if select-menu and select-item are closest
         * to the event target else closes all drop down
         */
        if (
          (e.target as HTMLElement).closest(`.select-menu`) === null &&
          (e.target as HTMLElement).closest(`.select-item`) === null
        ) {
          // Hide the menus.
          document.querySelectorAll('.select-menu.active').forEach(item => {
            item.classList.remove('active');
          });
        }
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
        if(this.arraySelectIDs.indexOf(selectID) === -1){
          if(selectID === '') {
            selectID =`a${Math.random()
                .toString(36)
                .substring(7)}`;
          }else{
            selectID = menu.getAttribute('id') as string;   
          }
        }else{
          selectID =`a${Math.random()
            .toString(36)
            .substring(7)}`;
          }
          this.arraySelectIDs.push(selectID);


        // Generate the custom select
        this.generateCustomMenu(menu, menuOptions, selectID, '', true);
      }
    }
  }

  // Test function for menu list generator
  public testGenerateCustomMenuItems(option: HTMLOptionElement): string {
    return this.generateCustomMenuItems(option);
  }

  // Create the custom menu and display it
  private async generateCustomMenu(
    menu: HTMLSelectElement,
    options: HTMLOptionElement[],
    selectID: string,
    value: string = '',
    onload = false,
  ): Promise<void> {
    // Generate the custom options using Promise
    const promise = new Promise((resolve, reject) => {
      let optionsList = '';
      let numberOfLength: number;
      const currentSelectValue: string | string[] = this.getSelectedOptions(menu);

      const newOptions = options.filter((option: HTMLOptionElement) =>
        this.getFilterConditions(currentSelectValue, option, value),
      );

      numberOfLength = newOptions.length - 1;
      if (newOptions.length > 0) {
        newOptions.forEach((option, index) => {
          optionsList += this.generateCustomMenuItems(option);
          if (numberOfLength === index) {
            resolve(optionsList);
          }
        });
      } else {
        resolve(optionsList);
      }
    });

    const customMenuOptions = await promise;
    const currentCustomSelect = (document as Document).querySelector(`div#${selectID} .select-item-options .wrapper`);
    if (currentCustomSelect) {
      (currentCustomSelect.parentNode as HTMLElement).removeChild(currentCustomSelect);
    }
    if (onload) {
      const selectPlaceholder = menu.getAttribute('placeholder');
      const selectedOption = this.checkMultipleAttr(menu)
        ? (Array.from(menu.querySelectorAll('option[selected]')) as HTMLOptionElement[] | null)
        : (menu.querySelector('option[selected]') as HTMLOptionElement | null);
      let placeholder: string;
      if (selectedOption !== null) {
        if (Array.isArray(selectedOption)) {
          if (selectedOption.length > 0) {
            let optionString = '';
            selectedOption.forEach(option => {
              optionString += `<span class="selected" data-label="${option.textContent}">${
                option.textContent
              } <span class="close">x</span></span>`;
            });
            placeholder = optionString;
          } else {
            placeholder = selectPlaceholder === null ? this.placeholder : selectPlaceholder;
            menu.value = '';
          }
        } else {
          placeholder = selectedOption.textContent as string;
        }
      } else {
        placeholder = selectPlaceholder === null ? this.placeholder : selectPlaceholder;
        menu.value = '';
      }
      /**
       * if the select element has multiple attribute
       * add multiple class else do not add multiple class
       */
      const mulitpleClass = this.checkMultipleAttr(menu) ? ' multiple' : '';

      menu.insertAdjacentHTML(
        'beforebegin',
        `
                <div class="select-menu${mulitpleClass}" id="${selectID}">
                        <div class="select-item no-select">${placeholder}</div>
                        <div class="select-item-options">
                            <div class="select-item">
                                <input type="text" placeholder="Select Item">
                            </div>
                            <div class="wrapper">
                                ${customMenuOptions}
                            </div>
                        </div>
                </div>
            `,
      );

      const parentElement = menu.parentElement as HTMLElement | null;

      const parentWidthActive = menu.getAttribute('data-parent-width-active');
      const parentWidth = menu.getAttribute('data-parent-width');

      const pwactive = parentWidthActive === null ? this.parentWidthActive : parentWidthActive === 'true';
      const pw = parentWidth === null ? this.parentWidth : parentWidth;
      if (pwactive) {
        if (parentElement instanceof HTMLElement) {
          parentElement.style.width = pw;
        }
      }
    } else {
      const selectItemOptions = (document as Document).querySelector(
        `div#${selectID} .select-item-options`,
      ) as HTMLElement;
      selectItemOptions.insertAdjacentHTML(
        'beforeend',
        `
            <div class="wrapper">${customMenuOptions}</div>
        `,
      );
    }

    this.addScrollbar(selectID, onload);
    if (onload) {
      this.addSearchableEvent(selectID);
    }
  }

  private generateCustomMenuItems(option: HTMLOptionElement): string {
    const value = option.value;
    const label = option.textContent as string;
    return `
        <div class="select-item" data-value="${value}">${label}</div>
    `;
  }

  /**
   * @name checkMultipleAttr
   * @param menu
   * @description
   * Check if the select element has multiple attribute or not
   * if it has return `true`
   * else return `false`
   */
  private checkMultipleAttr(menu: HTMLSelectElement): boolean {
    return menu.getAttribute('multiple') !== null;
  }

  /**
   * @name getSelectedOptions
   * @param menu
   * @description
   * Considering selected options of both select with multiple attribute and the select without
   * if select has mulitple attribute then the selected option will be array of the value i.e `string[]`
   * else if the selected ooption is empty return `[]`
   * if the select does not have multiple attribute the value will be a `string`
   */
  private getSelectedOptions(menu: HTMLSelectElement): string | string[] {
    let currentSelectValue: string | string[];
    if (this.checkMultipleAttr(menu)) {
      const selectedOptions = Array.from(menu.querySelectorAll('option[selected]')) as HTMLOptionElement[];
      if (selectedOptions.length > 0) {
        currentSelectValue = selectedOptions.map(opt => opt.value) as string[];
      } else {
        currentSelectValue = [];
      }
    } else {
      const selectedOption = menu.querySelector('option[selected]') as HTMLOptionElement | null;
      if (selectedOption !== null) {
        currentSelectValue = selectedOption.value as string;
      } else {
        currentSelectValue = '';
      }
    }
    return currentSelectValue;
  }

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
  private getFilterConditions(selectedOptions: string | string[], option: HTMLOptionElement, value: string): boolean {
    let removeSelectedOptions: boolean;
    const filterBySearch =
      option.value.toLowerCase().indexOf((value as string).toLowerCase()) > -1 ||
      (option.textContent as string).toLowerCase().indexOf((value as string).toLowerCase()) > -1;

    if ((typeof selectedOptions).toLowerCase() === 'string') {
      removeSelectedOptions = (option.value as string).trim() !== (selectedOptions as string).trim();
    } else {
      removeSelectedOptions = (selectedOptions as [string]).indexOf(option.value) === -1;
    }

    return filterBySearch && removeSelectedOptions;
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
          // tslint:disable-next-line:no-console
          if (customSelect.nodeName.toLowerCase() === 'span' && customSelect.classList.contains('close')) {
            const selectOptions = Array.from(
              (this.nextElementSibling as HTMLSelectElement).querySelectorAll('option[selected]'),
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
                $this.rerenderMenuList(selectID, (searchInput.value as string).trim());
                this.classList.add('active');
              });
            /**
             * If the select remain one
             * replace it with the placeholder
             * because the remaining element would have been
             * remove before the script will run
             */
            if (selectOptions.length === 1) {
              const selectPlaceholder = this.getAttribute('placeholder');
              this.children[0].textContent = selectPlaceholder === null ? $this.placeholder : selectPlaceholder;
            }
          }
        }

        if (customSelect.classList.contains('select-item') && customSelect.closest('.wrapper') !== null) {
          $this.eventListenerHandler(e as Event, selectID);
        }

        if (this.classList.contains('active')) {
          /**
           * if the select elment contain multiple class
           * check if the event target is within the
           * select element that if the user is still selecting
           * more options if not close the dropdown
           */
          if (!this.classList.contains('multiple')) {
            this.classList.remove('active');
          }
        } else {
          this.classList.add('active');
          // Close other custom select dropdown
          document.querySelectorAll(`.select-menu:not(#${selectID})`).forEach(item => {

            item.classList.remove('active')
          });
        }
      });
    }

    /**
     * Add Event listener to each of the options of each of the select
     * this can cause page lagging when each of the select has
     * close to hundreds of options rather it will be better to use
     * event delegate to option under their select parent that
     * =========================================================
     *     Best Practice because of optimization
     * =========================================================
     * if(
     *      customSelect.classList.contains('select-item') // check if the clicked item has select-item class and
     *     && customSelect.closest('.wrapper') !== null    // check if clicked item has ancestor with wrapper class
     * ){ // the conditions are true process this block of code
     *     this.eventListenerHandler(e as Event, selectID);
     * }
     * ==========================================================
     *     Not recommended for production application
     * ==========================================================
     * items.forEach(item => {
     *     (item.addEventListener as SCAddEventListener)('click', this.eventListenerHandler(event as Event, selectID));
     * });
     */
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
    const customSelect = this.getCurrentSelect(elemTarget);
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
        if (!this.checkMultipleAttr(selectElement)) {
          option.removeAttribute('selected');
        }
      }
    });
    if (this.checkMultipleAttr(selectElement)) {
      const selctedOptions = Array.from(selectElement.querySelectorAll('option[selected]')) as HTMLOptionElement[];
      if (selctedOptions.length > 0) {
        let selectedOption = '';
        selctedOptions.forEach(option => {
          selectedOption += `<span class="selected" data-label="${option.textContent}">${
            option.textContent
          } <span class="close">x</span></span>`;
        });
        customSelect.children[0].innerHTML = selectedOption;
      }
    } else {
      customSelect.children[0].textContent = elemTarget.textContent;
    }
    const searchInput = (document as Document).querySelector(
      `#${selectID} .select-item-options input`,
    ) as HTMLInputElement;
    this.rerenderMenuList(selectID, (searchInput.value as string).trim());
  };

  private getCurrentSelect(targetElem: HTMLElement): HTMLElement {
    const wrapper = targetElem.parentNode as HTMLElement;
    const customSelect = (wrapper.parentNode as HTMLElement).parentNode as HTMLElement;

    return customSelect;
  }

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

  private getCurrentSelectElement(selectID: string): HTMLSelectElement {
    const currentCustomSelect = (document as Document).querySelector(`div#${selectID}`) as HTMLElement;
    const selectOptions = currentCustomSelect.nextElementSibling as HTMLSelectElement;
    return selectOptions;
  }

  private rerenderMenuList(selectID: string, searchValue = '') {
    const selectOptions = this.getCurrentSelectElement(selectID);
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
