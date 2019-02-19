import { Dep } from './dep'
import { isObject } from './utils'
import { Watcher } from './watcher';

const arrayPrototype = Array.prototype as any
const arrayMethods = Object.create(arrayPrototype)
;['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach((method: string) => {
    const original = arrayPrototype[method] as any
    def(arrayMethods, method, function mutator(this: Observer) {
        const args = [...arguments]
        const result = original.apply(this, args)
        const ob = this.__ob__
        let inserted
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.slice(2)
                break
        }
        if (inserted) {
            ob.observeArray(inserted)
        }
        ob.dep.notify()
        return result
    })
})

function def(obj: Object, key: string, val: any, enumerable?: boolean) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}

export class Observer {
    public __ob__: Observer
    public dep: Dep
    constructor(data: any) {
        this.dep = new Dep()
        if (Array.isArray(data)) {
            this.observeArray(data)
        } else {
            this.walk(data)
        }
        def(data, '__ob__', this, false)
    }

    walk(obj: Object) {
        const keys = Object.keys(obj)
        keys.forEach(item => {
            this.defineReactive(obj, item)
        })
    }

    observeArray(array: any): void {
        array.forEach((item: any) => {
            if (isObject(item)) {
                new Observer(item)
            }
        })
    }

    defineReactive(data: any, key: string): void {
        let val = data[key]
        let dep = new Dep()

        if (isObject(val)) {
            this.walk(val)
        } else if (Array.isArray(val)) {
            ;(val as any).__proto__ = arrayMethods
            new Observer(val)
            return
        }
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: function() {
                if (Dep.target) {
                    if (Dep.templateId) {
                        const templateWatchers = dep.subQueue.filter((sub: Watcher) => sub.$templateId)
                        if (templateWatchers.length) {
                            templateWatchers.forEach(watcher => {
                                dep.removeSub(watcher)
                            })
                        }
                    }
                }
                dep.depend()
                return val
            },
            set: function(newVal) {
                if (val !== newVal) {
                    val = newVal
                    dep.notify()
                }
            }
        })
    }
}
