import {BeDecoratedProps} from 'be-decorated/types';
import {IObserve} from 'be-observant/types';

export interface BeFerriedVirtualProps{
    xslt: string | IObserve;
    xsltHref: string;
    isC: boolean;
    slotChangeCount: number;
    parameters: string | IObserve;
    parametersVal: XSLTParameter[];
    removeLightChildren: string | IObserve;
    removeLightChildrenVal: boolean;
}

export interface XSLTParameter{
    namespaceURI: string | null;
    localName: string;
    value: any;
}
export interface BeFerriedProps extends BeFerriedVirtualProps{
    proxy: HTMLSlotElement & BeFerriedVirtualProps;
}

export interface BeFerriedActions{
    intro(proxy: HTMLSlotElement & BeFerriedVirtualProps, target: HTMLSlotElement, beDecor: BeDecoratedProps): void;
    finale(proxy: HTMLSlotElement & BeFerriedVirtualProps, target: HTMLSlotElement, beDecor: BeDecoratedProps): void;
    transform(self: this): void;
    onXSLT(self: this): void;
    onParameters(self: this): void;
    onRemoveLightChildren(self: this): void;
}