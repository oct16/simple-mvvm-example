import { Compiler } from './compiler';
import { Observer } from './observer';
import { vmConfig } from './model';
export class VM {
    constructor(vm: vmConfig) {
        new Observer(vm.data);
        new Compiler(vm);
        return vm
    }
}