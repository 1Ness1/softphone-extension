import JsSip from "jssip";

console.log(JsSip)
let socket = null;
let isDefaultConfigurationSent = false;
let softphone = null;
let sessions = null;
let session = null;
let softphoneInstanseId = null;
const DEFAULT_CONFIGURATION = {
  _mediaConstraints: {
    "audio": true
  }
};

// navigator.mediaDevices.getUserMedia({
//     audio: {
//       mandatory: {
//         chromeMediaSource: 'tab',
//         // chromeMediaSourceId: streamId
//       }
//     }
//   })

// const setDefaultConfigurations = () => {
//   isConfigurationSent = true;
// }

// send to worker
// const log = async () => chrome.runtime.sendMessage({
//     target: 'background',
//     type: 'log',
//     data: {
//         socket: "JsSIP",
//     },
// });

// // get from page
// window.addEventListener("message", (event) => {
//     console.log(event)
// });

// window.addEventListener("message", function(event) {
//     console.log(event.data)
//     const {host} = event.data.type;
//     if(type === "INITIALIZATION") {
//         if(isDefaultConfigurationSent) return;
    
//         socket = new JsSIP.WebSocketInterface(`wss://${message.host}:8099/ws`);
//         DEFAULT_CONFIGURATION.configuration = {...message};
//         DEFAULT_CONFIGURATION.configuration.sockets = [socket];
//         DEFAULT_CONFIGURATION.host = message.host;
//         console.log(message)
//         softphone =  new JsSIP.UA(DEFAULT_CONFIGURATION.configuration);
//         sessions = softphone._sessions;
//         isDefaultConfigurationSent = true;
//       }
// })
// function callToUser(call, {
//     number,
//     host,
//     brand,
//     userId
// }) {
//     console.log(call)
//     // TO CALL ADD MEDIA CONSTRAINTS!!!
//     call(`sip:${number}@${host}`, {
//         "extraHeaders": [`brand:${brand}`, `user_ud:${userId}`],
//         "mediaConstraints": {
//             "audio": true
//         }
//     })
// }

// const requestToCallByUserId = ({
//     brand,
//     userId
//                                }) => {
//     const URL = `https://${window.location.host}/api_user_data_by_phone/phonebyId?brand=${brand}&user=${userId}`;
//     return fetch(URL)
//         .then(data => data.json())
//         .then(result => result);
// }


const initSession = (event) => {
    session = event.session;

    session.on('progress', function (event){
      console.log('Progress ... Ringing ... ');
    })

    session.on('sdp', function (event){
      if (event.originator === 'remote' && event.type === 'answer'){
        console.log('Answer');
      }
    })

    session.on('ended', function (event){
      console.log(event);
      session = {}
    });

    session.on('failed', function (event){
      console.log(event);
      session = {}
    });

    setInterval(checkActiveSession, 1000);

    function checkActiveSession(){
      let id = session._id ?? 0;
      if (id !== 0 && !sessions[id]){
        session = {}
      }
    }
}
  
const handleAudio = (stream) => {
    console.log('New audio stream');
                let audio = document.createElement("audio");
                audio.style.display = 'none';
                audio.autoplay = true;
                audio.playsinline = true;
                audio.srcObject = stream;
                audio.onloadedmetadata = function () {
                    let audio = stream.getAudioTracks();
                    for (let i = 0; i < audio.length; ++i) {
                        audio[i].enabled = true;
                    }
                };
                audio.id = 'audio';
                let multimedia = document.getElementById('softphone-audio');
                multimedia.appendChild(audio);

                // let volumeInput = document.getElementById('dynamicVolumeControl');
                // volumeInput.addEventListener('input', function() {
                //   const volume = parseInt(this.value) / 100;
                //   audio.volume = volume;
                // });
}

class Softphone {
  constructor() {
    this.socket = new JsSIP.WebSocketInterface(`wss://${DEFAULT_CONFIGURATION.host}:8089/ws`);
    DEFAULT_CONFIGURATION.configuration = {...data};
    DEFAULT_CONFIGURATION.configuration.sockets = [this.socket];
    DEFAULT_CONFIGURATION.host = data.host;
    this._instanse = new JsSip.UA(DEFAULT_CONFIGURATION.configuration);
    this.sessions = this._instanse.sessions;
    this.session = {};
    this._instanse.register();
    this._instanse.start();
  }
}

chrome.runtime.onMessage.addListener((data , sender, sendResponse) => {
  const { type } = data;
  // INITIALIZATON OF SOFTPHONE
  if(type === "TEST") {
    console.log(data);
  }

  if(type === "INITIALIZATION") {
    if(isDefaultConfigurationSent) return;

    socket = new JsSIP.WebSocketInterface("wss://sip1.hetzner.tst.oxtech.org:8089/ws");
    DEFAULT_CONFIGURATION.configuration = {...data};
    DEFAULT_CONFIGURATION.configuration.sockets = [ socket ];
    DEFAULT_CONFIGURATION.host = data.host;
    softphone = new JsSIP.UA(DEFAULT_CONFIGURATION.configuration);
    sessions = softphone._sessions;
    session = {};
    softphone.register();
    softphone.start();

    isDefaultConfigurationSent = true;
    
    softphone.on('connected', function(e){
        console.log('Agent connected');
        console.log(e);
    });

    softphone.on('registered', function(e) {
        console.log('Registration completed');
        console.log(e);
      });

    softphone.on('unregistered', function(e){
        console.log('Registration cancel');
        console.log(e);
    });

    softphone.on('registrationFailed', function(e){
        console.log('Registration failed');
        console.log(e);
    });

    softphone.on('disconnected', function(event){
        console.log('Agent disconnected');
    })

    // TODO: MOVE EVENT TO METHOD
    softphone.on('newRTCSession', function(rtcSessionEvent){
        console.log('New session');
        console.log(rtcSessionEvent);

        initSession(rtcSessionEvent);

        rtcSessionEvent.session._connection.ontrack = function (event) {
            console.log('ontrack: ' + event.track.kind + ' - ' + event.track.id + 'stream ' + event.streams[0].id);
            console.log(event)
            for (let i = 0; i < event.streams.length; ++i) {
                handleAudio(event.streams[i]);
            }
          };
    })
    
    // softphone.start();
    // softphone.call('sip:' + "380662972033" + '@' + DEFAULT_CONFIGURATION.host);

    // if(type === "OUTGOING_CALL") {
    //     const {brand, userId} = event.data.userInformation;
    //     chrome.runtime.sendMessage({type: "OUTGOING_CALL"});
    //     requestToCallByUserId({
    //         brand,
    //         userId
    //     }).then((result) => {
    //         // if(!DEFAULT_FLAGS.softphone) return;
    //         // console.log(DEFAULT_FLAGS.softphone)
    //         callToUser(DEFAULT_FLAGS.softphone, {
    //             brand,
    //             userId
    //         })
    //     });
    // }

   
  }

  if(type === "OUTGOING_CALL") {
    softphone.call(`sip:${data.number}@${DEFAULT_CONFIGURATION.host}`, {
      mediaConstraints: DEFAULT_CONFIGURATION._mediaConstraints
    });
  }
});
  // initialize softphone

  // 

//   if(type === "INITIALIZATION" && !isDefaultConfigurationSent) {
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //   chrome.tabs.sendMessage(tabs[0].id, {
    //     type: "INTANCE_ID",
    //     instanceId: `${softphoneInstanseId}`,
    //   });
    // // })
    // chrome.tabs.sendMessage(tab.id, {greeting: "hello"}, function(response) {
    //   // innerText does not let the attacker inject HTML elements.
    //   // console.log(window);
    //   document.getElementById("resp").innerText = response.farewell;
    // });

    // socket = new JsSIP.WebSocketInterface(`wss://${message.host}:8099/ws`);
    // DEFAULT_CONFIGURATION.configuration = {...message.configuration};
    // DEFAULT_CONFIGURATION.configuration.sockets = [socket];
    // DEFAULT_CONFIGURATION.host = message.host;
    // softphone =  new JsSIP.UA(DEFAULT_CONFIGURATION.configuration);
    // sessions = softphone._sessions;


//   if(type === "OUTGOING_CALL") {
//     console.log(softphone)
//     console.log(softphone.call)
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//       chrome.tabs.sendMessage(tabs[0].id, {
//         type: "CHANGE",
//         changes: `${softphone.call}`
//     });
//   });
//     if(success) {
//       callToUser(softphone, {
//         number: phone,
//         host: DEFAULT_CONFIGURATION.host,
//         brand: brand,
//         userId: userId
//       })
//     }

    // chrome.tabs.sendMessage(sender.tab.id, {response: "hello from background.js"})
//   }


