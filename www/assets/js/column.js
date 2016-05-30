import {Board} from './board';
import {Letter} from './letter';

export
class Column {
    constructor(index, length){
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
        for(let index = 0; index < this.length; index += 1) {
            this.letters[index].erase().draw();
        }

        return this;
    }

    erase() {
        Board.context.fillStyle = 'rgb(238,232,170)';
        Board.context.fillRect(Board.cellWidth*this.index, 0, Board.cellWidth, Board.cellHeight*this.length);

        return this;
    }

    enable() {
        for(let index = 0; index < this.length; index += 1) {
            this.letters[index]
                .erase()
                .enable()
                .draw();
        }

        return this;
    }

    disable() {
        for(let index = 0; index < this.length; index += 1) {
            this.letters[index]
                .erase()
                .disable()
                .draw();
        }

        return this;
    }

    shift(count){
        this.letters = this.letters.slice(count).concat(this.letters.slice(0,count));

        for(let index = 0; index < this.length; index += 1){
            this.letters[index].index = index;
        }

        this
            .erase()
            .draw();

        return this;
    }
}