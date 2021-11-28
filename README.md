# be-ferried

Attribute-based equivalent of [slot-bot](https://github.com/bahrus/slot-bot), with additional features.



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

By default, the light children are left in place.  To remove them, set the `removeLightChildrenVal` attribute to `true`:

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
            "removeLightChildrenVal": true
        }'></slot>
        <div></div>
        <be-hive></be-hive>
    </template>
</div>
```

## Dynamic config settings.

The three settings, xsltHref, removeLightChildrenVal, and parametersVal (where parameters can be passed to the xslt processor), can be derived via the observe syntax used by [be-observant](https://github.com/bahrus/be-observant).  This way, values from the host or other upstream peer elements can be dynamically passed in. 

<table>
    <tr>
        <th>Static JSON property</th>
        <th>Purpose</th>
        <th>Dynamic config setting</th>
    </tr>
    <tr>
        <td>xsltHref</td>
        <td>URL (relative to the web page) of the XSLT file to apply to the light children</td>
        <td>xslt</td>
    </tr>
    <tr>
        <td>removeLightChildrenVal</td>
        <td>If true, the light children are removed from the slot</td>
        <td>removeLightChildren</td>
    </tr>
    <tr>
        <td>parametersVal</td>
        <td>JSON object of parameters to pass to the XSLT processor</td>
        <td>parameters</td>
    </tr>
</table>       

