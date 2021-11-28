# be-ferried

Attribute-based equivalent of [slot-bot](https://github.com/bahrus/slot-bot).

```html
<slot be-ferried></slot>
<div></div>
```

Makes a copy of the light children of the element and inserts them into the Shadow DOM.

be-ferried can also apply an XSLT transformation to the cloned children, and the transformed result is inserted into the Shadow DOM.

