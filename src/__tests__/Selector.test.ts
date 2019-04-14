import PickOption from '../index';

test('Check the data it forming', () => {
  document.body.innerHTML = '<select><option>Banana</option></select>';

  const option = document.querySelector('option') as HTMLOptionElement;

  const selector = new PickOption();

  const selectData = selector.testGenerateCustomMenuItems(option);

  expect(selectData).toEqual(expect.stringContaining('<div class="select-item" data-value="Banana">Banana</div>'));
});
