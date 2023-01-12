import { xsltLookup } from './be-ferried.js';
export async function doTransform(pp) {
    const { xsltHref, parametersVal, removeLightChildrenVal, self, ferryInProgressCss, proxy, ferryCompleteCss, debug } = pp;
    const assignedNodes = self.assignedNodes();
    if (assignedNodes.length === 0)
        return;
    let xsltProcessor = xsltLookup[xsltHref];
    if (xsltProcessor === undefined) {
        xsltLookup[xsltHref] = 'loading';
        const { resolve } = await import('trans-render/lib/resolve.js');
        const mappedPath = resolve(xsltHref);
        const xslt = await fetch(mappedPath).then(r => r.text());
        xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(new DOMParser().parseFromString(xslt, 'text/xml'));
        xsltLookup[xsltHref] = xsltProcessor;
    }
    if (xsltProcessor === 'loading') {
        setTimeout(() => doTransform(pp), 100);
        return;
    }
    self.classList.add(ferryInProgressCss);
    const ns = self.nextElementSibling;
    const div = document.createElement('div');
    let nonTrivial = false;
    let hasTemplate = false;
    const { swap } = await import('trans-render/xslt/swap.js');
    assignedNodes.forEach(el => {
        switch (el.nodeType) {
            case 1:
                nonTrivial = true;
                const isTemplate = el instanceof HTMLTemplateElement;
                if (isTemplate) {
                    hasTemplate = true;
                }
                const clone = (isTemplate ? el.content.cloneNode(true) : el.cloneNode(true));
                swap(clone, true);
                div.appendChild(clone);
                break;
        }
    });
    if (!nonTrivial) {
        self.classList.remove(ferryInProgressCss);
        return;
    }
    ns.innerHTML = '';
    xsltProcessor.clearParameters();
    if (parametersVal !== undefined) {
        parametersVal.forEach(p => {
            xsltProcessor.setParameter(p.namespaceURI, p.localName, p.value);
        });
    }
    let resultDocument = div;
    if (xsltProcessor !== undefined) {
        if (debug) {
            console.log({ inputXHTML: div.outerHTML });
        }
        resultDocument = xsltProcessor.transformToFragment(div, document);
    }
    swap(resultDocument, false);
    if (hasTemplate) {
        const arr = resultDocument.children;
        const h = [];
        for (const item of arr) {
            h.push(item.outerHTML);
        }
        ns.innerHTML = h.join('');
    }
    else {
        ns.appendChild(resultDocument);
    }
    if (debug) {
        console.log({ outputHTML: ns.outerHTML });
    }
    self.classList.add(ferryCompleteCss);
    if (removeLightChildrenVal) {
        const slotName = self.getAttribute('name');
        const rn = self.getRootNode().host;
        const elementToClear = (slotName === null ? rn : rn.querySelector(`slot[name="${slotName}"]`));
        elementToClear.innerHTML = '';
    }
    self.classList.remove(ferryInProgressCss);
    proxy.resolved = true;
}
