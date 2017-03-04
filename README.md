# nested-inputs

This control allows you create structure of nested text entries,
kind of like an editable tree. 

## Example

![nested-inputs](demo.gif)

## Installation

TODO: add bower and npm

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