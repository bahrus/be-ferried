import { define } from 'be-decorated/be-decorated.js';
import { hookUp } from 'be-observant/hookUp.js';
import { register } from 'be-hive/register.js';
const xsltLookup = {};
const scts = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
export class BeFerriedController {
    #target;
    intro(proxy, target, beDecor) {
        target.addEventListener('slotchange', this.handleSlotChange);
        this.#target = target;
    }
    finale(proxy, target, beDecor) {
        this.#target.removeEventListener('slotchange', this.handleSlotChange);
    }
    handleSlotChange = (e) => {
        this.proxy.slotChangeCount++;
        //this.transform(this);
    };
    onXSLT({ xslt, proxy }) {
        hookUp(xslt, proxy, 'xsltHref');
    }
    onParameters({ parameters, proxy }) {
        hookUp(parameters, proxy, 'parametersVal');
    }
    onRemoveLightChildren({ removeLightChildren, proxy }) {
        hookUp(removeLightChildren, proxy, 'removeLightChildrenVal');
    }
    async transform({ xsltHref, parametersVal }) {
        this.#target.classList.add('being-ferried');
        const ns = this.#target.nextElementSibling;
        const div = document.createElement('div');
        let nonTrivial = false;
        this.#target.assignedNodes().forEach(el => {
            switch (el.nodeType) {
                case 1:
                    nonTrivial = true;
                    const isTemplate = el instanceof HTMLTemplateElement;
                    const clone = (isTemplate ? el.content.cloneNode(true) : el.cloneNode(true));
                    const problemTags = clone.querySelectorAll(scts.join(','));
                    problemTags.forEach(tag => {
                        const newTag = document.createElement(tag.localName + '-ish');
                        for (let i = 0, ii = tag.attributes.length; i < ii; i++) {
                            newTag.setAttribute(tag.attributes[i].name, tag.attributes[i].value);
                            tag.insertAdjacentElement('afterend', newTag);
                        }
                    });
                    problemTags.forEach(tag => tag.remove());
                    div.appendChild(clone);
                    break;
            }
        });
        if (!nonTrivial)
            return;
        ns.innerHTML = '';
        let xsltProcessor = xsltLookup[xsltHref];
        if (xsltProcessor === undefined) {
            const xslt = await fetch(xsltHref).then(r => r.text());
            xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(new DOMParser().parseFromString(xslt, 'text/xml'));
            xsltLookup[xsltHref] = xsltProcessor;
        }
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
        const arr = resultDocument.children;
        const h = [];
        for (const item of arr) {
            h.push(item.outerHTML);
        }
        ns.innerHTML = h.join('');
        if (this.removeLightChildrenVal) {
            const slotName = this.#target.getAttribute('name');
            const rn = this.#target.getRootNode().host;
            const elementToClear = (slotName === null ? rn : rn.querySelector(`slot[name="${slotName}"]`));
            elementToClear.innerHTML = '';
        }
        this.#target.classList.remove('being-ferried');
    }
}
const tagName = 'be-ferried';
const ifWantsToBe = 'ferried';
const upgrade = 'slot';
define({
    config: {
        tagName,
        propDefaults: {
            ifWantsToBe,
            upgrade,
            intro: 'intro',
            finale: 'finale',
            virtualProps: ['xslt', 'isC', 'xsltHref', 'removeLightChildren', 'removeLightChildrenVal', 'parameters', 'parametersVal'],
            proxyPropDefaults: {
                isC: true,
                slotChangeCount: 0,
                removeLightChildrenVal: false,
            }
        },
        actions: {
            onXSLT: {
                ifAllOf: ['xslt'],
            },
            transform: {
                ifAllOf: ['isC', 'xsltHref'],
                ifKeyIn: ['slotChangeCount']
            }
        }
    },
    complexPropDefaults: {
        controller: BeFerriedController
    }
});
register(ifWantsToBe, upgrade, tagName);
