import {Board} from './board';

export
class Letter{
    static get font(){
        return Letter._font;
    }
    static set font(value){
        Letter._font = value;
    }

    static get enabledFillStyle(){
        return Letter._enabledFillStyle;
    }
    static set enabledFillStyle(value){
        Letter._enabledFillStyle = value;
    }

    static get disabledFillStyle(){
        return Letter._disabledFillStyle;
    }
    static set disabledFillStyle(value){
        Letter._disabledFillStyle = value;
    }

    constructor(parent, index, letter, punctuation){
        this.col = parent;
        this.index = index;
        this.name = letter || '';
        this.punctuation = punctuation || '';
        this.context = this.col.board.context;

        Letter.font = Board.fontSize + "px monospace";
        Letter.enabledFillStyle = '#000';
        Letter.disabledFillStyle = '#C6C6BA';

        this.disable();
    }

    drawSymbol(){

    }

    set(value) {
        this.name = value.toUpperCase();

        return this;
    }

    setPunctuation(value){
        this.punctuation = value;

        return this;
    }

    enable(){
        this.drawSymbol = this._drawEnabledSymbol;

        return this;
    }

    disable() {
        this.drawSymbol = this._drawDisabledSymbol;

        return this;
    }

    draw(y) {
        this.drawSymbol(y);

        if(this.punctuation){
            this.context.fillText(this.punctuation, Board.paddingLeft + this.col.index * Board.fontSize * 0.6 + Board.fontSize/2, y + Board.fontSize + this.col.board.paddingTop);
        }

        return this;
    }

    _drawEnabledSymbol(y) {
        this.context.font = Letter.font;
        this.context.fillStyle = Letter.enabledFillStyle;
        this.context.fillText(this.name, Board.paddingLeft + this.col.index * Board.fontSize * 0.6, y + Board.fontSize + this.col.board.paddingTop);
    }

    _drawDisabledSymbol(y) {
        this.context.font = Letter.font;
        this.context.fillStyle = Letter.disabledFillStyle;
        this.context.fillText(this.name, Board.paddingLeft + this.col.index * Board.fontSize * 0.6, y + Board.fontSize + this.col.board.paddingTop);
    }
}