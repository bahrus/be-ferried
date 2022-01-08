import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeFerriedActions, BeFerriedProps, BeFerriedVirtualProps} from './types';
import {hookUp} from 'be-observant/hookUp.js';
import {register} from 'be-hive/register.js';

export const xsltLookup: {[key: string]: XSLTProcessor | 'loading'} = {};
export const scts = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
export const remove = ['script', 'noscript'];

export class BeFerriedController implements BeFerriedActions{
    #target!: HTMLSlotElement;
    intro(proxy: HTMLSlotElement & BeFerriedVirtualProps, target: HTMLSlotElement, beDecor: BeDecoratedProps){
        this.#target = target;
        target.addEventListener('slotchange', this.handleSlotChange);
        
    }
    finale(proxy: HTMLSlotElement & BeFerriedVirtualProps, target: HTMLSlotElement, beDecor: BeDecoratedProps){
        this.#target.removeEventListener('slotchange', this.handleSlotChange);
    }
    handleSlotChange = (e: Event) => {
        this.proxy.slotChangeCount++;
        //this.transform(this);
    }

    onXSLT({xslt, proxy}: this){
        hookUp(xslt, proxy, 'xsltHref');    
    }

    onParameters({parameters, proxy}: this){
        hookUp(parameters, proxy, 'parametersVal');
    }

    onRemoveLightChildren({removeLightChildren, proxy}: this){
        hookUp(removeLightChildren, proxy, 'removeLightChildrenVal');
    }

    ferryUnaltered({}: this){
        const assignedNodes = this.#target.assignedNodes();
        if(assignedNodes.length === 0) return;
        const ns = this.#target.nextElementSibling!;
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

    async transform({xsltHref, parametersVal}: this){
        const {doTransform} = await import('./doTransform.js');
        doTransform(this, this.#target);
    }
}

export interface BeFerriedController extends BeFerriedProps{}

const tagName = 'be-ferried';

const ifWantsToBe = 'ferried';

const upgrade = 'slot';


define<BeFerriedProps & BeDecoratedProps<BeFerriedProps, BeFerriedActions>, BeFerriedActions>({
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
                ifNoneOf: ['xsltHref'],
                ifKeyIn: ['slotChangeCount',],
            }
        }
    },
    complexPropDefaults:{
        controller:BeFerriedController
    }
});

register(ifWantsToBe, upgrade, tagName);