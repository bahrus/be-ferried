import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeFerriedActions, BeFerriedProps, BeFerriedVirtualProps} from './types';
import {hookUp} from 'be-observant/hookUp.js';
import {register} from 'be-hive/register.js';

const xsltLookup: {[key: string]: XSLTProcessor | 'loading'} = {};
const scts = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

const remove = ['script', 'noscript'];

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

    onParameters({parameters, proxy}: this){
        hookUp(parameters, proxy, 'parametersVal');
    }

    onRemoveLightChildren({removeLightChildren, proxy}: this){
        hookUp(removeLightChildren, proxy, 'removeLightChildrenVal');
    }

    async transform({xsltHref, parametersVal}: this){
        let xsltProcessor = xsltLookup[xsltHref];
        if(xsltProcessor === undefined){
            xsltLookup[xsltHref] = 'loading';
            const xslt = await fetch(xsltHref).then(r => r.text());
            xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(new DOMParser().parseFromString(xslt, 'text/xml'));
            xsltLookup[xsltHref] = xsltProcessor;
        }
        if(xsltProcessor === 'loading') {
            setTimeout(() => this.transform(this), 100);
            return;
        }
        this.#target.classList.add('being-ferried');
        const ns = this.#target.nextElementSibling as HTMLElement;
        const div = document.createElement('div');
        let nonTrivial = false;
        let hasTemplate = false;
        this.#target.assignedNodes().forEach(el => {
            switch(el.nodeType){
                case 1:
                    nonTrivial = true;
                    const isTemplate = el instanceof HTMLTemplateElement;
                    if(isTemplate){
                        hasTemplate = true;
                    }
                    const clone = (isTemplate ? el.content.cloneNode(true) : el.cloneNode(true)) as DocumentFragment;
                    const problemTags = clone.querySelectorAll(scts.join(','));
                    problemTags.forEach(tag => {
                        const newTag = document.createElement(tag.localName + '-ish');
                        for(let i = 0, ii = tag.attributes.length; i < ii; i++){
                            newTag.setAttribute(tag.attributes[i].name, tag.attributes[i].value);
                        }
                        tag.insertAdjacentElement('afterend', newTag);
                    });
                    problemTags.forEach(tag => tag.remove());
                    const forbiddenTags = clone.querySelectorAll(remove.join(','));
                    forbiddenTags.forEach(tag => tag.remove());
                    div.appendChild(clone);
                    break;
            }
        });
        if(!nonTrivial) return;
        ns.innerHTML = ''; 

        xsltProcessor.clearParameters();
        if(parametersVal !== undefined){
            parametersVal.forEach(p => {
                (xsltProcessor as XSLTProcessor).setParameter(p.namespaceURI, p.localName, p.value);
            });
        }
        
        let resultDocument: DocumentFragment = div as any as DocumentFragment;
        if(xsltProcessor !== undefined){
            resultDocument = xsltProcessor.transformToFragment(div, document);
        }
        if(hasTemplate){
            const arr = resultDocument.children;
            const h: string[] = [];
            for(const item of arr){
                h.push(item.outerHTML);
            }
            ns.innerHTML = h.join('');
        }else{
            ns.appendChild(resultDocument);
        }

        if(this.removeLightChildrenVal){
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
                ifKeyIn: ['slotChangeCount']
            }
        }
    },
    complexPropDefaults:{
        controller:BeFerriedController
    }
});

register(ifWantsToBe, upgrade, tagName);