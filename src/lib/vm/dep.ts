import { Watcher } from './watcher'

let uid = 0
export class Dep {
    public static target: any
    public static templateId: number | null
    public subQueue: Watcher[]
    public id: number
    constructor() {
        this.subQueue = []
        this.id = ++uid
    }

    public addSub(sub: Watcher): void {
        this.subQueue.push(sub)
    }

    public notify(): void {
        console.log(this.subQueue)
        this.subQueue.forEach(sub => sub.update())
    }

    public removeSub(sub: Watcher): void {
        const index = this.subQueue.indexOf(sub)
        this.subQueue.splice(index, 1)
    }
}
