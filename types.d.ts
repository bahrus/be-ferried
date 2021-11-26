import {BeDecoratedProps} from 'be-decorated/types';

export interface BeFerriedVirtualProps{
    xslt: string;
    isC: string;
}

export interface BeFerriedProps extends BeFerriedVirtualProps{
    proxy: HTMLSlotElement & BeFerriedVirtualProps;
}

export interface BeFerriedActions{
    intro(proxy: HTMLSlotElement & BeFerriedVirtualProps, target: HTMLSlotElement, beDecor: BeDecoratedProps): void;
    finale(proxy: HTMLSlotElement & BeFerriedVirtualProps, target: HTMLSlotElement, beDecor: BeDecoratedProps): void;
    transform(self: this): void;
}