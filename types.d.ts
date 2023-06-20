import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE} from 'be-enhanced/types';

export interface EndUserProps extends IBE{
    //xslt?: string | IObserve;
    xsltHref?: string;
    parameters?: string;// | IObserve;
    //parametersVal?: XSLTParameter[];
    removeLightChildren?: string; // | IObserve;
    //removeLightChildrenVal?: boolean;
    ferryCompleteCss?: string;
    ferryInProgressCss?: string;
    target?: 'nextElementSibling' | 'previousElementSibling',
    debug?: boolean;
}
export interface AllProps extends EndUserProps{
    isC: boolean;
    slotChangeCount: number;
}

export interface XSLTParameter{
    namespaceURI: string | null;
    localName: string;
    value: any;
}


export interface AllProps extends EndUserProps {}

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>];




export interface Actions{
    hydrate(self: this): POA;
    handleSlotChange(self: this): PAP;
    //intro(proxy: Proxy, target: HTMLSlotElement, beDecor: BeDecoratedProps): void;
    //finale(proxy: Proxy, target: HTMLSlotElement, beDecor: BeDecoratedProps): void;
    transform(self: this): void;
    ferryUnaltered(self: this): PAP | void;
    //onXSLT(self: this): void;
    //onParameters(self: this): void;
    //onRemoveLightChildren(self: this): void;
}