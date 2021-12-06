# be-ferried

Ferry a replica of the light children DOM into the underworld of Shadow DOM.

Attribute-based equivalent of [slot-bot](https://github.com/bahrus/slot-bot), with additional features.

be-ferried also shares significantly overlapping functionality with [be-metamorphic](https://github.com/bahrus/be-metamorphic). The differences are a bit subtle, and are discussed below.

As with be-metamorphic, one use case be-ferried focuses on is the scenario where we want to quickly display a large amount of server-rendered HTML, where we can live with the initial content applying out-of-the-box formatting based on native semantic elements (perhaps with a style tag or two), for optimum First Content Paint. Then once a design library such as UI5, or FAST, or Shoelace, or Carbon Design Web Components, or whatever, is downloaded, replace the native semantic elements with corresponding UI5 elements (for example), in order to gain from the enhancements the library provides over the native elements.

The major difference between be-ferried and be-metamorphic is that be-ferried is expected to be used as a helper behavior for a traditional Shadow DOM-based web component.  A web component where the referenced dependencies can be loaded in a standard way (but dynamic imports somewhat defeats the purpose). [bra-ket](https://github.com/bahrus/bra-ket) is a web component that leverages be-ferried in this way.

Whereas be-metamorphic is not tightly coupled to Shadow DOM functionality, and works well with (outside) code loading references dynamically via import('path/to/web-components').  It is a bit more work to configure, however.

Anyway...

Other use cases for be-ferried include:

1.  Converting a nice code-pen example to a web component with minimal work -- many code-pens are css-heavy, and refactoring them to be web components can be a bit of an obstacle, if one requires that the developer ergonomic design of the web components be flawless.  But sometimes the perfect is the enemy of the good.  As a first draft, it may just be useful to copy the light children into the ShadowDOM, where the css styling can be safely applied, confident that they won't leak outside the Shadow DOM.  And maybe the HTML that makes sense outside the ShadowDOM is quite a bit different from the HTML that makes sense inside the ShadowDOM, so apply an xslt transform as needed.  Leave the task of perfecting / optimizing the component with tender loving care to a time when bandwidth is available, after the usefulness of the component is proven. 

2.  Supporting an environment where the api's providing the content are willing to provide the content in HTML format, but would prefer to stick to a stable, single, semi-permanent markup schema that best represents the business functionality, and let components using be-ferried do the grunge work of converting the HTML to the desired design library of the hour. 

## Syntax Example

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

Makes a copy of the light children of the element and inserts them into the next sibling in the Shadow DOM, after applying the transform specified by transform transform.xslt.

Specifying an xslt transform is optional.

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
        <td>If true, the light children / slotted input is removed after transformation is complete.</td>
        <td>removeLightChildren</td>
    </tr>
    <tr>
        <td>parametersVal</td>
        <td>JSON object of parameters to pass to the XSLT processor</td>
        <td>parameters</td>
    </tr>
</table>       

