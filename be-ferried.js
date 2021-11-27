import { define } from 'be-decorated/be-decorated.js';
import { hookUp } from 'be-observant/hookUp.js';
import { register } from 'be-hive/register.js';
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
    async transform({ xsltHref }) {
        this.#target.classList.add('being-ferried');
        let xsltProcessor;
        if (this.xslt !== undefined) {
            const xslt = await fetch(xsltHref).then(r => r.text());
            xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(new DOMParser().parseFromString(xsltHref, 'text/xml'));
        }
        const ns = this.#target.nextElementSibling;
        ns.innerHTML = '';
        const fragment = document.createDocumentFragment();
        const div = document.createElement('div');
        fragment.appendChild(div);
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
        let resultDocument = fragment;
        if (xsltProcessor !== undefined) {
            resultDocument = xsltProcessor.transformToFragment(fragment, document);
        }
        ns.appendChild(resultDocument);
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
            virtualProps: ['xslt', 'isC', 'xsltHref'],
            proxyPropDefaults: {
                isC: true,
                slotChangeCount: 0,
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
