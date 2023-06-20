import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA} from './types';
import {register} from 'be-hive/register.js';

export const xsltLookup: {[key: string]: XSLTProcessor | 'loading'} = {};
export const remove = ['script', 'noscript'];

export class BeFerried extends BE<AP, Actions> implements Actions{
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

    transform(self: this): void {
        
    }

    ferryUnaltered(self: this): void | PAP {
        
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
            remov
        },
        propInfo: {
            ...propInfo
        },
        actions: {

        }
    },
    superclass: BeFerried
});

register(ifWantsToBe, upgrade, tagName);