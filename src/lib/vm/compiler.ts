import {
    isExpression,
    isNodeElement,
    isNodeText,
    isMustacheTagText,
    MUSTACHE_TAG_REG,
    getClickMethod,
    CLICK_TAG,
    BIND_ATTR_REG,
    FOR_DIRECTIVE_REG,
    FOR_DIRECTIVE,
    IF_DIRECTIVE_REG,
    resolveExpression,
    isExpressionWithPrimitiveType
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
                        this.for__compiler(node, direct);
                        return;
                    }

                    const ifDirective = attrNames.filter(name => {
                        return IF_DIRECTIVE_REG.test(name);
                    });
                    if (ifDirective.length) {
                        const direct = ifDirective[0];
                        this.if__compiler(node, direct);
                    }

                    const bindAttrs = attrNames.filter(name => BIND_ATTR_REG.test(name));
                    if (bindAttrs.length) {
                        bindAttrs.forEach(attr => {
                            this.attr__compiler(node, attr);
                        });
                    }
                }
                if (clickMethod) {
                    const { methods } = this.$vm;
                    const method = clickMethod.split('(')[0];
                    const bindData = Object.keys(this.$vm.data).map(key => this.$vm.data[key]);
                    node.addEventListener(CLICK_TAG, (event: MouseEvent) => methods[method].apply(this.$vm, [event, ...(bindData as any)]));
                }

                if (node.childNodes.length) {
                    this.compileNode(node);
                }
            } else if (isNodeText(node) && isMustacheTagText(node.textContent as string)) {
                this.innerText__compiler(node, RegExp.$1);
            }
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

    for__compiler(node: HTMLElement, direct: string) {
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
                    const div = document.createElement('div');
                    div.innerHTML = reRenderHTML.trim();
                    const childNode = div.lastElementChild;
                    const childData = {} as any;
                    childData[listItemExp] = listData[index];
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

    attr__compiler(node: HTMLElement, attr: string): void {
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

    innerText__compiler(node: Node, exp: string): void {
        const val = this.getVal(exp);  
        node.textContent = node.textContent ? node.textContent.replace(MUSTACHE_TAG_REG, val) : '';
        new Watcher(this.$vm, exp, val => {
            node.textContent = val;
        });
    }

    if__compiler(node: HTMLElement, direct: string): void {
        const exp = node.getAttribute(direct);
        if (exp) {
            if (isExpression(exp)) {
                const regExpMatchArray = resolveExpression(exp);
                if (regExpMatchArray) {
                    const [left, operate, right] = regExpMatchArray.slice(1);
                    const leftVal = isExpressionWithPrimitiveType(left) ? left.replace(/[\'\"]+/g, '') : this.getVal(left);
                    const rightVal = isExpressionWithPrimitiveType(right) ? right.replace(/[\'\"]+/g, '') : this.getVal(right);

                    // let equal = new Function('a', 'b', 'c', 'return a b c');
                    let equal = eval([`'${leftVal}'`, operate, `'${rightVal}'`].join(' '));
                    if (!equal) {
                        node.style.display = 'none';
                    }
                }
            } else {
                const val = this.getVal(exp);
                if (!val) {
                    node.style.display = 'none';
                }
            }
        }
    }
}
