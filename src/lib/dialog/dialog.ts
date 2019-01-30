interface Position {
    clientX: number;
    clientY: number;
}

export class Dialog {
    gapX = -32;
    gapY = 40;
    constructor(position: Position) {
        this.createDialog(position);
    }

    createDialog(position: Position) {
        const layer = this.getLayer(position);
        const layerNode = document.createElement('div');
        layerNode.innerHTML = layer;
        document.body.appendChild(layerNode);
    }

    getLayer(position: Position) : string {
        return `<div class="dialog">
            <div  style="top: ${position.clientY + this.gapY}px; left: ${position.clientX + this.gapX}px" class="dialog-content">
            <div class="triangle"></div>
            <div class="triangle inner"></div>
            <div class="dialog-title">
                    Separate multiple name with commas
                </div>
                <div class="dialog-close" onclick="console.log(this)">
                    <i class="icon-close"></i>
                </div>
                
                <input class="dialog-input">

                <button class="dialog-confirm">Add Resources</button>
                <button class="dialog-cancel">Cancel</button>
            <div>
        </div>`;
    }
}
