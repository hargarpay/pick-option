## PickOption ![Travis (.com) branch](https://img.shields.io/travis/com/hargarpay/pick-option/master.svg)
PickOption is a vanilla (pure) javascript module that use to convert select element to a style seachable select element. It does not depend on javascript. It is use for country selectors, contact lists and so on.

### Features
* Searchable - the listed items in the dropdown will be update based on the item that was search
* Select & Delete item at once - Once an item is element, it will automatically remove from the list
* Different Level Configuration - There are 3 level of configuration
    * Default configuartion that come with module
    * Setup Configurationsetup - This is the configuration at the instance of the module. it precedence default configuration
    * Individual Configuration - Each of the select element can have its own configuation. it precedence instance configuration
* Multiple Selection - select element with multiple attribute is also supported

### Installation
#### Option 1
`npm install pick-option`
#### Option 2
link the css and js files in your project
```html
<!-- The version 0.1.0 is the version you want to use i.e you can change to any of the version you choose to use -->
<link rel="stylesheet" href="https://unpkg.com/pick-option@0.1.0/dist/main.min.css">
<script src="https://unpkg.com/pick-option@0.1.0/dist/main.min.js></script>
```
* also the main js file

### Usage
* Add `pick-option` class to the select element
* Instantiate the object **Setect**
```javascript
new PickOption({
    placeholder: "Select Item",
    parentWidthActive: true,
    parentWidth: '100%'
});

```
## Parameters
Parameters defined at the instance of the module are applied to all the select elements with pick-option class and each of the select element with pick-option class can have its own configuration parameter which override it default configuration parameter. Note that only fields provided will be override.

#### Placeholder
As it name implies, it displays the default option.
**Default Value is 'Select item'**
For the instance of PickOption
```javascript
    new PickOption({
        ...
        placeholder: "Select Item"
        ...
    })
```

For the select element set the placeholder attribute
```html
    <select class="pick-option" placeholder="Select Fruits">
        <option>Banana</option>
    </select>
```
| Data Type    | Instance     |  Individual  |
| ------------ |:------------:| ------------:|
| Data Type    | string       | string       |

### Parent Width Activate
It is use to allow the select element with pick-option class to modify it direct parent width. It is needs to be set to true before `parentWidth` parameter can work
**Default Value is false**
For the instance of PickOption
```javascript
    new PickOption({
        ...
        parentWidthActive: true
        ...
    })
```

For the select element set the data-parent-width-active attribute either true or false since data type value only support string datatype
```html
    <select class="pick-option" data-parent-width-active="true">
        <option>Banana</option>
    </select>
```

| Data Type            | Instance     |  Individual  |
| -------------------- |:------------:| ------------:|
|  Data Type           | boolean      | true|false   |

### Parent Width
This is the feild that set the number of parent (the select element with class pick-option direct parent) width. This field will not work if parentWidthActive is set to false that is if either `{ parentWidthActive: false}` or `<select class="pick-option" data-parent-width-active="true"></select>`
**Default Value is '100%'**
Note any unit can be use

For the instance of PickOption
```javascript
    new PickOption({
        ...
        parentWidth: '100px'
        ...
    })
```

For the select element set the data-parent-width attribute
```html
    <select class="pick-option" data-parent-width-active="50%">
        <option>Banana</option>
    </select>
```

## Parameters on elements only
### Muiltple
If you want the select element with class pick-option to support multiple options selected add multiple attribute to the select element.
Eith Use
```html
    <select class="pick-option" multiple>
        <option>Banana</option>
    </select>
```
Or add value to the multiple
```html
    <select class="pick-option" multiple="multiple">
        <option>Banana</option>
    </select>
```
### ID
If id attibute is not declare on the select element with pick-option class or two select elements with pick-option class have the same id a unique id will be added to the select element(with class pick-option) that does not have id or one of the select element(with class pick-option)  will have a new unique but if a unique id is added, it will retain the added id



## Event
Event on the select element with class pick-option still work like the default event select.

## Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="https://unpkg.com/pick-option@0.1.0/dist/main.min.css">>
    </head>
<body>
    <div class="select-sagecoder">
        <select
            name="first"
            class="pick-option"
            placeholder="Select Fruits"
            data-parent-width-active="false"
        >
            <option>Apple</option>
            <option >Banana</option>
            <option>Pineapple</option>
            <option>Orange</option>
            <option selected="selected">Cucumber</option>
            <option>Carrot</option>
        </select>
    </div>
    <div class="select-sagecoder">
        <select
            name="second[]"
            class="pick-option"
            data-parent-width-active="false"
            id="my-pick-option"
            multiple
        >
            <option>Pineapple</option>
            <option>Orange</option>
            <option>Cucumber</option>
            <option selected="selected">Carrot</option>
            <option selected="selected">Mango</option>
            <option>Grape</option>
            <option>Water melon</option>
        </select>
    </div>
    <script src="https://unpkg.com/pick-option@0.1.0/dist/main.min.js"></script>
    <script>
        new PickOption({
            placeholder: "Select Item",
            parentWidthActive: true
        });
        document.getElementById('my-pick-option').addEventListener('change', function(e){
            console.log('Another Option has been select', e)
        });

    </script>
</body>
</html>
```
