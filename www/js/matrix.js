let cols = 25,
    rows = 30,
    fontSize = 20,
    cellSize = fontSize*2,
    canvas = document.getElementById("example"),
    ctx = canvas.getContext('2d'),
    letters = 'aбвгдеежзийклмнопрстуфхцчшщїыьеюя',
    lettersLen = letters.length;

    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;

let shitHeap = [
    'Неважно, кто мы такие, важно то, какой у нас план.',
    'Я сам творю свою удачу!',
    'Не проблемы должны толкать вас в спину, а вперед вести мечты.',
    'Пессимист видит трудность в любой возможности; оптимист – видит возможность в любой трудности.',
    'Мы — рабы своих привычек. Измени свои привычки, и изменится твоя жизнь…',
    'Нельзя казнить помиловать'
], shitLength = shitHeap.length, initialShit = shitHeap[Math.floor(Math.random() * shitLength)];

function random(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


class Board {
    constructor(context, letters, initialShit, cols, rows) {
        this.colsNum = cols || 15;
        this.rowsNum = rows || 25;
        this.cols = [];
        this.context = context;
        this.letters = letters;
        this.initialShit = initialShit;
        this.enabled = false;

        for(let index = 0; index < this.colsNum; index += 1){
            this.cols[index] = new Column(this.context, this.rowsNum, index);
        }

        this.erase();

        this.setPhrase(shitHeap[random(0, shitLength-1)]);
    }

    rebuild() {
        for (let i = 0; i < this.colsNum; i += 1) {
            for (let j = 0; j < this.rowsNum; j += 1) {
                this.cols[i].letters[j].set(this.letters[Math.floor(Math.random() * lettersLen)].toUpperCase());
            }
        }

        return this;
    }

    draw() {
        for(let index = 0; index < this.colsNum; index += 1) {
            this.cols[index].erase().draw();
        }

        return this;
    }

    erase() {
        this.context.fillStyle = 'rgb(238,232,170)';
        this.context.fillRect(0, 0, example.width, example.height);

        return this;
    }

    enable() {
        for(let index = 0; index < this.colsNum; index += 1) {
            this.cols[index]
                .enable();
        }

        return this;
    }

    disable() {
        for(let index = 0; index < this.colsNum; index += 1) {
            this.cols[index]
                .disable();
        }

        return this;
    }

    setPhrase(phrase) {
        this
            .rebuild()
            .disable()
            .draw();


        // let parts = phrase.split(' ');

        /*
        Replace this part
         */
        let parts = phrase.split(' ');

        let rows = [];
        for(let i = 0, j = 0; i < parts.length; i += 1){
            if(!rows[j]){
                rows[j] = '';
            }

            if((rows[j] + parts[i]).length < this.colsNum){
                rows[j] += parts[i] + ' ';
            }
            else{
                rows[j] = rows[j].trim();
                j++;

                rows[j] = parts[i] + ' ';
            }
        }

        for(let i = 0; i < rows.length; i += 1){
            rows[i] = rows[i].trim();
        }
        /*
         End replace
         */

        console.info(rows, 'rows');

        let paragraph = rows;

        let startY = Math.ceil(this.rowsNum/2) - Math.ceil(paragraph.length/2);

        // console.info(startY, 'startY');
        // console.info(startY + paragraph.length, 'endY');

        for (let y = startY, i = 0; y < startY + paragraph.length; y += 1, i += 1) {
            let startX = Math.ceil(this.colsNum/2) - Math.ceil(paragraph[i].length/2);

            // console.info(startX, 'startX');
            // console.info(startX + paragraph[i].length, 'endX');
            for(let x = startX, j = 0; x < startX + paragraph[i].length; x += 1, j += 1){
                this.cols[x].letters[y]
                    .set(paragraph[i][j])
                    .erase()
                    .enable()
                    .draw();
            }
        }

        // return rows;
    }
}

class Column {
    constructor(context, length, index){
        this.length = length || 25;
        this.letters = [];
        this.index = index;
        this.context = context;

        for(let index = 0;index < this.length; index += 1) {
            this.letters[index] = new Letter(
                this.context,
                this, letters[Math.floor(Math.random() * lettersLen)].toUpperCase(),
                index,
                this.enabled
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
        this.context.fillStyle = 'rgb(238,232,170)';
        this.context.fillRect(cellSize*this.index, 0, cellSize, cellSize*this.length);

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
        this.enabled = true;

        for(let index = 0; index < this.length; index += 1) {
            this.letters[index]
                .erase()
                .disable()
                .draw();
        }

        return this;
    }
}

class Letter{
    constructor(context, parent, letter, index, enabled){
        this.name = letter || '';
        this.col = parent;
        this.index = index;
        this.enabled = enabled || false;
        this.hasComma = false;

        this.context = context;
    }

    set(value) {
        this.name = value.toUpperCase();

        return this;
    }

    enable(){
        this.enabled = true;

        return this;
    }

    disable() {
        this.enabled = false;

        return this;
    }

    draw() {
        this.context.font = fontSize + "px monospace";
        this.context.fillStyle = 'rgba(0,0,0,0.2)';

        if(this.enabled){
            this.context.fillStyle = '#000';
        }

        this.context.fillText(this.name, this.col.index * cellSize, this.index*cellSize + fontSize);

        return this;
    }

    erase() {
        this.context.fillStyle = 'rgb(238,232,170)';
        this.context.fillRect(cellSize*this.col.index, cellSize*this.index, cellSize, cellSize);

        return this;
    }
}

    let board = new Board(ctx, letters, initialShit, cols, rows);

console.log('board', board);

board.draw();
