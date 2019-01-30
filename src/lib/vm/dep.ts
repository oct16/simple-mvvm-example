let uid = 0;
export class Dep {
    target: any;
    subQueue: any[];
    id: number;
    constructor() {
        this.subQueue = [];
        this.id = uid++;
    }

    addSub(sub: any): void {
        this.subQueue.push(sub);
    }

    notify(): void {
        this.subQueue.forEach(sub => sub.update());
    }

    removeSub(sub: any[]): void {
        const index = this.subQueue.indexOf(sub);
        this.subQueue.splice(index, 1);
    }
}

(Dep as any).target = null;
