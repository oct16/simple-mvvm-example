import { VmConfig, compileNodeOption } from './model'
import {
    BIND_ATTR_REG,
    calculateExpression,
    CLICK_TAG,
    ELSE_DIRECTIVE,
    ELSE_DIRECTIVE_REG,
    FOR_DIRECTIVE,
    FOR_DIRECTIVE_REG,
    getClickMethod,
    IF_DIRECTIVE,
    IF_DIRECTIVE_REG,
    isExpression,
    isMustacheTagText,
    isNodeElement,
    isNodeText,
    MUSTACHE_TAG_REG
} from './utils'
import { VM } from './vm'
import { Watcher } from './watcher'
import { TemplateStore } from './store'

export class Compiler {
    private $vm: VmConfig
    private $data: any
    private $computed: any
    private $methods: { [key: string]: (param: any, ...restOfName: any[]) => any }
    private $el: HTMLElement
    private $templateStore = new TemplateStore()
    constructor(vm: VmConfig) {
        this.$el = vm.el as HTMLElement
        this.$vm = vm
        this.$data = vm.data
        this.$computed = vm.computed
        this.$methods = vm.methods
        this.compileEl(this.$el)
    }

    private compileEl(el: HTMLElement): void {
        const frag = this.node2frag(el)
        this.compileNodes(frag)
        el.appendChild(frag)
    }

    private node2frag(el: HTMLElement): DocumentFragment {
        const frag = document.createDocumentFragment()
        while (el.lastChild) {
            frag.appendChild(el.lastChild)
        }
        return frag
    }

    private compileNodes(frag: DocumentFragment | HTMLElement): void {
        const nodes = Array.prototype.slice.call(frag.childNodes)
        nodes.forEach((node: HTMLElement) => {
            this.compileNode(node)
        })
    }

    private compileNode(node: HTMLElement, templateId?: number): void {
        if (templateId) {
            const ifHTML = this.$templateStore.getIfHTML(templateId)
            const elseHTML = this.$templateStore.getElseHTML(templateId)

            if (ifHTML) {
                const div = document.createElement('div')
                div.innerHTML = ifHTML
                const parentNode = node.parentElement
                if (parentNode) {
                    if (elseHTML) {
                        const div = document.createElement('div')
                        div.innerHTML = elseHTML
                        parentNode.replaceChild(div.lastChild as HTMLElement, node.nextElementSibling as HTMLElement)
                    }
                    parentNode.replaceChild(div.lastChild as HTMLElement, node)
                    this.compileNode(parentNode)
                }
            }
        }

        if (isNodeElement(node)) {
            const clickMethod = getClickMethod(node)
            const attrNames = node.getAttributeNames()

            if (attrNames.length) {
                const forDirective = attrNames.filter(name => FOR_DIRECTIVE_REG().test(name))
                if (forDirective.length) {
                    const direct = forDirective[0]
                    this.for__compiler(node, direct)
                    return
                }

                const ifDirective = attrNames.filter(name => IF_DIRECTIVE_REG().test(name))
                if (ifDirective.length) {
                    const direct = ifDirective[0]
                    this.if__compiler(node, direct, templateId)
                }

                const bindAttrs = attrNames.filter(name => BIND_ATTR_REG().test(name))
                if (bindAttrs.length) {
                    bindAttrs.forEach(attr => {
                        this.attr__compiler(node, attr)
                    })
                }
            }
            if (clickMethod) {
                const { methods } = this.$vm
                const method = clickMethod.split('(')[0]
                const bindData = Object.keys(this.$vm.data).map(key => this.$vm.data[key])
                node.addEventListener(CLICK_TAG, (e: MouseEvent) => methods[method].apply(this.$vm, [e, ...(bindData as any)]))
            }

            if (node.childNodes.length) {
                this.compileNodes(node)
            }
        } else if (isNodeText(node) && isMustacheTagText(node.textContent as string)) {
            this.innerText__compiler(node, RegExp.$1)
        }
    }

    private getVal(exp: string): any {
        let val = this.$data
        const keys = exp.split('.')
        keys.forEach(key => {
            val = val[key]
        })
        return val
    }

    private for__compiler(node: HTMLElement, direct: string): void {
        const exp = node.getAttribute(direct)
        if (exp) {
            const [itemExp, arrayExp] = exp.split('of').map(item => item.trim())
            const arrayData = this.getVal(arrayExp)
            node.removeAttribute(FOR_DIRECTIVE)
            if (Array.isArray(arrayData)) {
                const reRenderHTML = node.outerHTML
                const nodeParent = node.parentNode as HTMLElement
                nodeParent.innerHTML = ''
                arrayData.forEach((_, index) => {
                    const div = document.createElement('div')
                    div.innerHTML = reRenderHTML.trim()
                    const childNode = div.lastChild as Element
                    const childData = {} as any
                    childData[itemExp] = arrayData[index]
                    new VM({
                        computed: this.$computed,
                        data: childData,
                        el: childNode.parentNode,
                        methods: this.$methods
                    } as VmConfig)
                    nodeParent.append(childNode as ChildNode)
                })
            }
        }
    }

    private attr__compiler(node: HTMLElement, attr: string): void {
        const exp = node.getAttribute(attr)
        const length = attr.length
        const pureAttr = attr.substring(1, length - 1)
        if (exp) {
            if (isExpression(exp)) {
                const equal = calculateExpression(exp, this.getVal.bind(this))
                if (equal) {
                    node.setAttribute(pureAttr, 'true')
                }
            } else {
                const val = this.getVal(exp)
                if (val) {
                    node.setAttribute(pureAttr, val)
                }
            }
            new Watcher(
                {
                    vm: this.$vm,
                    exp
                },
                val => {
                    node.setAttribute(pureAttr, val)
                }
            )
            node.removeAttribute(attr)
        }
    }

    private innerText__compiler(node: Node, exp: string): void {
        const val = this.getVal(exp)
        node.textContent = node.textContent ? node.textContent.replace(MUSTACHE_TAG_REG(), val) : ''
        new Watcher(
            {
                vm: this.$vm,
                exp
            },
            val => {
                node.textContent = val
            }
        )
    }

    private if__compiler(node: HTMLElement, direct: string, templateId = this.$templateStore.id): void {
        if (templateId) {
            const ifHTML = this.$templateStore.getIfHTML(templateId)
            const elseHTML = this.$templateStore.getElseHTML(templateId)

            if (!ifHTML) {
                this.$templateStore.setIfHTML(templateId, node.outerHTML)
            }
            const exp = node.getAttribute(direct)
            if (exp) {
                if (isExpression(exp)) {
                    const equal = calculateExpression(exp, this.getVal.bind(this))
                    if (!equal) {
                        node.style.display = 'none'
                    }
                    const nextNode = node.nextElementSibling
                    if (nextNode) {
                        if (!elseHTML) {
                            this.$templateStore.setElseHTML(templateId, nextNode.outerHTML)
                        }
                        if (!this.$templateStore.getElseHTML(templateId)) {
                            this.$templateStore.setElseHTML(templateId, nextNode.outerHTML)
                        }
                        const attrNames = nextNode.getAttributeNames()
                        if (attrNames.length) {
                            const elseDirective = attrNames.filter(name => ELSE_DIRECTIVE_REG().test(name))
                            if (elseDirective.length) {
                                if (equal) {
                                    nextNode.setAttribute('style', `display:none`)
                                }
                                nextNode.removeAttribute(ELSE_DIRECTIVE)
                            }
                        }
                    }
                } else {
                    const val = this.getVal(exp)
                    if (!val) {
                        node.style.display = 'none'
                    }
                }

                new Watcher(
                    {
                        vm: this.$vm,
                        exp,
                        templateId
                    },
                    val => {
                        this.compileNode(node, templateId)
                    }
                )
            }
        }
        node.removeAttribute(IF_DIRECTIVE)
    }
}
