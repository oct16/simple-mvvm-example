import { Dep } from './dep'
import { isObject } from './utils'
import { Watcher } from './watcher'

export class Observer {
    public dep: Dep
    constructor(data: any) {
        this.dep = new Dep()
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key)
        })
    }

    private defineReactive(data: any, key: string): void {
        let val = data[key]
        if (isObject(val)) {
            new Observer(val)
        }
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: () => {
                if (Dep.target) {
                    if (Dep.templateId) {
                        const templateWatchers = this.dep.subQueue.filter((sub: Watcher) => sub.$templateId)
                        if (templateWatchers.length) {
                            templateWatchers.forEach(watcher => {
                                this.dep.removeSub(watcher)
                            })
                        }
                    }
                    this.dep.addSub(Dep.target)
                }
                return val
            },
            set: (newVal: any) => {
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
