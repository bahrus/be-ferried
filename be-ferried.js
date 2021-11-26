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
    handleSlotChange = async (e) => {
        this.#target.classList.add('being-ferried');
        let xsltProcessor;
        if (this.xslt !== undefined) {
            const xslt = await fetch(this.xslt).then(r => r.text());
            xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(new DOMParser().parseFromString(xslt, 'text/xml'));
        }
        const ns = this.#target.nextElementSibling;
        this.#target.assignedNodes().forEach(el => {
            switch (el.nodeType) {
                case 1:
                    const clone = el.cloneNode(true);
                    let resultDocument = clone;
                    if (xsltProcessor !== undefined) {
                        resultDocument = xsltProcessor.transformToFragment(clone, document);
                    }
                    ns.appendChild(clone);
                    break;
            }
        });
        this.#target.classList.remove('being-ferried');
    };
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
            finale: 'finale'
        }
    },
    complexPropDefaults: {
        controller: BeFerriedController
    }
});
register(ifWantsToBe, upgrade, tagName);
