export
class Letter{
    static get font() {
        return Letter._font;
    }
    static set font(value) {
        Letter._font = value;
    }

    static get enabledFillStyle() {
        return Letter._enabledFillStyle;
    }
    static set enabledFillStyle(value) {
        Letter._enabledFillStyle = value;
    }

    static get disabledFillStyle() {
        return Letter._disabledFillStyle;
    }
    static set disabledFillStyle(value) {
        Letter._disabledFillStyle = value;
    }

    get x() {
        return this.col.board.paddingLeft + this.col.index * this.col.board.fontSize * 0.6;
    }

    get y() {
        return this.index * this.col.board.cellHeight + this.col.board.fontSize + this.col.board.paddingTop;
    }

    get punctuationX() {
        return this.col.board.paddingLeft + this.col.index * this.col.board.fontSize * 0.6 + this.col.board.fontSize/2;
    }

    constructor(parent, index, letter, punctuation) {
        this.col = parent;
        this.index = index;
        this.name = letter || '';
        this.punctuation = punctuation || '';
        this.context = this.col.board.context;

        Letter.font = this.col.board.fontSize + "px monospace";
        Letter.enabledFillStyle = '#000';
        Letter.disabledFillStyle = '#C6C6BA';

        this.disable();
    }

    drawSymbol() {}

    set(value) {
        this.name = value.toUpperCase();

        return this;
    }

    setPunctuation(value) {
        this.punctuation = value;

        return this;
    }

    enable() {
        this.drawSymbol = this._drawEnabledSymbol;

        return this;
    }

    disable() {
        this.drawSymbol = this._drawDisabledSymbol;

        return this;
    }

    draw() {
        this.drawSymbol();

        if(this.punctuation){
            this.context.fillText(
                this.punctuation,
                this.punctuationX,
                this.y
            );
        }

        return this;
    }

    _drawEnabledSymbol() {
        this.context.font = Letter.font;
        this.context.fillStyle = Letter.enabledFillStyle;
        this.context.fillText(
            this.name,
            this.x,
            this.y
        );
    }

    _drawDisabledSymbol() {
        this.context.font = Letter.font;
        this.context.fillStyle = Letter.disabledFillStyle;
        this.context.fillText(
            this.name,
            this.x,
            this.y
        );
    }
}