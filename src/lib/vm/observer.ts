import { Dep } from './dep'
import { isObject } from './utils'

export class Observer {
    dep: Dep;
    constructor (data: any) {
        this.dep = new Dep()
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key)
        })
    }

    defineReactive (data: any, key: string): void {
        let val = data[key]
        if (isObject(val)) {
            new Observer(val)
        }
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: () => {
                // if from new watcher getter (exclude from text compile)
                if ((Dep as any).target) {
                    this.dep.addSub((Dep as any).target)
                }
                return val
            },
            set: (newVal) => {
                if (val !== newVal) {
                    val = newVal
                    this.dep.notify()
                    if (isObject(newVal)) {
                        new Observer(newVal)
                    }
                }
            }
        })

    }
}
