import { define } from 'be-decorated/DE.js';
import { register } from 'be-hive/register.js';
export const xsltLookup = {};
export const scts = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
export const remove = ['script', 'noscript'];
export class BeFerried extends EventTarget {
    hydrate(pp) {
        const { self } = pp;
        return [{}, {
                handleSlotChange: {
                    on: 'slotchange',
                    of: self
                }
            }];
    }
    async finale(proxy, target, beDecor) {
        const { unsubscribe } = await import('trans-render/lib/subscribe.js');
        unsubscribe(proxy);
    }
    handleSlotChange(pp) {
        const { slotChangeCount } = pp;
        return {
            slotChangeCount: slotChangeCount + 1
        };
    }
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
    ferryUnaltered({ self, xsltHref, ferryCompleteCss, target }) {
        if (!xsltHref)
            return;
        const assignedNodes = self.assignedNodes();
        if (assignedNodes.length === 0)
            return;
        const ns = self[target];
        if (ns === null)
            throw 'beFerr.404'; //TODO:  retry?
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
        self.classList.add(ferryCompleteCss);
        return {
            resolved: true,
        };
    }
    async transform(pp) {
        const { doTransform } = await import('./doTransform.js');
        doTransform(pp);
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
            finale: 'finale',
            virtualProps: [
                'xslt', 'isC', 'xsltHref', 'removeLightChildren', 'removeLightChildrenVal',
                'parameters', 'parametersVal', 'ferryCompleteCss', 'ferryInProgressCss', 'target'
            ],
            proxyPropDefaults: {
                slotChangeCount: 0,
                removeLightChildrenVal: false,
                isC: true,
                ferryInProgressCss: 'being-ferried',
                ferryCompleteCss: 'ferry-complete',
                target: 'nextElementSibling',
            }
        },
        actions: {
            hydrate: 'isC',
            onXSLT: {
                ifAllOf: ['xslt'],
            },
            transform: {
                ifAllOf: ['isC', 'xsltHref'],
                ifKeyIn: ['slotChangeCount',],
            },
            ferryUnaltered: {
                ifAllOf: ['isC'],
                ifNoneOf: ['xslt', 'xsltHref'],
                ifKeyIn: ['slotChangeCount'],
            }
        }
    },
    complexPropDefaults: {
        controller: BeFerried
    }
});
register(ifWantsToBe, upgrade, tagName);
