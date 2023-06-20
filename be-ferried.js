import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
export const xsltLookup = {};
export const remove = ['script', 'noscript'];
export class BeFerried extends BE {
    static get beConfig() {
        return {
            parse: true,
        };
    }
    hydrate(self) {
        const { enhancedElement } = self;
        return [{}, {
                handleSlotChange: {
                    on: 'slotchange',
                    of: enhancedElement,
                    doInit: true,
                }
            }];
    }
    handleSlotChange(self) {
        const { slotChangeCount } = self;
        return {
            slotChangeCount: slotChangeCount + 1,
        };
    }
    async transform(self) {
        const { doTransform } = await import('./doTransform.js');
        doTransform(self);
    }
    ferryUnaltered(self) {
        const { enhancedElement } = self;
        const assignedNodes = enhancedElement.assignedNodes();
        if (assignedNodes.length === 0)
            return;
        const { target, ferryCompleteCss } = self;
        const ns = enhancedElement[target];
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
}
const tagName = 'be-ferried';
const ifWantsToBe = 'ferried';
const upgrade = '*';
const xe = new XE({
    config: {
        tagName,
        propDefaults: {
            ...propDefaults,
            slotChangeCount: 0,
            removeLightChildren: false,
            isC: true,
            debug: false,
            ferryInProgressCss: 'being-ferried',
            ferryCompleteCss: 'ferry-complete',
            target: 'nextElementSibling',
        },
        propInfo: {
            ...propInfo
        },
        actions: {
            hydrate: 'isC',
            transform: {
                ifAllOf: ['isC', 'xsltHref'],
                ifKeyIn: ['slotChangeCount']
            },
            ferryUnaltered: {
                ifAllOf: ['isC', 'target'],
                ifNoneOf: ['xsltHref'],
                ifKeyIn: ['slotChangeCount']
            }
        }
    },
    superclass: BeFerried
});
register(ifWantsToBe, upgrade, tagName);
