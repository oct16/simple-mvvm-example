import { VmConfig } from './model'
import {
    BIND_ATTR_REG,
    CLICK_TAG,
    FOR_DIRECTIVE_REG,
    getClickMethod,
    IF_DIRECTIVE_REG,
    isMustacheTagText,
    isNodeElement,
    isNodeText,
} from './utils'
import { TemplateStore } from './store'
import { Directive } from './directive'

export class Compiler {
    private $vm: VmConfig
    private $el: HTMLElement
    private $templateStore = new TemplateStore()
    private directive: Directive
    constructor(vm: VmConfig) {
        this.$el = vm.el as HTMLElement
        this.$vm = vm
        this.directive = new Directive(vm, this.compileNode.bind(this))
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
                    this.directive.forCompiler(node, direct)
                    return
                }

                const ifDirective = attrNames.filter(name => IF_DIRECTIVE_REG().test(name))
                if (ifDirective.length) {
                    const direct = ifDirective[0]
                    this.directive.ifCompiler(node, direct, templateId)
                }

                const bindAttrs = attrNames.filter(name => BIND_ATTR_REG().test(name))
                if (bindAttrs.length) {
                    bindAttrs.forEach(attr => {
                        this.directive.attrCompiler(node, attr)
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
            this.directive.innerTextCompiler(node, RegExp.$1)
        }
    }
}
