import { define } from 'be-decorated/be-decorated.js';
import { hookUp } from 'be-observant/hookUp.js';
import { register } from 'be-hive/register.js';
const xsltLookup = {};
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
    async transform({ xsltHref, parametersVal }) {
        this.#target.classList.add('being-ferried');
        const ns = this.#target.nextElementSibling;
        const div = document.createElement('div');
        let nonTrivial = false;
        this.#target.assignedNodes().forEach(el => {
            switch (el.nodeType) {
                case 1:
                    nonTrivial = true;
                    const clone = el.cloneNode(true);
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
        ns.appendChild(resultDocument);
        if (this.removeLightChildren) {
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
            virtualProps: ['xslt', 'isC', 'xsltHref', 'removeLightChildren', 'parametersVal'],
            proxyPropDefaults: {
                isC: true,
                slotChangeCount: 0,
                removeLightChildren: false,
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
