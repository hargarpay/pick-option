'use strict';

/**
 * @function createCustomMenu
 * @description grt all select elements that have select-menu-display as class and generate their custom dropdown
 */
const createCustomMenu = function() {
  // Get all select element with select-menu-display class
  const selectMenuDisplay = document.querySelectorAll('select.select-menu-display');
  if (selectMenuDisplay) {
    // Use for...of loop to run through each of the element
    for (let menu of selectMenuDisplay) {
      // Get all option elements of the current select element
      const menuOptions = menu.querySelectorAll('option');
      // Check if the current select element has id
      // if it has get the id
      // if it does not have generate a unique id
      // and append character a to the generate id
      // because some generate id might start with number
      // which is an invalid variable
      const selectID =
        menu.getAttribute('id') ||
        `a${Math.random()
          .toString(36)
          .substring(7)}`;
      // Generate the custom select
      generateCustomMenu(menu, menuOptions, selectID, null, true);
    }
  }
};

const generateCustomMenu = async function(menu, options, selectID, value = null, onload = false) {
  const promise = new Promise((resolve, reject) => {
    let optionsList = '';
    let numberOfLength;
    if ((value === null || value === '' || value.trim() === '') && onload) {
      numberOfLength = options.length - 1;
      options.forEach((option, index) => {
        optionsList += generateCustomMenuItems(option.value, option.textContent);
        if (numberOfLength === index) {
          resolve(optionsList);
        }
      });
    } else {
      const filter = Array.prototype.filter;
      let newOptions = filter.call(
        options,
        option =>
          option.value.toLowerCase().includes(value.toLowerCase()) ||
          option.textContent.toLowerCase().includes(value.toLowerCase()),
      );
      numberOfLength = newOptions.length - 1;
      if (newOptions.length > 0) {
        newOptions.forEach((option, index) => {
          optionsList += generateCustomMenuItems(option.value, option.textContent);
          if (numberOfLength === index) {
            resolve(optionsList);
          }
        });
      } else {
        resolve(optionsList);
      }
    }
  });

  const customMenuOptions = await promise;
  const currentCustomSelect = document.querySelector(`div#${selectID} .select-item-options .wrapper`);
  if (currentCustomSelect) {
    currentCustomSelect.parentNode.removeChild(currentCustomSelect);
  }
  if (onload) {
    menu.insertAdjacentHTML(
      'beforebegin',
      `
                <div class="select-menu" id="${selectID}">
                        <div class="select-item">Select Item Node</div>
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
    menu.style.display = 'none';
  } else {
    document.querySelector(`div#${selectID} .select-item-options`).insertAdjacentHTML(
      'beforeend',
      `
            <div class="wrapper">${customMenuOptions}</div>
        `,
    );
  }
  addScollbar(selectID);
  if (onload) {
    addSearchableEvent(selectID);
  }
};

function generateCustomMenuItems(value = null, label = null) {
  return `
        <div class="select-item" data-value="${value}">${label}</div>
    `;
}
function addScollbar(selectID) {
  const getCustomMenu = document.querySelector(`#${selectID} .select-item-options`);
  const optionsMenuProp = getCustomMenu.getBoundingClientRect();
  const items = getCustomMenu.querySelectorAll('.select-item');
  const lastItemProp = items[items.length - 1].getBoundingClientRect();
  const optionsMenuHeight = optionsMenuProp.y + optionsMenuProp.height;
  const lastItemHeight = lastItemProp.y + lastItemProp.height;
  if (lastItemHeight > optionsMenuHeight) {
    getCustomMenu.classList.add('scrollbar');
  } else {
    getCustomMenu.classList.remove('scrollbar');
  }

  if ('createEvent' in document) {
    document.querySelector(`#${selectID}`).addEventListener('customchange', function(e) {
      console.log(e);
    });
  }

  // Add Event listener to
  items.forEach(item => {
    item.addEventListener('click', function(e) {
      this.parentNode.parentNode.parentNode.children[0].textContent = this.textContent;
      const selectElement = this.parentNode.parentNode.parentNode.nextElementSibling;

      selectElement.querySelectorAll('option').forEach(option => {
        if (this.getAttribute('data-value') === option.value) {
          option.selected = 'selected';
          if ('createEvent' in document) {
            const dispatch = document.createEvent('Event');
            dispatch.initEvent('customchange', true, false);
            dispatch.data = { value: option.value, label: option.textContent };
            this.dispatchEvent(dispatch);
          }
        } else {
          option.removeAttribute('selected');
        }
      });
    });
  });
}

function addSearchableEvent(selectID) {
  const searchInput = document.querySelector(`#${selectID} .select-item-options input`);
  const currentCustomSelect = document.querySelector(`div#${selectID}`);
  const selectOptions = currentCustomSelect.nextElementSibling;
  searchInput.addEventListener('input', function() {
    const $this = this;
    const searchValue = $this.value.trim();
    const menuOptions = selectOptions.querySelectorAll('option');
    generateCustomMenu(selectOptions, menuOptions, selectID, searchValue);
  });
}

createCustomMenu();
