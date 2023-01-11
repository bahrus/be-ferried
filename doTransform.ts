import {Proxy, VirtualProps, PP, PPP} from './types';
import {scts, xsltLookup, remove} from './be-ferried.js';


export async function doTransform(pp: PP){
    const {xsltHref, parametersVal, removeLightChildrenVal, self, ferryInProgressCss, proxy, ferryCompleteCss} = pp;
    const assignedNodes = self.assignedNodes();
    if(assignedNodes.length === 0) return;
    let xsltProcessor = xsltLookup[xsltHref!];
    if(xsltProcessor === undefined){
        xsltLookup[xsltHref!] = 'loading';
        const {resolve} = await import('trans-render/lib/resolve.js');
        const mappedPath = resolve(xsltHref!);
        const xslt = await fetch(xsltHref!).then(r => r.text());
        xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(new DOMParser().parseFromString(xslt, 'text/xml'));
        xsltLookup[xsltHref!] = xsltProcessor;
    }
    if(xsltProcessor === 'loading') {
        setTimeout(() => doTransform(pp), 100);
        return;
    }
    self.classList.add(ferryInProgressCss!);
    const ns = self.nextElementSibling as HTMLElement;
    const div = document.createElement('div');
    let nonTrivial = false;
    let hasTemplate = false;
    assignedNodes.forEach(el => {
        switch(el.nodeType){
            case 1:
                nonTrivial = true;
                const isTemplate = el instanceof HTMLTemplateElement;
                if(isTemplate){
                    hasTemplate = true;
                }
                const clone = (isTemplate ? (el as HTMLTemplateElement).content.cloneNode(true) : el.cloneNode(true)) as DocumentFragment;
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
    if(!nonTrivial){
        self.classList.remove(ferryInProgressCss!);
        return;
    } 
    ns.innerHTML = ''; 

    xsltProcessor.clearParameters();
    if(parametersVal !== undefined){
        parametersVal.forEach(p => {
            (xsltProcessor as XSLTProcessor).setParameter(p.namespaceURI!, p.localName, p.value);
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
    self.classList.add(ferryCompleteCss!);
    if(removeLightChildrenVal){
        const slotName = self.getAttribute('name');
        const rn = (<any>self.getRootNode()).host as Element;
        const elementToClear = (slotName === null ? rn : rn.querySelector(`slot[name="${slotName}"]`)) as Element;
        elementToClear.innerHTML = '';
    }
    self.classList.remove(ferryInProgressCss!);
    
    proxy.resolved = true;

}