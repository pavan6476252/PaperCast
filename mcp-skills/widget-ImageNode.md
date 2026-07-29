# Image Widget

The `ImageNode` renders graphic assets.

```json
{
  "id": "img-1",
  "type": "image",
  "layout": { "width": 150, "height": 150 },
  "props": {
    "srcLiteral": "https://example.com/logo.png",
    "fit": "contain"
  }
}
```

## Properties

- `srcLiteral`: `string` (Static URL to the image).
- `srcBind`: `string` (Data path to a URL).
- `fit`: `"contain" | "cover" | "stretch"` (Maps directly to `object-fit`).
