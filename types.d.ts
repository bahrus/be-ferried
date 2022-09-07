import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';
import {IObserve} from 'be-observant/types';

export interface EndUserProps{
    xslt?: string | IObserve;
    xsltHref?: string;
    parameters?: string | IObserve;
    parametersVal?: XSLTParameter[];
    removeLightChildren?: string | IObserve;
    removeLightChildrenVal?: boolean;
}
export interface VirtualProps extends EndUserProps, MinimalProxy<HTMLSlotElement>{
    isC: boolean;
    slotChangeCount: number;
}

export interface XSLTParameter{
    namespaceURI: string | null;
    localName: string;
    value: any;
}

export type Proxy = HTMLSlotElement & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export interface Actions{
    intro(proxy: Proxy, target: HTMLSlotElement, beDecor: BeDecoratedProps): void;
    finale(proxy: Proxy, target: HTMLSlotElement, beDecor: BeDecoratedProps): void;
    transform(pp: PP): void;
    ferryUnaltered(pp: PP): void;
    onXSLT(pp: PP): void;
    onParameters(pp: PP): void;
    onRemoveLightChildren(pp: PP): void;
}