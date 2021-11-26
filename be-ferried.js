import { define } from 'be-decorated/be-decorated.js';
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
        this.transform(this);
    };
    async transform({ isC }) {
        if (!isC)
            return;
        this.#target.classList.add('being-ferried');
        let xsltProcessor;
        if (this.xslt !== undefined) {
            const xslt = await fetch(this.xslt).then(r => r.text());
            xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(new DOMParser().parseFromString(xslt, 'text/xml'));
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
            virtualProps: ['xslt', 'isC'],
            proxyPropDefaults: {
                isC: true,
            }
        },
        actions: {
            transform: {
                ifAllOf: ['isC']
            }
        }
    },
    complexPropDefaults: {
        controller: BeFerriedController
    }
});
register(ifWantsToBe, upgrade, tagName);
