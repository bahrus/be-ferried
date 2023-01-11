# be-ferried

Ferry a replica of the light children DOM into the underworld of Shadow DOM.

[![Playwright Tests](https://github.com/bahrus/be-ferried/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-ferried/actions/workflows/CI.yml)

<a href="https://nodei.co/npm/be-ferried/"><img src="https://nodei.co/npm/be-ferried.png"></a>

Size of package, including custom element behavior framework (be-decorated):

[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-ferried?style=for-the-badge)](https://bundlephobia.com/result?p=be-ferried)

Size of new code in this package:

<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-ferried?compression=gzip">

*be-ferried* is an attribute-based equivalent of [slot-bot](https://github.com/bahrus/slot-bot), with additional features.

be-ferried also shares significantly overlapping functionality with [be-metamorphic](https://github.com/bahrus/be-metamorphic). The differences are a bit subtle, and are discussed below.

As with be-metamorphic, one use case be-ferried focuses on is the scenario where we want to quickly display a large amount of server-rendered HTML, where we can live with the initial content applying out-of-the-box formatting based on native semantic elements (perhaps with a [transient](https://github.com/bahrus/be-evanescent) style tag or two), for optimal First Content Paint. Then, once a design library such as UI5, or FAST, or Shoelace, or Carbon Design Web Components, or whatever, is downloaded, replace the native semantic elements with corresponding UI5 elements (for example), in order to gain from the enhancements the library provides over the native elements.

The major difference between be-ferried and be-metamorphic is that be-ferried is expected to be used as a helper behavior for a traditional Shadow DOM-based web component.  A web component where the referenced dependencies can be loaded in a standard way. [bra-ket](https://github.com/bahrus/bra-ket) is a web component that leverages be-ferried in this way.

Whereas be-metamorphic is not tightly coupled to Shadow DOM functionality, and is a bit more work to configure.

Anyway...

Other use cases for be-ferried include:

1.  Converting a nice code-pen example to a web component with minimal work -- many code-pens are css-heavy, and refactoring them to be web components can be a bit of an obstacle, if one requires that the developer ergonomic design of the web components be flawless.  But sometimes the perfect is the enemy of the good.  As a first draft, it may just be useful to copy the light children into the ShadowDOM, where the css styling can be safely applied, confident that they won't leak outside the Shadow DOM.  And maybe the HTML that makes sense outside the ShadowDOM is quite a bit different from the HTML that makes sense inside the ShadowDOM, so apply an xslt transform as needed.  Leave the task of perfecting / optimizing the component with tender loving care to a time when bandwidth is available, after the usefulness of the component is proven. 

2.  Supporting an environment where the api's providing the content are willing to provide the content in HTML format, but would prefer to stick to a stable, single, semi-permanent markup schema that best represents the business functionality, and let components using be-ferried do the grunge work of converting the HTML to the desired design library of the hour.

3.  Scenarios where HTML that is retrieved provides data, but not the UI.  First example of this is for [Third-party link preview content](https://github.com/bahrus/xtal-link-preview).

## Syntax Example

```html
<k-fetch href="https://cf-sw.bahrus.workers.dev/?href=https://cdn.skypack.dev/@shoelace-style/shoelace/dist/custom-elements.json&embedded=true" as=html target=div></k-fetch>
<div>
    <template shadowroot=open>
        <style>
            slot.has-been-ferried{
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

Makes a copy of the light children of the element and inserts them into the next sibling of the adorned slot element in the Shadow DOM, after applying the transform specified by transform transform.xslt.

Specifying an xslt transform is optional.

By default, the light children are left in place.  To remove them, set the `removeLightChildrenVal` property to `true`:

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

## Security

Since we are using an attribute to (optionally) specify a url, which may contain script tags in it, the path specified by the xsltHref needs to satisfy a rudimentary check against either an import map:

```html
<head>
    <script type=importmap>
    {
        "imports": {
            "transform.xslt": "https://example.com/transform.xslt"
        }
    }
    </script>
</head>

...
<slot be-ferried='{
    "xsltHref": "transform.xslt"
}'></slot>
```

and/or a link preload tag:

```html
<head>
    <link rel=preload as=fetch id=transform.xslt href=https://example.com/transform.xslt>
</head>

...
<slot be-ferried='{
    "xsltHref": "transform.xslt"
}'></slot>
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

## Viewing Locally

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo/dev in a modern browser.

## Importing in ES Modules:

```JavaScript
import 'be-ferried/be-ferried.js';
```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/be-ferried';
</script>
```

