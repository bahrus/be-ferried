import { scts, xsltLookup, remove } from './be-ferried.js';
export async function doTransform(self, target) {
    const { xsltHref, parametersVal, removeLightChildrenVal } = self;
    const assignedNodes = target.assignedNodes();
    if (assignedNodes.length === 0)
        return;
    let xsltProcessor = xsltLookup[xsltHref];
    if (xsltProcessor === undefined) {
        xsltLookup[xsltHref] = 'loading';
        const xslt = await fetch(xsltHref).then(r => r.text());
        xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(new DOMParser().parseFromString(xslt, 'text/xml'));
        xsltLookup[xsltHref] = xsltProcessor;
    }
    if (xsltProcessor === 'loading') {
        setTimeout(() => doTransform(self, target), 100);
        return;
    }
    target.classList.add('being-ferried');
    const ns = target.nextElementSibling;
    const div = document.createElement('div');
    let nonTrivial = false;
    let hasTemplate = false;
    assignedNodes.forEach(el => {
        switch (el.nodeType) {
            case 1:
                nonTrivial = true;
                const isTemplate = el instanceof HTMLTemplateElement;
                if (isTemplate) {
                    hasTemplate = true;
                }
                const clone = (isTemplate ? el.content.cloneNode(true) : el.cloneNode(true));
                const problemTags = clone.querySelectorAll(scts.join(','));
                problemTags.forEach(tag => {
                    const newTag = document.createElement(tag.localName + '-ish');
                    for (let i = 0, ii = tag.attributes.length; i < ii; i++) {
                        newTag.setAttribute(tag.attributes[i].name, tag.attributes[i].value);
                    }
                    tag.insertAdjacentElement('afterend', newTag);
                });
                problemTags.forEach(tag => tag.remove());
                const forbiddenTags = clone.querySelectorAll(remove.join(','));
                forbiddenTags.forEach(tag => tag.remove());
                div.appendChild(clone);
                break;
        }
    });
    if (!nonTrivial)
        return;
    ns.innerHTML = '';
    xsltProcessor.clearParameters();
    if (parametersVal !== undefined) {
        parametersVal.forEach(p => {
            xsltProcessor.setParameter(p.namespaceURI, p.localName, p.value);
        });
    }
    let resultDocument = div;
    if (xsltProcessor !== undefined) {
        resultDocument = xsltProcessor.transformToFragment(div, document);
    }
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
    if (removeLightChildrenVal) {
        const slotName = target.getAttribute('name');
        const rn = target.getRootNode().host;
        const elementToClear = (slotName === null ? rn : rn.querySelector(`slot[name="${slotName}"]`));
        elementToClear.innerHTML = '';
    }
    target.classList.remove('being-ferried');
}
