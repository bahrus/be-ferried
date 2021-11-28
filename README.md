# be-ferried

Attribute-based equivalent of [slot-bot](https://github.com/bahrus/slot-bot).

```html
<k-fetch href="https://cf-sw.bahrus.workers.dev/?href=https://cdn.skypack.dev/@shoelace-style/shoelace/dist/custom-elements.json&embedded=true" as=html target=div></k-fetch>
<div>
    <template shadowroot=open>
        <style>
            slot[is-ferried]{
                display: none;
            }
        </style>
        <slot be-ferried='{
            "xsltHref": "transform.xslt"
        }'></slot>
        <div></div>
        <be-hive></be-hive>
    </template>
</div>
```

Makes a copy of the light children of the element and inserts them into the next sibling in the Shadow DOM.

be-ferried can also optionally apply an XSLT transformation to the cloned children, and the transformed result is inserted into the Shadow DOM.

By default, the light children are left in place.  To remove them, set the `removeLightChildren` attribute to `true`:

```html
<k-fetch href="https://cf-sw.bahrus.workers.dev/?href=https://cdn.skypack.dev/@shoelace-style/shoelace/dist/custom-elements.json&embedded=true" as=html target=div></k-fetch>
<div>
    <template shadowroot=open>
        <style>
            slot[is-ferried]{
                display: none;
            }
        </style>
        <slot be-ferried='{
            "xsltHref": "transform.xslt",
            "removeLightChildren": true
        }'></slot>
        <div></div>
        <be-hive></be-hive>
    </template>
</div>
```

