import {
    isNodeElement,
    isNodeText,
    isMustacheTagText,
    MUSTACHE_TAG_REG,
    getClickMethod,
    CLICK_TAG,
    BIND_ATTR_REG,
    FOR_DIRECTIVE_REG,
    FOR_DIRECTIVE
} from './utils';
import { Watcher } from './watcher';
import { vmConfig } from './model';
import { VM } from './vm';
export class Compiler {
    $vm: vmConfig;
    $data: any;
    $computed: any;
    $methods: { [key: string]: (param: any, ...restOfName: any[]) => any };
    $el: HTMLElement;
    constructor(vm: vmConfig) {
        this.$vm = vm;
        this.$data = vm.data;
        this.$computed = vm.computed;
        this.$methods = vm.methods;
        this.$el = vm.el as HTMLElement;

        this.compileEl(this.$el);
    }

    compileEl(el: HTMLElement): void {
        const frag = this.node2frag(el);
        this.compileNode(frag);
        el.appendChild(frag);
    }

    node2frag(el: HTMLElement): DocumentFragment {
        const frag = document.createDocumentFragment();
        while (el.lastChild) {
            frag.appendChild(el.lastChild);
        }
        return frag;
    }

    compileNode(frag: DocumentFragment | HTMLElement): void {
        const nodes = Array.prototype.slice.call(frag.childNodes);

        nodes.forEach((node: HTMLElement) => {
            if (isNodeElement(node)) {
                const clickMethod = getClickMethod(node);
                const attrNames = node.getAttributeNames();

                if (attrNames.length) {
                    const forDirective = attrNames.filter(name => {
                        return FOR_DIRECTIVE_REG.test(name);
                    });
                    if (forDirective.length) {
                        const direct = forDirective[0];
                        this.compileForDirective(node, direct);
                        return;
                    }

                    const bindAttrs = attrNames.filter(name => BIND_ATTR_REG.test(name));
                    if (bindAttrs.length) {
                        bindAttrs.forEach(attr => {
                            this.compileBindAttr(node, attr);
                        });
                    }
                }
                if (clickMethod) {
                    const { methods } = this.$vm;
                    const method = clickMethod.split('(')[0]
                    const bindData = Object.keys(this.$vm.data).map(key => this.$vm.data[key])
                    node.addEventListener(CLICK_TAG, (event: MouseEvent) => methods[method].apply(this.$vm, [event, ...bindData as any]));
                }

                if (node.childNodes.length) {
                    this.compileNode(node);
                }
            } else if (isNodeText(node) && isMustacheTagText(node.textContent as string)) {
                this.compileText(node, RegExp.$1);
            }
        });
    }

    compileForDirective(node: HTMLElement, direct: string) {
        const exp = node.getAttribute(direct);
        if (exp) {
            const [listItemExp, listExp] = exp.split('of').map(item => item.trim());
            const listData = this.getVal(listExp);
            node.removeAttribute(FOR_DIRECTIVE);
            if (Array.isArray(listData)) {
                const reRenderHTML = node.outerHTML;
                const nodeParent = node.parentNode as HTMLElement;
                nodeParent.innerHTML = '';
                listData.forEach((_, index) => {
                    const div = document.createElement('span');
                    div.innerHTML = reRenderHTML.trim();
                    const childNode = div.firstChild;
                    const childData = {} as any;
                    childData[listItemExp] = this.$data[listExp][index];
                    nodeParent.append(childNode as ChildNode);
                    new VM({
                        el: childNode,
                        data: childData,
                        computed: this.$computed,
                        methods: this.$methods
                    } as vmConfig);
                });
            }
        }
    }

    compileBindAttr(node: HTMLElement, attr: string): void {
        const exp = node.getAttribute(attr);
        const length = attr.length;
        const pureAttr = attr.substring(1, length - 1);
        if (exp) {
            const val = this.getVal(exp);
            if (val) {
                node.setAttribute(pureAttr, val);
            }
            node.removeAttribute(attr);
            new Watcher(this.$vm, exp, val => {
                node.setAttribute(pureAttr, val);
            });
        }
    }

    compileText(node: Node, exp: string): void {
        const val = this.getVal(exp);
        node.textContent = node.textContent ? node.textContent.replace(MUSTACHE_TAG_REG, val) : '';
        new Watcher(this.$vm, exp, val => {
            node.textContent = val;
        });
    }

    getVal(exp: string): any {
        let val = this.$data;
        const keys = exp.split('.');
        keys.forEach(key => {
            val = val[key];
        });

        return val;
    }
}
