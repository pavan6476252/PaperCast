---
description: Documentation for WidgetInstanceNode, used to reuse definitions from the schema definitions pool.
---

# Widget Instance

The `WidgetInstanceNode` allows you to instantiate a reusable widget definition (similar to a React Component) that is declared in `schema.definitions.widgets`.

```json
{
  "id": "inst-1",
  "type": "widgetInstance",
  "layout": {},
  "props": {
    "definitionId": "my-reusable-card"
  }
}
```

The rendering engine will look up `schema.definitions.widgets["my-reusable-card"]` and inject its AST tree in place of this node during evaluation.
