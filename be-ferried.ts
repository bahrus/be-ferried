import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeFerriedVirtualProps, BeFerriedActions, BeFerriedProps} from './types';
import {register} from 'be-hive/register.js';

export class BeFerriedController implements BeFerriedActions{

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
            upgrade
        }
    },
    complexPropDefaults:{
        controller:BeFerriedController
    }
});

register(ifWantsToBe, upgrade, tagName);