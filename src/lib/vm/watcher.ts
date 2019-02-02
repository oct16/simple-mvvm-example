import { Dep } from './dep'
import { vmConfig } from './model'
// Watcher is actually a subscriber
export class Watcher {
    $vm: vmConfig
    $exp: string
    $cb: (opt: any) => any
    value: any
    constructor(vm: vmConfig, exp: string, cb: (opt: any) => any) {
        this.$vm = vm
        this.$exp = exp
        this.$cb = cb

        ;(Dep as any).target = this // get target for add dep
        this.value = this.getVal(exp)
        ;(Dep as any).target = null
    }

    getVal(exp: string): any {
        const data = this.$vm.data
        const keys = exp.split('.')
        let val = data
        keys.forEach(key => (val = val[key]))
        return val
    }

    // notify the latest result
    update(): void {
        const newVal = this.getVal(this.$exp)
        if (newVal !== this.value) {
            ;(this.$cb as any).call(this.$vm, newVal, this.value)
        }
    }
}
