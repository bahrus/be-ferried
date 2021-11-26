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
    handleSlotChange = async (e: Event) => {
        this.#target.classList.add('being-ferried');
        let xsltProcessor: XSLTProcessor | undefined;
        if(this.xslt !== undefined){
            const xslt = await fetch(this.xslt).then(r => r.text());
            xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(new DOMParser().parseFromString(xslt, 'text/xml'));
        }
        const ns = this.#target.nextElementSibling as HTMLElement;
        this.#target.assignedNodes().forEach(el => {

            switch(el.nodeType){
                case 1:
                    const clone = el.cloneNode(true);
                    let resultDocument: DocumentFragment = clone as DocumentFragment;
                    if(xsltProcessor !== undefined){
                        resultDocument = xsltProcessor.transformToFragment(clone, document);
                    }
                    ns.appendChild(clone);
                    break;
            }
        });
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
            finale: 'finale'
        }
    },
    complexPropDefaults:{
        controller:BeFerriedController
    }
});

register(ifWantsToBe, upgrade, tagName);