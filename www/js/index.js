/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

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

        let board = new Board(ctx, initialShit, cols, rows, fontSiz, cellWidth, cellHeight, letters);


        console.log('board', board);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();