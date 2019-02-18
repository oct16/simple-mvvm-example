export interface VmConfig {
    el: HTMLElement | null
    parent?: VmConfig
    data: any
    computed: any
    methods: { [key: string]: (param: any, ...restOfName: any[]) => any }
}

export interface WatcherOption {
    vm: VmConfig
    exp: string;
    templateId?: number
}
export interface compileNodeOption {
    isReplace?: boolean;
    templateId?: number
}