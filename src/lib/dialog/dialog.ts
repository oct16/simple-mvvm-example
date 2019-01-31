interface Position {
    layerX: number;
    layerY: number;
}

export class Dialog {
    private static gapX = -32;
    private static gapY = 40;
    position: Position;
    constructor() {}

    createDialog(position: Position): void {
        if (this.isCreated()) {
            return;
        }

        this.initData(position);
        const node = this.createDom();
        this.bindDom(node);
        this.renderDom(node);
    }

    initData(position: Position): void {
        this.position = position;
    }

    createDom(): HTMLElement {
        const layer = this.createLayer();
        const layerNode = document.createElement('div');
        layerNode.className = 'dialog';
        layerNode.innerHTML = layer;
        return layerNode;
    }

    bindDom(node: HTMLElement): void {
        const closeBtn = node.querySelector('.dialog-close');
        const confirmBtn = node.querySelector('.dialog-confirm');
        const cancelBtn = node.querySelector('.dialog-cancel');

        const btnGroup = [closeBtn, confirmBtn, cancelBtn];
        btnGroup.forEach((btn: null | Element) => {
            if (btn) {
                btn.addEventListener('click', () => {
                    this.removeDialog();
                });
            }
        });
    }

    renderDom(node: HTMLElement): void {
        document.body.appendChild(node);
    }

    isCreated(): boolean {
        return !!document.body.querySelector('.dialog');
    }

    removeDialog(): void {
        const dialogNode = document.body.querySelector('.dialog');
        if (dialogNode) {
            document.body.removeChild(dialogNode);
        }
    }

    createLayer(): string {
        const position = this.position;
        return `
            <div style="top: ${position.layerY + Dialog.gapY}px; left: ${position.layerX + Dialog.gapX}px" class="dialog-content">
                <div class="triangle"></div>
                <div class="triangle inner"></div>
                <div class="dialog-close">
                    <i class="icon-close"></i>
                </div>
                <div class="dialog-title">
                    Separate multiple name with commas
                </div>
                <input class="dialog-input">
                <div class="dialog-action">
                    <button class="dialog-confirm">Add Resources</button>
                    <button class="dialog-cancel">Cancel</button>
                </div>
            </div>`;
    }
}
