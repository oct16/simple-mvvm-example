interface Position {
    layerX: number
    layerY: number
}

export interface DialogContent {
    title: string
    confirm: string
    cancel: string
}

export class Dialog {
    static gapX = -32
    static gapY = 40
    position: Position
    content: DialogContent
    constructor() {}

    createDialog(position: Position, content: DialogContent): void {
        if (this.isCreated()) {
            this.removeDialog()
        }

        this.initData(position, content)
        const node = this.createDom()
        this.bindDom(node)
        this.renderDom(node)
    }

    initData(position: Position, content: DialogContent): void {
        this.position = position
        this.content = content
    }

    createDom(): HTMLElement {
        const layer = this.createLayer()
        const layerNode = document.createElement('div')
        layerNode.className = 'dialog'
        layerNode.innerHTML = layer
        return layerNode
    }

    bindDom(node: HTMLElement): void {
        const closeBtn = node.querySelector('.dialog-close')
        const confirmBtn = node.querySelector('.dialog-confirm')
        const cancelBtn = node.querySelector('.dialog-cancel')

        const btnGroup = [closeBtn, confirmBtn, cancelBtn]
        btnGroup.forEach((btn: null | Element) => {
            if (btn) {
                btn.addEventListener('click', () => {
                    this.removeDialog()
                })
            }
        })
    }

    renderDom(node: HTMLElement): void {
        document.body.appendChild(node)
    }

    isCreated(): boolean {
        return !!document.body.querySelector('.dialog')
    }

    removeDialog(): void {
        const dialogNode = document.body.querySelector('.dialog')
        if (dialogNode) {
            document.body.removeChild(dialogNode)
        }
    }

    createLayer(): string {
        const position = this.position
        return `
            <div style="
                top: ${position.layerY + Dialog.gapY}px;
                left: ${position.layerX + Dialog.gapX}px;
                " class="dialog-content">
                <div class="triangle"></div>
                <div class="triangle inner"></div>
                <div class="dialog-close">
                    <i class="icon-close"></i>
                </div>
                <div class="dialog-title">
                    ${this.content.title}
                </div>
                <input class="dialog-input">
                <div class="dialog-action">
                    <button class="dialog-confirm">
                        ${this.content.confirm}
                    </button>
                    <button class="dialog-cancel">
                        ${this.content.cancel}
                    </button>
                </div>
            </div>`
    }
}
