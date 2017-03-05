# nested-inputs

[![Code Climate](https://codeclimate.com/github/koss-lebedev/nested-inputs/badges/gpa.svg)](https://codeclimate.com/github/koss-lebedev/nested-inputs)
[![npm version](https://badge.fury.io/js/nested-inputs.svg)](https://badge.fury.io/js/nested-inputs)
[![Bower version](https://badge.fury.io/bo/nested-inputs.svg)](https://badge.fury.io/bo/nested-inputs)


This control allows you create structure of nested text entries,
kind of like an editable tree. 

## Example

![nested-inputs](demo.gif)

## Installation

Using Bower:

    bower install nested-inputs

Using NPM:

    npm install nested-inputs

Or simply copy `nested-inputs.js` and `nested-inputs.css` files from `dist` 
folder to your project.

## Usage

```js
$('#categories').nestedInputs();
```

To initialize it with existing tree data, set the value to JSON
value before calling `nestedInputs()`:
 
 ```js
var data = JSON.stringify([
    { value: "first", children: [
        { value: "subcategory 1", children: [] },
        { value: "subcategory 2", children: [
            { value: 'third-level nesting' },
            { value: 'third-level nesting 2' }
        ] }
    ] },
    { value: "second", children: [] }
]);
$('#categories').val(data).nestedInputs();
```
## License

Please see [LICENSE](LICENSE) for licensing details.