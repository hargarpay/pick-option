import * as utility from "../helpers/pickoption";

test('Check the data it forming', () => {
  document.body.innerHTML = '<select><option>Banana</option></select>';

  const option = document.querySelector('option') as HTMLOptionElement;

  const selectData = utility.testGenerateCustomMenuItems(option);

  expect(selectData).toEqual(expect.stringContaining('<div class="select-item" data-value="Banana">Banana</div>'));
});
