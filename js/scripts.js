'use strict';

/* globals MediaRecorder */

let mediaRecorder;
let recordedBlobs;

const errorMsgElement = document.querySelector('span#errorMsg');
const recordedVideo = document.querySelector('video#camera2');
const recordButton = document.querySelector('button#record');
const playButton = document.querySelector('button#play');
const scoreButton = document.querySelector('button#score');

function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

scoreButton.addEventListener('click', () => {
  let totalFillerWords = document.getElementById("totalFillerWords");
  let f= document.createElement('f');
  f.innerText= " "+ wordsCount;
  totalFillerWords.appendChild(f);

  let fillerWords = document.createElement('fillerWords');
  
  let a= document.createElement('a');

  if (youKnow>0)
  {
    a.innerText="You know: " + youKnow +"<br>";
    fillerWords.appendChild(a);
  }

  let b= document.createElement('b');

  if (iMean>0)
  {
    b.innerText="I mean: " + iMean +"<br>";
    fillerWords.appendChild(b);
  }

  let c= document.createElement('c');

  if (okay>0)
  {
    c.innerText="Okay: " + okay +"<br>";
    fillerWords.appendChild(c);
  }

  let d= document.createElement('d');

  if (basically>0)
  {
    d.innerText="Basically: " + basically +"<br>";
    fillerWords.appendChild(d);
  }

  let e= document.createElement('e');

  if (so>0)
  {
    e.innerText="So: " + so +"<br>";
    fillerWords.appendChild(e);
  }

  document.getElementById("numberofFillerWords").innerHTML=fillerWords.innerText;

});


recordButton.addEventListener('click', () => { 
  if (recordButton.textContent === 'Record') {
    startRecording();
    spoken.innerHTML="";
  } else {
    stopRecording();
    document.getElementById("meter").remove();
    document.getElementById("volumeLevel").remove();
    document.getElementById("alerts").remove();
    recordButton.textContent = 'Record';
    playButton.disabled = false;
    scoreButton.disabled = false;
  }
});


playButton.addEventListener('click', () => {
  
  const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
  recordedVideo.src = null;
  recordedVideo.srcObject = null;
  recordedVideo.src = window.URL.createObjectURL(superBuffer);
  recordedVideo.controls = true;
  recordedVideo.play();
});


function handleDataAvailable(event) {
  console.log('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function startRecording() {
  startVM();
  recognition.start();
  recordedBlobs = [];
  let options = {mimeType: 'video/webm;codecs=vp9,opus'};
  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }

  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  recordButton.textContent = 'Stop Recording';
  playButton.disabled = true;
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
  pressedStop = 1;
  recognition.stop();
}

function handleSuccess(stream) {
  recordButton.disabled = false;
  console.log('getUserMedia() got stream:', stream);
  window.stream = stream;

  const cameraVideo = document.querySelector('video#camera2');
  cameraVideo.srcObject = stream;
}

async function init(constraints) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    console.error('navigator.getUserMedia error:', e);
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

document.querySelector('button#start').addEventListener('click', async () => {
    document.getElementById("hidden1").style.display ="";
    document.getElementById("hidden2").style.display ="";
    document.querySelector('video#camera2').innerHTML='<video id="recording" class="card-img-top mb-5 mb-md-0" playsinline loop></video>';
    const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
    const constraints = {
        audio: {
        echoCancellation: {exact: hasEchoCancellation}
        },
        video: {
        width: 1280, height: 720
        }
    };
    console.log('Using media constraints:', constraints);
    await init(constraints);
});



/////////////speech to text



const btn = document.querySelector('button#record');
//const btn2 = document.querySelector('.stop');
const content = document.querySelector('.content'); //warnings
const count = document.querySelector('.count');
const spoken = document.querySelector('.spoken');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;//for future implementation
const recognition = new SpeechRecognition();//constructor to define speech recognitin instance

var wordsCount=0;
var pressedStop = 0;

var youKnow=0;
var iMean =0;
var okay=0;
var basically=0;
var so=0;


//recognition.continuous = true;
recognition.interimResults = true;//giving real time speech into text

let p = document.createElement('p');

recognition.addEventListener('result', (e) => {
    const text = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
    
    p.innerText = text;
    spoken.appendChild(p);//the text on screen

    if(e.results[0].isFinal){
      if (text.includes('you know')){
        spoken.appendChild(p);
        wordsCount++;
        youKnow++;
        console.log(wordsCount);
      }
      if (text.includes('I mean')){
        spoken.appendChild(p);
        wordsCount++;
        iMean++;
        console.log(wordsCount);
      }
      if (text.includes('okay')){
        spoken.appendChild(p);
        wordsCount++;
        okay++;
        console.log(wordsCount);
      }
      if (text.includes('basically')){
        spoken.appendChild(p);
        wordsCount++;
        basically++;
        console.log(wordsCount);
      }
      if (text.includes(' so ')){
        spoken.appendChild(p);
        wordsCount++;
        so++;
        console.log(wordsCount);
      }
      p = document.createElement('p');
    }
    if(e.results[0]){
      if (text.includes('you know')){
        const finalText = 'Do not say "You know"!';
        content.textContent = finalText;
      }
      if (text.includes('I mean')){
        const finalText = 'Do not say "I mean"!';
        content.textContent = finalText;
      }
      if (text.includes('okay')){
        const finalText = 'Do not say "Okay"!';
        content.textContent = finalText;
      }
      if (text.includes('basically')){
        const finalText = 'Do not say "Basically"!';
        content.textContent = finalText;
      }
      if (text.includes(' so ')){
        const finalText = 'Do not say "So"!';
        content.textContent = finalText;
      }
    }

    console.log(text);

})


recognition.addEventListener('end', ()=>{ //when a session stops at a pause, resume recordign again
    if (pressedStop == 0) {
      recognition.start();
    }
})

recognition.onstart = function() { //when user starts talking
  console.log('voice activated')
};




////////////////////for saving videos

document.querySelector('button#save2').addEventListener('click', () => {
  
  var title = document.getElementById('inputTitle').value;
  var savedTitle= document.getElementById('savedTitle');
  savedTitle.innerHTML= title;
  title = document.getElementById('inputTitle').value="";


  var canvas = document.getElementById('savedVideo');     
  var video = recordedVideo;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);  
  canvas.toBlob(blob => {
    var img = new Image();
    img.src = window.URL.createObjectUrl(blob);
  });


  var videoElement = document.getElementById('camera2');
  videoElement.pause();
  videoElement.removeAttribute('src'); // empty source
  videoElement.load();

  const cameraVideo = document.querySelector('video#camera2');
  const volumeLevel = document.getElementById("volumeLevel");
  cameraVideo.srcObject = stream;

  content.textContent="";
  spoken.textContent="Text from your presentation...";
  volumeLevel.remove();

});



//gazetracker
window.saveDataAcrossSessions = true
const trackinn = document.getElementById("gazeTracker")

const LOOK_DELAY = 1000;//1 second delay
const LEFT_CUTOFF = window.innerWidth / 12
const RIGHT_CUTOFF = window.innerWidth - window.innerWidth / 12

let startLookTime = Number.POSITIVE_INFINITY
let lookDirection = null

webgazer
  .setGazeListener((data, timestamp) => {
    if (data == null || lookDirection === "STOP") return

    if (
      data.x < LEFT_CUTOFF &&
      lookDirection !== "LEFT" &&
      lookDirection !== "RESET"
    ) {
      startLookTime = timestamp
      lookDirection = "LEFT"
    } else if (
      data.x > RIGHT_CUTOFF &&
      lookDirection !== "RIGHT" &&
      lookDirection !== "RESET"
    ) {
      startLookTime = timestamp
      lookDirection = "RIGHT"
    } else if (data.x >= LEFT_CUTOFF && data.x <= RIGHT_CUTOFF) {
      startLookTime = Number.POSITIVE_INFINITY
      lookDirection = null
    }

    if (startLookTime + LOOK_DELAY < timestamp) {
      if (lookDirection === "LEFT") {
        console.log("left")
        trackinn.textContent ="Keep eye contact!"
        setTimeout(() => {
          trackinn.textContent =" "
        }, 2000)
      } else {
        console.log("right")
        trackinn.textContent ="Keep eye contact!"
        setTimeout(() => {
          trackinn.textContent =" "
        }, 2000)
      }

      startLookTime = Number.POSITIVE_INFINITY
      lookDirection = "STOP"
      setTimeout(() => {
        lookDirection = "RESET"
      }, 200)
    }
  })
  .begin()

webgazer.showVideoPreview(false)
//.showPredictionPoints(false)
