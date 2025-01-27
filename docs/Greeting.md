# Greeting

The `greeting` is the block is responsible show the seller information

![image](https://user-images.githubusercontent.com/17678382/115098788-993db180-9ef7-11eb-8b1e-4bb45aef7e3e.png)

## Configuration

1. Add the `greeting` block to any block below `store.home`. For example:

```json
{
  "store.home": {
    "blocks": ["greeting"]
  }
}
```

| Prop name | Type     | Description | Default value |
| --------- | -------- | ----------- | ------------- |
| `name`    | `String` | Name text   | `Test`        |

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles |
| ----------- |
| `test`      |
