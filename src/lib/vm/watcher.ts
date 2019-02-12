import { Dep } from './dep'
import { VmConfig, WatcherOption } from './model'
import { getFirstExp, isExpression } from './utils'
// Watcher is actually a subscriber
export class Watcher {
    $vm: VmConfig
    $exp: string
    $templateId: number | null;
    $cb: (opt: any) => any
    value: any
    constructor(option: WatcherOption, cb: (opt: any) => any) {
        this.$vm = option.vm
        this.$exp = this.getExp(option.exp)
        this.$cb = cb
        this.$templateId = option.templateId || null
        Dep.target = this
        Dep.templateId = option.templateId || null
        this.value = this.getVal(this.$exp)

        Dep.templateId = null
        Dep.target = null
        return this
    }

    private getExp(exp: string): any {
        if (isExpression(exp)) {
            return getFirstExp(exp)
        }
        return exp
    }

    private getVal(exp: string): any {
        const data = this.$vm.data
        const keys = exp.split('.')
        let val = data
        keys.forEach(key => (val = val[key]))
        return val
    }

    public update(): void {
        const newVal = this.getVal(this.$exp)
        if (newVal !== this.value) {
            console.log(newVal)
            this.$cb(newVal)
        }
    }
}
