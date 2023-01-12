import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {Actions, PP, PPE, Proxy, ProxyProps, VirtualProps} from './types';
import {register} from 'be-hive/register.js';

export const xsltLookup: {[key: string]: XSLTProcessor | 'loading'} = {};
//export const scts = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
export const remove = ['script', 'noscript'];

export class BeFerried extends EventTarget implements Actions{

    hydrate(pp: PP): PPE {
        const {self} = pp;
        return [{},{
            handleSlotChange: {
                on: 'slotchange',
                of: self
            }
        }] as PPE;
    }

    async finale(proxy: Proxy, target: HTMLSlotElement, beDecor: BeDecoratedProps){
        const {unsubscribe} = await import('trans-render/lib/subscribe.js');
        unsubscribe(proxy);
    }


    handleSlotChange(pp: PP): Partial<ProxyProps> {
        const {slotChangeCount} = pp;
        return {
            slotChangeCount: slotChangeCount + 1
        };
    }

    async onXSLT({xslt, proxy}: PP){
        const {hookUp} = await import('be-observant/hookUp.js');
        hookUp(xslt!, proxy, 'xsltHref');    
    }

    async onParameters({parameters, proxy}: PP){
        const {hookUp} = await import('be-observant/hookUp.js');
        hookUp(parameters!, proxy, 'parametersVal');
    }

    async onRemoveLightChildren({removeLightChildren, proxy}: PP){
        const {hookUp} = await import('be-observant/hookUp.js');
        hookUp(removeLightChildren!, proxy, 'removeLightChildrenVal');
    }

    ferryUnaltered({self, xsltHref, ferryCompleteCss, target}: PP){
        if(!xsltHref) return;
        const assignedNodes = self.assignedNodes();
        if(assignedNodes.length === 0) return;
        const ns = self[target!];
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
        } as PP;
    }

    async transform(pp: PP){
        const {doTransform} = await import('./doTransform.js');
        doTransform(pp);
    }
}


const tagName = 'be-ferried';

const ifWantsToBe = 'ferried';

const upgrade = 'slot';


define<Proxy & BeDecoratedProps<Proxy, Actions>, Actions>({
    config:{
        tagName,
        propDefaults:{
            ifWantsToBe,
            upgrade,
            finale: 'finale',
            virtualProps: [
                'xslt', 'isC', 'xsltHref', 'removeLightChildren',  'removeLightChildrenVal', 
                'parameters', 'parametersVal', 'ferryCompleteCss', 'ferryInProgressCss', 'target', 'debug'
            ],
            proxyPropDefaults:{
                slotChangeCount: 0,
                removeLightChildrenVal: false,
                isC: true,
                debug: false,
                ferryInProgressCss: 'being-ferried',
                ferryCompleteCss: 'ferry-complete',
                target: 'nextElementSibling',
            }
        },
        actions:{
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
    complexPropDefaults:{
        controller:BeFerried
    }
});

register(ifWantsToBe, upgrade, tagName);