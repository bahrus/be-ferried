import {BeDecoratedProps} from 'be-decorated/types';

export interface BeFerriedVirtualProps{
    xslt: string;
    xsltHref: string;
    isC: boolean;
    slotChangeCount: number;
    parameters: XSLTParameter[];
    removeLightChildren: boolean;
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
    
}