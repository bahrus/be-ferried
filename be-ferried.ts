import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {Actions, PP, Proxy, VirtualProps} from './types';
import {register} from 'be-hive/register.js';

export const xsltLookup: {[key: string]: XSLTProcessor | 'loading'} = {};
export const scts = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
export const remove = ['script', 'noscript'];

export class BeFerriedController implements Actions{
    #abortController: AbortController | undefined;
    intro(proxy: Proxy, target: HTMLSlotElement, beDecor: BeDecoratedProps){
        this.#abortController = new AbortController();
        target.addEventListener('slotchange', e => {
            this.handleSlotChange(proxy);
        }, {
            signal: this.#abortController.signal,
        });
        
    }
    async finale(proxy: Proxy, target: HTMLSlotElement, beDecor: BeDecoratedProps){
        const {unsubscribe} = await import('trans-render/lib/subscribe.js');
        unsubscribe(proxy);
    }
    handleSlotChange(proxy: Proxy) {
        proxy.slotChangeCount++;
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

    ferryUnaltered({self, xsltHref}: PP){
        if(!xsltHref) return;
        const assignedNodes = self.assignedNodes();
        if(assignedNodes.length === 0) return;
        const ns = self.nextElementSibling!;
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
    }

    async transform({xsltHref, parametersVal, self, proxy}: PP){
        const {doTransform} = await import('./doTransform.js');
        doTransform(proxy, self);
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
            intro: 'intro',
            finale: 'finale',
            virtualProps: ['xslt', 'isC', 'xsltHref', 'removeLightChildren',  'removeLightChildrenVal', 'parameters', 'parametersVal'],
            proxyPropDefaults:{
                isC: true,
                slotChangeCount: 0,
                removeLightChildrenVal: false,
            }
        },
        actions:{
            onXSLT: {
                ifAllOf: ['xslt'],
            },
            transform: {
                ifAllOf: ['isC', 'xsltHref'],
                ifKeyIn: ['slotChangeCount',],
            },
            ferryUnaltered: {
                ifAllOf: ['isC'],
                ifKeyIn: ['slotChangeCount',],
            }
        }
    },
    complexPropDefaults:{
        controller:BeFerriedController
    }
});

register(ifWantsToBe, upgrade, tagName);