import {Board} from './board';
import {Letter} from './letter';

export
class Column {
    constructor(index, length){
        this._shift = 0;
        this.index = index;
        this.length = length || 25;
        this.letters = [];

        for(let index = 0; index < this.length; index += 1) {
            this.letters[index] = new Letter(
                this,
                index,
                Board.letters[Board.random(0, Board.letters.length - 1)].toUpperCase(),
                false
            );
        }
    }

    draw() {
        var y = this._shift,
            height = this.length * Board.cellHeight;

        if (y < 0) {
            y += height;
        }
        if (y > height) {
            y %= height;
        }

        for(let index = 0; index < this.length; index += 1){
            this.letters[index].draw(y - height);
            this.letters[index].draw(y);
            y += Board.cellHeight;
        }
        return this;
    }

    disable() {
        for(let index = 0; index < this.length; index += 1) {
            this.letters[index].disable();
        }

        return this;
    }
    
    shift(value){
        this._shift = value;
    }
}