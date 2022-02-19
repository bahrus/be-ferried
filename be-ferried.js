import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export const xsltLookup = {};
export const scts = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
export const remove = ['script', 'noscript'];
export class BeFerriedController {
    #target;
    intro(proxy, target, beDecor) {
        this.#target = target;
        target.addEventListener('slotchange', this.handleSlotChange);
    }
    async finale(proxy, target, beDecor) {
        this.#target.removeEventListener('slotchange', this.handleSlotChange);
        const { unsubscribe } = await import('trans-render/lib/subscribe.js');
        unsubscribe(proxy);
    }
    handleSlotChange = (e) => {
        this.proxy.slotChangeCount++;
        //this.transform(this);
    };
    async onXSLT({ xslt, proxy }) {
        const { hookUp } = await import('be-observant/hookUp.js');
        hookUp(xslt, proxy, 'xsltHref');
    }
    async onParameters({ parameters, proxy }) {
        const { hookUp } = await import('be-observant/hookUp.js');
        hookUp(parameters, proxy, 'parametersVal');
    }
    async onRemoveLightChildren({ removeLightChildren, proxy }) {
        const { hookUp } = await import('be-observant/hookUp.js');
        hookUp(removeLightChildren, proxy, 'removeLightChildrenVal');
    }
    ferryUnaltered({}) {
        const assignedNodes = this.#target.assignedNodes();
        if (assignedNodes.length === 0)
            return;
        const ns = this.#target.nextElementSibling;
        ns.innerHTML = '';
        assignedNodes.forEach(el => {
            switch (el.nodeType) {
                case 1:
                case 3:
                    const clone = el.cloneNode(true);
                    ns.appendChild(clone);
                    break;
            }
        });
    }
    async transform({ xsltHref, parametersVal }) {
        const { doTransform } = await import('./doTransform.js');
        doTransform(this, this.#target);
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
                ifKeyIn: ['slotChangeCount',],
            },
            ferryUnaltered: {
                ifAllOf: ['isC'],
                ifNoneOf: ['xsltHref'],
                ifKeyIn: ['slotChangeCount',],
            }
        }
    },
    complexPropDefaults: {
        controller: BeFerriedController
    }
});
register(ifWantsToBe, upgrade, tagName);
