# Form Controls

PaperCast provides nodes for rendering standard form inputs. These widgets should use `*Literal` for their visual labels, and `*Bind` if they are tied to a data state.

## CheckboxNode

```json
{
  "id": "checkbox-1",
  "type": "checkbox",
  "layout": {},
  "props": {
    "labelLiteral": "I agree to the terms",
    "checkedLiteral": true
  }
}
```

- `labelLiteral` / `labelBind`
- `checkedLiteral` / `checkedBind`

## RadioNode

```json
{
  "id": "radio-1",
  "type": "radio",
  "layout": {},
  "props": {
    "labelLiteral": "Option A",
    "value": "opt_a",
    "name": "group_name"
  }
}
```

## RadioGroupNode

Use this to wrap multiple `RadioNode` children. It synchronizes their selection state.

```json
{
  "id": "radio-group-1",
  "type": "radioGroup",
  "layout": {},
  "props": {
    "name": "subscription_tier",
    "valueLiteral": "basic"
  },
  "children": [/* RadioNodes go here */]
}
```
