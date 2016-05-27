function getWindowSizes(){
    let w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    return {width: x, height: y};
}

let cols = 25,
    rows = 30,
    width = getWindowSizes().width,
    height = getWindowSizes().height,

    cellWidth = width/cols,
    cellHeight = height/rows,
    fontSiz = cellWidth < cellHeight ? cellWidth/2 : cellHeight/2,
    canvas = document.getElementById("example"),
    ctx = canvas.getContext('2d'),
    letters = 'aбвгдеежзийклмнопрстуфхцчшщїыьеюя',
    shitHeap = [
    'Неважно, кто мы такие, важно то, какой у нас план',
    'Я сам творю свою удачу',
    'Не проблемы должны толкать вас в спину, а вперед вести мечты',
    'Пессимист видит трудность в любой возможности; оптимист – видит возможность в любой трудности',
    'Мы — рабы своих привычек. Измени свои привычки, и изменится твоя жизнь',
    'Нельзя казнить помиловать'
    ],
    initialShit = shitHeap[random(0, shitHeap.length - 1)];

canvas.width = width;
canvas.height = height;

function random(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Board {
    static get context() {
        return Board._context;
    }
    static set context(value) {
        Board._context = value;
    }
    
    static get fontSize() {
        return Board._fontSize;
    }

    static set fontSize(value) {
        Board._fontSize = value;
    }

    static get cellWidth() {
        return Board._cellWidth;
    }
    static set cellWidth(value) {
        Board._cellWidth = value;
    }

    static get cellHeight() {
        return Board._cellHeight;
    }
    static set cellHeight(value) {
        Board._cellHeight = value;
    }

    get phrase() {
        return this._phrase;
    }
    set phrase(value) {
        this._phrase = value;
    }

    constructor(context, initialShit, cols, rows, fontSize, cellWidth, cellHeight, letters) {
        Board.context = context;

        this.colsNum = cols || 15;
        this.rowsNum = rows || 25;
        this.initialShit = initialShit || 'HELLO';
        Board.fontSize = fontSize || 20;
        Board.cellWidth = cellWidth || Board.fontSize*2;
        Board.cellHeight = cellHeight || Board.fontSize*2;
        Board.letters = letters || 'aбвгдеежзийклмнопрстуфхцчшщїыьеюя';

        this.cols = [];

        for(let index = 0; index < this.colsNum; index += 1){
            this.cols[index] = new Column(index, this.rowsNum);
        }

        this.erase();

        this.setPhrase(this.initialShit);

        this.initEvents();
    }

    rebuild() {
        for (let i = 0; i < this.colsNum; i += 1) {
            for (let j = 0; j < this.rowsNum; j += 1) {
                this.cols[i].letters[j].set(Board.letters[random(0, Board.letters.length - 1)].toUpperCase());
                this.cols[i].letters[j].setPunctuation('');
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
        for(let index = 0; index < this.colsNum; index += 1) {
            this.cols[index].erase();
        }

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
        this.phrase = phrase;

        this
            .rebuild()
            .disable()
            .draw();


        phrase = phrase.replace(/,\s/gi, ",");
        phrase = phrase.replace(/\.\s/gi, ".");

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
                j += 1;

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

        let startY = Math.ceil((this.rowsNum - paragraph.length)/2);

        for (let y = startY, i = 0; y < startY + paragraph.length; y += 1, i += 1) {
            let startX = Math.ceil(this.colsNum/2) - Math.ceil(paragraph[i].length/2);

            for(let x = startX, j = 0; x < startX + paragraph[i].length; x += 1, j += 1){
                if(paragraph[i][j] === ',' || paragraph[i][j] === '.'){
                    this.cols[x].letters[y]
                        .set('')
                        .erase()
                        .draw();

                    continue;
                }

                if(paragraph[i][j+1] === ','){
                    this.cols[x].letters[y].setPunctuation(',');
                }

                if(paragraph[i][j+1] === '.'){
                    this.cols[x].letters[y].setPunctuation('.');
                }

                this.cols[x].letters[y]
                    .set(paragraph[i][j])
                    .erase()
                    .enable()
                    .draw();
            }
        }
    }

    initEvents() {
        var boardElm = document.getElementById('example'),
        hammertime = new Hammer(boardElm, {});
        hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL }),
        self = this;

        var mc = new Hammer.Manager(boardElm, {
            recognizers: [
                // RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
                [Hammer.Swipe,{ direction: Hammer.DIRECTION_VERTICAL }],
            ]
        });

        mc.on("swipe", function(ev) {
            var direction = ev.velocity < 0 ? 1 : -1,
                velocity = Math.abs(ev.velocity);
            console.log('velocity', velocity);
            console.log('direction', direction);

            self.setPhrase(shitHeap[random(0, shitHeap.length - 1)]);
            self.loop(velocity, direction);
        });
    }

    loop(velocity, direction) {
        //Board.context.transform(1, 0, 0, 1, canvas.width, canvas.height/2);
        //
        if(this.looper) clearInterval(this.looper);
        
        var image = new Image(),
            CanvasYSize = canvas.height,
            y = 0;
        image.src = canvas.toDataURL("image/png");
        var translate = Math.floor(velocity*direction)*2;
        this.looper = setInterval(() => {
            Board.context.clearRect(0,0,canvas.width,canvas.height);

            //translate += Math.ceil(velocity*direction);
            // console.log('transform', translate);

            if (y > (CanvasYSize)) { y = 0; }
            //draw aditional image

            if (y > (CanvasYSize-image.height)) {
                console.log('draw more');
                ctx.drawImage(image,0,y-canvas.height+1,image.width,image.height);
            }

            ctx.drawImage(image,0,y, canvas.width, canvas.height);

            y += translate;
        }, 10);

        // Board.context.drawImage(Board.context,0,0,canvas.width, canvas.height)
    }
}

class Column {
    constructor(index, length){
        this.index = index;
        this.length = length || 25;
        this.letters = [];

        for(let index = 0; index < this.length; index += 1) {
            this.letters[index] = new Letter(
                this,
                index,
                Board.letters[random(0, Board.letters.length - 1)].toUpperCase(),
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

    draw() {
        this.drawSymbol();

        if(this.punctuation){
            Board.context.fillText(this.punctuation, this.col.index * Board.cellWidth + Board.cellWidth/2, this.index*Board.cellHeight + Board.fontSize);
        }

        return this;
    }

    _drawEnabledSymbol() {
        Board.context.font = Letter.font;
        Board.context.fillStyle = Letter.enabledFillStyle;
        Board.context.fillText(this.name, this.col.index * Board.cellWidth, this.index*Board.cellHeight + Board.fontSize);
    }

    _drawDisabledSymbol() {
        Board.context.font = Letter.font;
        Board.context.fillStyle = Letter.disabledFillStyle;
        Board.context.fillText(this.name, this.col.index * Board.cellWidth, this.index*Board.cellHeight + Board.fontSize);
    }

    erase() {
        Board.context.fillStyle = 'rgb(238,232,170)';
        Board.context.fillRect(Board.cellWidth*this.col.index, Board.cellHeight*this.index, Board.cellWidth, Board.cellHeight);

        return this;
    }
}

let board = new Board(ctx, initialShit, cols, rows, fontSiz, cellWidth, cellHeight, letters);

console.log('board', board);

// board.draw();
