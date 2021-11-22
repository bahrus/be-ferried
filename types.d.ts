import {BeDecoratedProps} from 'be-decorated/types';

export interface BeFerriedVirtualProps{

}

export interface BeFerriedProps extends BeFerriedVirtualProps{
    proxy: HTMLSlotElement & BeFerriedVirtualProps;
}

export interface BeFerriedActions{
    
}