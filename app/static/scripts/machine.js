
let TEXT_LIMIT = 10;
let DEFAULT_MESSAGE = "SPOOKY"
let CHANGE_MESSAGE = "Please use exact change."
var click = new Audio('../static/sounds/inter_click.wav')
var enter_click = new Audio('../static/sounds/enter_click.wav')
var display = document.getElementById('display');


// Input Timer
var input_timer;
var input_delay = 5;

var input_poll;
var input_poll_delay = 1.5;

// Message Timer
var incoming_message = "";
var message_timer;
var message_timer_delay = 8;

// Wait Timer
var wait_timer;
var wait_timer_delay = 8;


// URLS
//const URL_BASE = 'http://127.0.0.1:5000/';
const URL_BASE = 'http://192.168.0.150:5000/';
//const URL_BASE = 'https://vending-lmao.herokuapp.com/';


const STATES = {
    REST: 0,
    INPUT: 1,
    DISPENSING: 2,
    MESSAGE: 3,
    WAIT: 4
}

var state = STATES.REST;

var speak = new SpeechSynthesisUtterance();
var msg = '';
var tts = false;


// Poll for updates
input_poll = setInterval(function(){
    // update here
    //console.log("listening...");

    r = receive()
    //console.log(r);
    msg = '';
    tts = false;
    var time = undefined;
    if (r == ""){
        // do nothing
    } else {
        msg = r["message"];
        tts = r["TTS"];
        time = r["time"];
    }
    console.log('message: ' + msg);
    console.log('tts: ' + tts);
    console.log('time: ' + time);

    if (msg == "" || msg == null) {
        console.log("DOING NOTHING")
    } else {
        console.log("receving message...");
        message(msg, time);

    }
}, input_poll_delay * 1000);

// Listeners
window.oncontextmenu = function(event) { // prevent context menu
    event.preventDefault();
    event.stopPropagation();
    return false;
};

// listeners for all buttons
var b_one = document.getElementById('one')
b_one.addEventListener('click', function () {
    console.log('1');
    input('1');
    click.play();

})

var b_two = document.getElementById('two')
b_two.addEventListener('click', function () {
    console.log('2');
    input('2');
    click.play();
})

var b_three = document.getElementById('three')
b_three.addEventListener('click', function () {
    console.log('3');
    input('3');
    click.play();
})

var b_four = document.getElementById('four')
b_four.addEventListener('click', function () {
    console.log('4')
    input('4');
    click.play();
})

var b_five = document.getElementById('five')
b_five.addEventListener('click', function () {
    console.log('5')
    input('5');
    click.play();
})

var b_six = document.getElementById('six')
b_six.addEventListener('click', function () {
    console.log('6')
    input('6');
    click.play();
})

var b_seven = document.getElementById('seven')
b_seven.addEventListener('click', function () {
    console.log('7')
    input('7');
    click.play();
})

var b_eight = document.getElementById('eight')
b_eight.addEventListener('click', function () {
    console.log('8')
    input('8');
    click.play();
})

var b_nine = document.getElementById('nine')
b_nine.addEventListener('click', function () {
    console.log('9')
    input('9');
    click.play();
})

var b_delete = document.getElementById('delete')
b_delete.addEventListener('click', function () {
    console.log('DEL')
    //backspace();
    input('-1');
    click.play();
})

var b_zero = document.getElementById('zero')
b_zero.addEventListener('click', function () {
    console.log('0')
    input('0');
    click.play();
})

var b_enter = document.getElementById('enter')
b_enter.addEventListener('click', function () {
    console.log('ENTER')

    if (state != STATES.WAIT && state != STATES.MESSAGE) {
        enter_click.play();
        if (display.innerHTML == ''){
            // do nothing
        } else {
            send(display.innerHTML);
            // PAUSE INPUT
            state = STATES.WAIT;
            clearTimeout(input_timer);

            // Do wait anim...
            display.innerHTML = "..."

            // wait_timer = setTimeout(function() {

            // }, wait_timer_delay * 1000);
        }

    }
})

function GoToAdmin(){
    window.location.href("http://127.0.0.1:5000/master");
}

function input(string) {
    //emptyTTS();
    //click.load();
    console.log(display.innerText.length);
    if (state != STATES.WAIT && state != STATES.MESSAGE){
        if (display.innerText.length <= TEXT_LIMIT) {
            if (state == STATES.REST){ // Clear default for input!
                display.innerText = "";
            }
            state = STATES.INPUT;
            if (string == '-1') {
                display.innerText = display.innerText.slice(0, -1);
            } else {
                display.innerText += string;
            }
            
            checkInput();
        }
    }
}

function backspace(){

    if (display.innerText.length == 0) {
        display.innerText = DEFAULT_MESSAGE;
        // do nothing lmao
    } else {
        display.innerText = display.innerText.slice(0, -1);
    }
}

function checkInput(){
    if (!input_timer){ // Check if theres a timer for input already
        input_timer = setTimeout(function(){
            // reset display
            resetDisplay();
            state = STATES.REST;
            clearTimeout(input_timer);
        }, input_delay * 1000);
    } else {
        // reset timeout
        clearTimeout(input_timer);
        input_timer = setTimeout(function(){
            // reset display
            resetDisplay();
            state = STATES.REST;
            clearTimeout(input_timer);
        }, input_delay * 1000)
    }
}

function emptyTTS(){
    speak.text = '';
    window.speechSynthesis.speak(speak);
}

function message(msg, delay = message_timer_delay){
    display.innerHTML = msg;
    state = STATES.MESSAGE;
    console.log('THE MESSAGE: ' + msg);
    console.log('TIMER: ' + delay);

    if (delay == null || undefined){
        delay = message_timer_delay;
    }


    // if (tts) {
    //     speak.text = msg;
    //     window.speechSynthesis.speak(speak);
    // }

    if (!message_timer){        
        message_timer = setTimeout(function() {
            resetDisplay();
            state = STATES.REST;
            clearTimeout(message_timer); 
        }, delay * 1000);
    } else {
        // reset timeout
        clearTimeout(message_timer);
        message_timer = setTimeout(function(){
            // reset display
            resetDisplay();
            state = STATES.REST;
            clearTimeout(message_timer);
        }, delay * 1000)
    }
}

function resetDisplay(){
    display.innerText = DEFAULT_MESSAGE;
}

function send(payload){
    const Http = new XMLHttpRequest();
    const url = URL_BASE + "machine/send";

    console.log(`URL: ${url}`);

    Http.open("POST", url, false);
    Http.setRequestHeader('Accept', 'application/json');
    Http.setRequestHeader('Content-Type', 'application/json');

    Http.send(JSON.stringify(payload));

    Http.onreadystatechange = (e) => {
        console.log(Http.responseText)
    }
}

function receive(){
    const Http = new XMLHttpRequest();
    const url = URL_BASE + "machine/receive";

    //console.log(`URL: ${url}`);

    Http.open("GET", url, false);
    Http.setRequestHeader('Accept', 'application/json');
    Http.setRequestHeader('Content-Type', 'application/json');

    Http.send();

    if (Http.status === 200) {
        //console.log(Http.responseText)
        var r = Http.responseText
        if (r == ""){
            return r;
        } else {
            var json = JSON.parse(Http.responseText);
            return json;
        }
    } else {
        console.log(Http.status)
    }   
}