import { Watcher } from './watcher'

const map = new Map()
let uid = 0
export class TemplateStore {
    get id() {
        return ++uid
    }
    private static IF_PREFIX = 'if_'
    private static FOR_PREFIX = 'for_'
    private static IF_WATCHER_PREFIX = 'if_watcher_'
    private static ELSE_PREFIX = 'else_'
    public set(key: any, val: any): void {
        map.set(key, val)
    }

    public get(key: any): any {
        return map.get(key)
    }

    public setForHTML(id: number, html: string): void {
        this.set(TemplateStore.FOR_PREFIX + id, html)
    }
    public getForHTML(id: number): string {
        return this.get(TemplateStore.FOR_PREFIX + id)
    }

    public setIfHTML(id: number, html: string): void {
        this.set(TemplateStore.IF_PREFIX + id, html)
    }

    public setElseHTML(id: number, html: string): void {
        this.set(TemplateStore.ELSE_PREFIX + id, html)
    }

    public getIfHTML(id: number): string {
        return this.get(TemplateStore.IF_PREFIX + id)
    }

    public getElseHTML(id: number): string {
        return this.get(TemplateStore.ELSE_PREFIX + id)
    }

    public getIfWatcher(id: number): Watcher {
        return this.get(TemplateStore.IF_WATCHER_PREFIX + id)
    }

    public setIfWatcher(id: number, watcher: Watcher): void {
        this.set(TemplateStore.IF_WATCHER_PREFIX + id, watcher)
    }
}
