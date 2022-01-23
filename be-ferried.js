import { define } from 'be-decorated/be-decorated.js';
import { hookUp } from 'be-observant/hookUp.js';
import { register } from 'be-hive/register.js';
import { unsubscribe } from 'trans-render/lib/subscribe.js';
export const xsltLookup = {};
export const scts = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
export const remove = ['script', 'noscript'];
export class BeFerriedController {
    #target;
    intro(proxy, target, beDecor) {
        this.#target = target;
        target.addEventListener('slotchange', this.handleSlotChange);
    }
    finale(proxy, target, beDecor) {
        this.#target.removeEventListener('slotchange', this.handleSlotChange);
        unsubscribe(proxy);
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
