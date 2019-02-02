let uid = 0
export class Dep {
    public target: any
    public subQueue: any[]
    public id: number
    constructor() {
        this.subQueue = []
        this.id = uid++
    }

    public addSub(sub: any): void {
        this.subQueue.push(sub)
    }

    public notify(): void {
        this.subQueue.forEach(sub => sub.update())
    }

    public removeSub(sub: any[]): void {
        const index = this.subQueue.indexOf(sub)
        this.subQueue.splice(index, 1)
    }
}

;(Dep as any).target = null
