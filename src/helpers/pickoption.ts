function getPlaceholder(menu: HTMLSelectElement, selectedOption: HTMLOptionElement|HTMLOptionElement[], selectPlaceholder: string|null, classPlaceholder:string)
  :string
  {
    let placeholder: string;
    if (Array.isArray(selectedOption)) {
      placeholder = getInnerPlaceholder(menu, selectedOption, selectPlaceholder, classPlaceholder);
    } else {
      placeholder = selectedOption.textContent as string;
    }
    return placeholder;
  }

function getInnerPlaceholder(menu: HTMLSelectElement, selectedOption: HTMLOptionElement[], selectPlaceholder: string|null, classPlaceholder: string)
  :string
  {
    let placeholder: string;
    if (selectedOption.length > 0) {
      placeholder = getOptionString(selectedOption);
    } else {
      placeholder = selectPlaceholder === null ? classPlaceholder : selectPlaceholder;
      menu.value = '';
    }
    return placeholder;
  }

  function getOptionString(selectedOption: HTMLOptionElement[]): string{
    let optionString = '';
    selectedOption.forEach(option => {
      optionString += `<span class="selected" data-label="${option.textContent}">${
        option.textContent
      } <span class="close">x</span></span>`;
    });
     return optionString;
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
  function getFilterConditions(selectedOptions: string | string[], option: HTMLOptionElement, value: string): boolean {
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
   * @name checkMultipleAttr
   * @param menu
   * @description
   * Check if the select element has multiple attribute or not
   * if it has return `true`
   * else return `false`
   */
  function checkMultipleAttr(menu: HTMLSelectElement): boolean {
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
  function getSelectedOptions(menu: HTMLSelectElement): string | string[] {
    let currentSelectValue: string | string[];
    if (checkMultipleAttr(menu)) {
      const selectedOptions = Array.from(menu.querySelectorAll('option[selected]')) as HTMLOptionElement[];
      currentSelectValue = getIfSelectedOptions(selectedOptions);
    } else {
      const selectedOption = menu.querySelector('option[selected]') as HTMLOptionElement | null;
      currentSelectValue = getElseSelectedOption(selectedOption);
    }
    return currentSelectValue;
  }

  function getIfSelectedOptions(selectedOptions: HTMLOptionElement[]): string[]{
    return  selectedOptions.length > 0 ? selectedOptions.map(opt => opt.value) as string[] : [];
  }

  function getElseSelectedOption(selectedOption: HTMLOptionElement | null): string{
    return selectedOption !== null ? selectedOption.value as string: '';
  }

  function eventOnDocumentElmOnly(e: Event){
    if (
      (e.target as HTMLElement).closest(`.select-menu`) === null &&
      (e.target as HTMLElement).closest(`.select-item`) === null
    ) {
      // Hide the menus.
      document.querySelectorAll('.select-menu.active').forEach(item => {
        item.classList.remove('active');
      });
    }
  }

  function generateID(): string{
    return `a${Math.random().toString(36).substring(7)}`;
  }

  function getCurrentSelect(targetElem: HTMLElement): HTMLElement {
    const wrapper = targetElem.parentNode as HTMLElement;
    const customSelect = (wrapper.parentNode as HTMLElement).parentNode as HTMLElement;

    return customSelect;
  }
  function getCurrentSelectElement(selectID: string): HTMLSelectElement {
    const currentCustomSelect = (document as Document).querySelector(`div#${selectID}`) as HTMLElement;
    const selectOptions = currentCustomSelect.nextElementSibling as HTMLSelectElement;
    return selectOptions;
  }

  function generateCustomMenuItems(option: HTMLOptionElement): string {
    const value = option.value;
    const label = option.textContent as string;
    return `
        <div class="select-item" data-value="${value}">${label}</div>
    `;
  }

  // Test function for menu list generator
  function testGenerateCustomMenuItems(option: HTMLOptionElement): string {
    return generateCustomMenuItems(option);
  }

export {
    getPlaceholder,
    getOptionString,
    getFilterConditions,
    getSelectedOptions,
    checkMultipleAttr,
    generateID,
    eventOnDocumentElmOnly,
    getCurrentSelect,
    getCurrentSelectElement,
    generateCustomMenuItems,
    testGenerateCustomMenuItems
}