import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeFerriedActions, BeFerriedProps, BeFerriedVirtualProps} from './types';
import {hookUp} from 'be-observant/hookUp.js';
import {register} from 'be-hive/register.js';

const xsltLookup: {[key: string]: XSLTProcessor} = {};

export class BeFerriedController implements BeFerriedActions{
    #target!: HTMLSlotElement;
    intro(proxy: HTMLSlotElement & BeFerriedVirtualProps, target: HTMLSlotElement, beDecor: BeDecoratedProps){
        target.addEventListener('slotchange', this.handleSlotChange);
        this.#target = target;
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

    async transform({xsltHref, parameters}: this){
        this.#target.classList.add('being-ferried');
        const ns = this.#target.nextElementSibling as HTMLElement;
        const div = document.createElement('div');
        let nonTrivial = false;
        this.#target.assignedNodes().forEach(el => {
            switch(el.nodeType){
                case 1:
                    nonTrivial = true;
                    const clone = el.cloneNode(true);
                    div.appendChild(clone);
                    break;
            }
        });
        if(!nonTrivial) return;
        ns.innerHTML = ''; 
        let xsltProcessor = xsltLookup[xsltHref];
        if(xsltProcessor === undefined){
            const xslt = await fetch(xsltHref).then(r => r.text());
            xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(new DOMParser().parseFromString(xslt, 'text/xml'));
            xsltLookup[xsltHref] = xsltProcessor;
        }
        xsltProcessor.clearParameters();
        if(parameters !== undefined){
            parameters.forEach(p => {
                xsltProcessor.setParameter(p.namespaceURI, p.localName, p.value);
            });
        }
        
        let resultDocument: DocumentFragment = div as any as DocumentFragment;
        if(xsltProcessor !== undefined){
            resultDocument = xsltProcessor.transformToFragment(div, document);
        }
        
        ns.appendChild(resultDocument);
        if(this.removeLightChildren){
            const slotName = this.#target.getAttribute('name');
            const rn = (<any>this.#target.getRootNode()).host as Element;
            const elementToClear = (slotName === null ? rn : rn.querySelector(`slot[name="${slotName}"]`)) as Element;
            elementToClear.innerHTML = '';
        }
        this.#target.classList.remove('being-ferried');
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
            virtualProps: ['xslt', 'isC', 'xsltHref', 'removeLightChildren', 'parameters'],
            proxyPropDefaults:{
                isC: true,
                slotChangeCount: 0,
                removeLightChildren: false,
            }
        },
        actions:{
            onXSLT: {
                ifAllOf: ['xslt'],
            },
            transform: {
                ifAllOf: ['isC', 'xsltHref'],
                ifKeyIn: ['slotChangeCount']
            }
        }
    },
    complexPropDefaults:{
        controller:BeFerriedController
    }
});

register(ifWantsToBe, upgrade, tagName);