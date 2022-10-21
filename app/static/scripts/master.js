var input_poll;
var input_poll_delay = 2;

const display = document.getElementById("display");
const input_message = document.getElementById("message");
// URLS
//const URL_BASE = 'http://127.0.0.1:5000/';
const URL_BASE = 'https://vending-lmao.herokuapp.com/';

var item = '';
var TTS = false;

input_poll = setInterval(function(){
    // update here
    //console.log("listening...")
    item = receive();

    if (item == ""){

    } else {
        display.innerHTML = item;
    }
}, input_poll_delay * 1000);



// Listeners
var b_send = document.getElementById('message');
b_send.addEventListener('keydown', function(e) {
    if ( (e.key === 'Enter') && !e.repeat) {
        //alert(e.target.value)
        e.preventDefault()
        setMessage(e.target.value)
    }
})
var b_vend = document.getElementById('vend');
b_vend.addEventListener('click', function(){
    send("Vending...")
    display.innerHTML = '';
})

var b_out = document.getElementById('out');
b_out.addEventListener('click', function(){
    send("Out of stock!")
    display.innerHTML = '';
})

var b_marine = document.getElementById('marine');
b_marine.addEventListener('click', function(){
    send("What the fuck did you just fucking say about me, you little bitch? I'll have you know I graduated top of my class in the Navy Seals, and I've been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I'm the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You're fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that's just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little \"clever\" comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn't, you didn't, and now you're paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You're fucking dead, kiddo.", true, 100);
    display.innerHTML = '';
})

var b_tts = document.getElementById('tts');
b_tts.addEventListener('click', function(){
    TTS = !TTS;
})


function setMessage(form){
    if (typeof(form) == 'object'){
        form = form.message.value;
    }
    console.log(form)
    send(form);
    display.innerHTML = '';
    input_message.value = '';
}

function receive(){
    const Http = new XMLHttpRequest();
    const url = URL_BASE + "master/receive";

    //console.log(`URL: ${url}`);

    Http.open("GET", url, false);
    Http.setRequestHeader('Accept', 'application/json');
    Http.setRequestHeader('Content-Type', 'application/json');

    Http.send();

    if (Http.status === 200) {
        console.log(Http.responseText)
        return Http.responseText
    } else {
        console.log(Http.status)
    }    
}

function send(payload, speak = false, time = None) {
    const Http = new XMLHttpRequest();
    const url = URL_BASE + "master/send";

    console.log(`URL: ${url}`);

    var talk = TTS;
    if (speak) {
        talk = speak;
    }

    var primed_payload = {
        "message": payload,
        "TTS": talk,
        "time": time,
    }

    console.log("THE TIME: AHHHH ~~~ " + time);

    Http.open("POST", url, false);
    Http.setRequestHeader('Accept', 'application/json');
    Http.setRequestHeader('Content-Type', 'application/json');

    Http.send(JSON.stringify(primed_payload));

    Http.onreadystatechange = (e) => {
        console.log(Http.responseText)
    }
}