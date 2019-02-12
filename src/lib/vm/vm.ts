import { Compiler } from './compiler'
import { Observer } from './observer'
import { VmConfig } from './model'
export class VM {
    constructor(vm: VmConfig) {
        new Observer(vm.data)
        new Compiler(vm)
        return vm
    }
}
