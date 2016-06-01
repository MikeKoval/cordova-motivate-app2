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

        Letter.font = Board.fontSize + "px monospace";
        Letter.enabledFillStyle = '#000';
        Letter.disabledFillStyle = 'rgba(0,0,0,0.2)';

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

        Board.context.fillStyle = 'rgb(238,232,170)';
        Board.context.fillRect(Board.cellWidth*this.col.index, y, Board.cellWidth, Board.cellHeight);

        this.drawSymbol(y);

        if(this.punctuation){
            Board.context.fillText(this.punctuation, this.col.index * Board.cellWidth + Board.cellWidth/2, y + Board.fontSize);
        }

        return this;
    }

    _drawEnabledSymbol(y) {
        Board.context.font = Letter.font;
        Board.context.fillStyle = Letter.enabledFillStyle;
        Board.context.fillText(this.name, this.col.index * Board.cellWidth, y + Board.fontSize);
    }

    _drawDisabledSymbol(y) {
        Board.context.font = Letter.font;
        Board.context.fillStyle = Letter.disabledFillStyle;
        Board.context.fillText(this.name, this.col.index * Board.cellWidth, y + Board.fontSize);
    }
}