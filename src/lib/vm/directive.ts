import { VmConfig } from './model'
import {
    isExpression,
    calculateExpression,
    FOR_DIRECTIVE,
    MUSTACHE_TAG_REG,
    ELSE_DIRECTIVE_REG,
    ELSE_DIRECTIVE,
    IF_DIRECTIVE
} from './utils'
import { Watcher } from './watcher'
import { TemplateStore } from './store'
import { VM } from './vm'
import { Dep } from './dep'

export class Directive {
    private $vm: VmConfig
    private $data: any
    private $computed: any
    private $methods: { [key: string]: (param: any, ...restOfName: any[]) => any }
    private $templateStore = new TemplateStore()
    private compileNode: any
    constructor(vm: VmConfig, compileNode: any) {
        this.$vm = vm
        this.$data = vm.data
        this.$computed = vm.computed
        this.$methods = vm.methods
        this.compileNode = compileNode
    }

    private getVal(exp: string): any {
        let val = this.$data
        const keys = exp.split('.')
        keys.forEach(key => {
            val = val[key]
        })
        return val
    }

    public forCompiler(node: HTMLElement, direct: string, templateId = this.$templateStore.id): void {
        const exp = node.getAttribute(direct)
        if (exp) {
            const forHTML = this.$templateStore.getForHTML(templateId)
            if (!forHTML) {
                this.$templateStore.setForHTML(templateId, node.outerHTML)
            }

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
                        parent: this.$vm,
                        data: childData,
                        el: childNode.parentNode,
                        methods: this.$methods
                    } as VmConfig)
                    nodeParent.append(childNode as ChildNode)
                })
                const ob = (arrayData as any).__ob__.dep as Dep
                ob.subQueue.length = 0
                ob.addSub(
                    new Watcher(
                        {
                            vm: this.$vm,
                            exp: arrayExp,
                            templateId
                        },
                        val => {
                            nodeParent.innerHTML = this.$templateStore.getForHTML(templateId)
                            this.compileNode(nodeParent, templateId)
                        }
                    )
                )
            }
        }
    }

    public innerTextCompiler(node: HTMLElement, exp: string): void {
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

    public ifCompiler(node: HTMLElement, direct: string, templateId = this.$templateStore.id): void {
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

    public attrCompiler(node: HTMLElement, attr: string): void {
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
}
