import {Board} from './board';
import {Letter} from './letter';

export
class Column {
    constructor(board, index, length){
        this.board = board;
        this.index = index;
        this.length = length;
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
        for(let index = 0; index < this.length; index += 1){
            this.letters[index].draw();
        }
        
        return this;
    }

    disable() {
        for(let index = 0; index < this.length; index += 1) {
            this.letters[index].disable();
        }

        return this;
    }
}