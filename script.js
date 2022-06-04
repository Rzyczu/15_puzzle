var timeInterval
var piece = []
var size;
var start;
var time;
var rekordy;
var nick;
var posInitial

//dynamiczne tworzenie elementóe slidera
var dSlider = document.createElement('div');
dSlider.id = "slider";
dSlider.classList.add("slider");

var dWrapper = document.createElement('div');
dWrapper.classList.add("wrapper");

var dSlides = document.createElement('div');
dSlides.id = "slides";
dSlides.classList.add("slides");

for (let i = 0; i < 3; i++) {
    var dImg = document.createElement('span');
    dImg.classList.add("slide");
    dImg.classList.add("s" + i);

    dSlides.appendChild(dImg);
}
var aControlP = document.createElement('a');
aControlP.id = "prev";
aControlP.classList.add("control");
aControlP.classList.add("prev");

var aControlN = document.createElement('a');
aControlN.id = "next";
aControlN.classList.add("control");
aControlN.classList.add("next");

dSlider.appendChild(dWrapper);
dWrapper.appendChild(dSlides);
dSlider.appendChild(aControlP);
dSlider.appendChild(aControlN);
document.body.appendChild(dSlider)

var slider = document.getElementById('slider'),
    sliderItems = document.getElementById('slides'),
    prev = document.getElementById('prev'),
    next = document.getElementById('next');

var slider = document.getElementById('slider'),
    sliderItems = document.getElementById('slides'),
    prev = document.getElementById('prev'),
    next = document.getElementById('next');

function Slider(wrapper, items, prev, next) {
    var posX1 = 0,
        posX2 = 0,
        posFinal,
        threshold = 100,
        slides = items.getElementsByClassName('slide'),
        slidesLength = slides.length,
        slideSize = items.getElementsByClassName('slide')[0].offsetWidth,
        firstSlide = slides[0],
        lastSlide = slides[slidesLength - 1],
        cloneFirst = firstSlide.cloneNode(true),
        cloneLast = lastSlide.cloneNode(true),
        index = 0,
        allowShift = true;

    // Clone first and last slide
    items.appendChild(cloneFirst);
    items.insertBefore(cloneLast, firstSlide);
    wrapper.classList.add('loaded');

    // Mouse events
    items.onmousedown = dragStart;

    // Touch events
    items.addEventListener('touchstart', dragStart);
    items.addEventListener('touchend', dragEnd);
    items.addEventListener('touchmove', dragAction);

    // Click events
    prev.addEventListener('click', function () { shiftSlide(-1) });
    next.addEventListener('click', function () { shiftSlide(1) });

    // Transition events
    items.addEventListener('transitionend', checkIndex);

    function dragStart(e) {
        e = e || window.event;
        e.preventDefault();
        posInitial = items.offsetLeft;

        if (e.type == 'touchstart') {
            posX1 = e.touches[0].clientX;
        } else {
            posX1 = e.clientX;
            document.onmouseup = dragEnd;
            document.onmousemove = dragAction;
        }
    }

    function dragAction(e) {
        e = e || window.event;

        if (e.type == 'touchmove') {
            posX2 = posX1 - e.touches[0].clientX;
            posX1 = e.touches[0].clientX;
        } else {
            posX2 = posX1 - e.clientX;
            posX1 = e.clientX;
        }
        items.style.left = (items.offsetLeft - posX2) + "px";
    }

    function dragEnd(e) {
        posFinal = items.offsetLeft;
        if (posFinal - posInitial < -threshold) {
            shiftSlide(1, 'drag');
        } else if (posFinal - posInitial > threshold) {
            shiftSlide(-1, 'drag');
        } else {
            items.style.left = (posInitial) + "px";
        }

        document.onmouseup = null;
        document.onmousemove = null;
    }

    function shiftSlide(dir, action) {
        items.classList.add('shifting');

        if (allowShift) {
            if (!action) { posInitial = items.offsetLeft; }

            if (dir == 1) {
                items.style.left = (posInitial - slideSize) + "px";
                index++;
            } else if (dir == -1) {
                items.style.left = (posInitial + slideSize) + "px";
                index--;
            }
        };

        allowShift = false;
    }

    function checkIndex() {
        items.classList.remove('shifting');

        if (index == -1) {
            items.style.left = -(slidesLength * slideSize) + "px";
            index = slidesLength - 1;
        }

        if (index == slidesLength) {
            items.style.left = -(1 * slideSize) + "px";
            index = 0;
        }

        allowShift = true;
    }
}
Slider(slider, sliderItems, prev, next);

//dynamicznie tworzenie przycisków
var d = document.createElement('div');
d.id = "buttons";
for (let i = 0; i < 4; i++) {
    var button = document.createElement('button');
    button.style.position = "absolute"
    button.style.width = "90px"
    button.style.height = "40px"
    button.innerText = (i + 3) + " x " + (i + 3)
    button.style.left = (i + 1) * 100 + 205 + "px"
    button.style.top = "275px"
    button.id = (i + 3) + "x" + (i + 3) + "btn"
    button.onclick = startGame;
    d.appendChild(button);
}
document.body.appendChild(d);

// funkcja po klikneciu w przycisk - tworzenie planszy i cała rozgrywka
function startGame() {
    if (posInitial == -200) {
        imgNumb = 2
    } else if (posInitial == -400) {
        imgNumb = 1

    } else if (posInitial == -600) {
        imgNumb = 2

    } else if (posInitial == -800) {
        console.log("Mały bug")
        imgNumb = 2
    }
    var oldBoard = document.querySelector("#gameBoard");  //usuwanie poprzedniej planszy i zatrzymanie interwału czasu
    while (document.querySelector('#gameBoard') != null) {
        oldBoard.remove()
        clearInterval(timeInterval)

    }

    let gameBoard = document.createElement('div'); //tworzenie diva planszy
    gameBoard.id = "gameBoard";
    document.body.appendChild(gameBoard);

    size = parseInt(this.id);  //obiekt 
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            piece[j + size * i] = {
                id: ((j + size * i) + "piece"),
                posX: (200 + (600 / size) * j + "px"),
                posY: (400 + (600 / size) * i + "px"),
                shiftX: (-(600 / size) * j + "px"),
                shiftY: (-(600 / size) * i + "px"),
                status: true,
                img: function () {                  //tworzenie elementów na planszy
                    let d = document.createElement('div');
                    d.id = piece[j + size * i].id + "Div"
                    d.classList.add("pieces")
                    d.style.position = "absolute"
                    d.style.border = "1px solid #ffffff";
                    d.style.left = piece[j + size * i].posX;
                    d.style.top = piece[j + size * i].posY;
                    d.style.transition = "width 2s, height 4s";
                    d.style.height = 600 / size + "px"
                    d.style.width = 600 / size + "px"
                    if (piece[j + size * i].status == true) {
                        d.style.backgroundImage = 'url("img/img' + imgNumb + '.png")'
                        d.style.backgroundPositionX = piece[j + size * i].shiftX
                        d.style.backgroundPositionY = piece[j + size * i].shiftY
                    } else {
                        d.style.backgroundColor = "black"
                        d.classList.add("black")
                    }
                    gameBoard.appendChild(d);
                }
            }
            if (j == (size - 1) && i == (size - 1)) {
                piece[j + size * i].status = false;
                var blackObj = piece[j + size * i]
            }
            piece[j + size * i].img();
        }
    }

    //interwał losowania pól przez komputer
    var times = 0
    var inter = setInterval(botSwap, 0.1);
    function botSwap() {
        var randomDivId = (Math.floor(Math.random() * (size * size - 1))) + "pieceDiv";
        var nowDiv = document.getElementById(randomDivId)

        var black = document.querySelector(".black");
        var blackX = parseInt(black.style.left)
        var blackY = parseInt(black.style.top)
        var divX = parseInt(nowDiv.style.left)
        var divY = parseInt(nowDiv.style.top)

        if (((divX + 600 / size == blackX) && (divY == blackY)) || ((divX - 600 / size == blackX) && (divY == blackY)) || ((divY + 600 / size == blackY) && (divX == blackX)) || ((divY - 600 / size == blackY) && (divX == blackX))) {
            black.style.left = divX + "px"
            black.style.top = divY + "px"
            nowDiv.style.left = blackX + "px"
            nowDiv.style.top = blackY + "px"
            times = times + 1
        }
        if (times == 4) {
            clearInterval(inter)
            start = Date.now();
            timeInterval = setInterval(startTime, 1);

        }
    }
    gameBoard.addEventListener("click", Game)
}

//funkcja po kliknęciu na planszę
function Game(e) {
    let nowDiv = e.target
    var black = document.querySelector(".black");
    var blackX = parseInt(black.style.left)
    var blackY = parseInt(black.style.top)
    var divX = parseInt(nowDiv.style.left)
    var divY = parseInt(nowDiv.style.top)

    if (((divX + 600 / size == blackX) && (divY == blackY)) || ((divX - 600 / size == blackX) && (divY == blackY)) || ((divY + 600 / size == blackY) && (divX == blackX)) || ((divY - 600 / size == blackY) && (divX == blackX))) {

        black.style.left = divX + "px"
        black.style.top = divY + "px"
        nowDiv.style.left = blackX + "px"
        nowDiv.style.top = blackY + "px"

        var isgood = 0;

        var piecesDivArr = document.getElementsByClassName("pieces");
        for (let i = 0; i < size * size; i++) {
            if ((piecesDivArr[i].style.left == piece[i].posX) && (piecesDivArr[i].style.top == piece[i].posY)) { //warunek sprawdzający wygraną
                isgood++;

            }


        }

        if (isgood == size * size) {            //wygrana
            win();


        }
    }
}

//funkcja licząca czas
function startTime() {
    var tempTime = Date.now() - start;
    var milliseconds = tempTime % 1000;
    tempTime = Math.floor(tempTime / 1000);
    var seconds = tempTime % 60;
    tempTime = Math.floor(tempTime / 60);
    var minutes = tempTime % 60;
    tempTime = Math.floor(tempTime / 60);
    var hours = tempTime % 60;
    if (hours < 10) {
        hours = "0" + hours
    }
    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    if (milliseconds < 10) {
        milliseconds = "0" + milliseconds
    } else if (milliseconds < 100) {
        milliseconds = "0" + milliseconds

    }
    time = hours + ":" + minutes + ":" + seconds + "." + milliseconds;

    var timeArr = time.split('')

    var oldTimeDiv = document.querySelector("#timeDiv");  //usuwanie poprzednich cyferek
    while (document.querySelector('#timeDiv') != null) {
        oldTimeDiv.remove()
    }

    let dTime = document.createElement('div');
    dTime.id = "timeDiv"
    document.body.appendChild(dTime);

    for (let i = 0; i < timeArr.length; i++) {          //ustawianie cyferek na planszy
        if (timeArr[i] == ".") {
            var img = document.createElement('img');
            img.src = "img/dot.gif";
            img.style.position = "absolute"
            img.style.height = "30px"
            img.style.width = "20px"
            img.style.left = 375 + i * 20 + "px"
            img.style.top = "325px"
            dTime.appendChild(img);
        } if (timeArr[i] == ":") {
            var img = document.createElement('img');
            img.src = "img/colon.gif";
            img.style.position = "absolute"
            img.style.height = "30px"
            img.style.width = "20px"
            img.style.left = 375 + i * 20 + "px"
            img.style.top = "325px"
            dTime.appendChild(img);
        } else if (Number.isInteger(parseInt(timeArr[i]))) {
            var img = document.createElement('img');
            img.src = "img/c" + timeArr[i] + ".gif";
            img.style.position = "absolute"
            img.style.height = "30px"
            img.style.width = "20px"
            img.style.left = 375 + i * 20 + "px"
            img.style.top = "325px"
            dTime.appendChild(img);
        }
    }
}
//funckja zatrzymuje interwał
function stopTime() {
    clearInterval(timeInterval)
}
//funkcja sprawia, że czas się zeruje
function clearTime() {
    start = Date.now();
}
function win() {
    console.log("huj")
    clearInterval(timeInterval)
    setTimeout(function () {
        nick = prompt("Wygrales z czasem: " + time + "\nPodaj swój nick : ")

        function setCookie(cnick, ctime, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toGMTString();
            document.cookie = cname + "=" + nick + ";" + expires + ";path=/";
            console.log(document.cookie)
        }

        setCookie(nick, time, 30);

    }, 1000);
}

