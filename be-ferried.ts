import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeFerriedVirtualProps, BeFerriedActions, BeFerriedProps} from './types';
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
        this.transform(this);
    }
    async transform({isC}: this){
        if(!isC) return;
        this.#target.classList.add('being-ferried');
        let xsltProcessor: XSLTProcessor | undefined;
        if(this.xslt !== undefined){
            const xslt = await fetch(this.xslt).then(r => r.text());
            xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(new DOMParser().parseFromString(xslt, 'text/xml'));
        }
        const ns = this.#target.nextElementSibling as HTMLElement;
        ns.innerHTML = ''; 
        const fragment = document.createDocumentFragment();
        this.#target.assignedNodes().forEach(el => {

            switch(el.nodeType){
                case 1:
                    const clone = el.cloneNode(true);
                    fragment.appendChild(clone);
                    break;
            }
        });
        let resultDocument: DocumentFragment = fragment as DocumentFragment;
        if(xsltProcessor !== undefined){
            resultDocument = xsltProcessor.transformToFragment(fragment, document);
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
            virtualProps: ['xslt', 'isC'],
            proxyPropDefaults:{
                isC: true,
            }
        },
        actions:{
            transform: {
                ifAllOf: ['isC']
            }
        }
    },
    complexPropDefaults:{
        controller:BeFerriedController
    }
});

register(ifWantsToBe, upgrade, tagName);