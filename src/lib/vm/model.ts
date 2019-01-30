export interface vmConfig {
    el: HTMLElement | null;
    data: any;
    computed: any;
    methods: { [key: string]: (param: any, ...restOfName: any[]) => any };
}
