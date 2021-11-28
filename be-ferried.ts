import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeFerriedActions, BeFerriedProps, BeFerriedVirtualProps} from './types';
import {hookUp} from 'be-observant/hookUp.js';
import {register} from 'be-hive/register.js';

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
        ns.innerHTML = ''; 
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
        const xslt = await fetch(xsltHref).then(r => r.text());
        const xsltProcessor = new XSLTProcessor();
        if(parameters !== undefined){
            parameters.forEach(p => {
                xsltProcessor.setParameter(p.namespaceURI, p.localName, p.value);
            });
        }
        xsltProcessor.importStylesheet(new DOMParser().parseFromString(xslt, 'text/xml'));
        let resultDocument: DocumentFragment = div as any as DocumentFragment;
        if(xsltProcessor !== undefined){
            resultDocument = xsltProcessor.transformToFragment(div, document);
        }
        
        ns.appendChild(resultDocument);
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
            virtualProps: ['xslt', 'isC', 'xsltHref'],
            proxyPropDefaults:{
                isC: true,
                slotChangeCount: 0,
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