import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA} from './types';
import {register} from 'be-hive/register.js';

export const xsltLookup: {[key: string]: XSLTProcessor | 'loading'} = {};
export const remove = ['script', 'noscript'];

export class BeFerried extends BE<AP, Actions, HTMLSlotElement> implements Actions{
    static override get beConfig(){
        return {
            parse: true,

        }
    }

    hydrate(self: this): POA {
        const {enhancedElement} = self;
        return [{}, {
            handleSlotChange: {
                on: 'slotchange',
                of: enhancedElement,
                doInit: true,
            }
        }]
    }

    handleSlotChange(self: this): PAP {
        const {slotChangeCount} = self;
        return {
            slotChangeCount: slotChangeCount + 1,
        };
    }

    async transform(self: this) {
        const {doTransform} = await import('./doTransform.js');
        doTransform(self);
    }

    ferryUnaltered(self: this): void | PAP {
        const {enhancedElement} = self;
        const assignedNodes = enhancedElement.assignedNodes();
        if(assignedNodes.length === 0) return;
        const {target, ferryCompleteCss} = self;
        const ns = enhancedElement[target!];
        if(ns === null) throw 'beFerr.404'; //TODO:  retry?
        ns.innerHTML = '';
        assignedNodes.forEach(el => {
            switch(el.nodeType){
                case 1:
                case 3:
                    const clone = el.cloneNode(true) as HTMLElement;
                    ns.appendChild(clone);
                    break;
            }
        });
        self.classList.add(ferryCompleteCss!);
        return {
            resolved: true,
        } as PAP;
    }

    // onXSLT(self: this): void {
        
    // }

    // onParameters(self: this): void {
        
    // }

    // onRemoveLightChildren(self: this): void {
        
    // }
}

export interface BeFerried extends AllProps{}

const tagName = 'be-ferried';
const ifWantsToBe = 'ferried';
const upgrade = '*';

const xe = new XE<AP, Actions>({
    config:{
        tagName,
        propDefaults:{
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
            transform:{
                ifAllOf: ['isC', 'xsltHref'],
                ifKeyIn: ['slotChangeCount']
            },
            ferryUnaltered:{
                ifAllOf: ['isC', 'target'],
                ifNoneOf: ['xsltHref'],
                ifKeyIn: ['slotChangeCount']
            }
        }
    },
    superclass: BeFerried
});

register(ifWantsToBe, upgrade, tagName);