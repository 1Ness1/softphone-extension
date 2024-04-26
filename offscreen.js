
let socket = null;
let isDefaultConfigurationSent = false;
let softphone = null;
let sessions = null;
let softphoneInstanseId = null;
const DEFAULT_CONFIGURATION = {};

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
function callToUser(call, {
    number,
    host,
    brand,
    userId
}) {
    console.log(call)
    call(`sip:${number}@${host}`, {
        "extraHeaders": [`brand:${brand}`, `user_ud:${userId}`],
        "mediaConstraints": {
            "audio": true
        }
    })
}``

const requestToCallByUserId = ({
    brand,
    userId
                               }) => {
    const URL = `https://${window.location.host}/api_user_data_by_phone/phonebyId?brand=${brand}&user=${userId}`;
    return fetch(URL)
        .then(data => data.json())
        .then(result => result);
}

chrome.runtime.onMessage.addListener(( message , sender, sendResponse) => {
      const {type, host} = message;
  if(type === "INITIALIZATION") {
    if(isDefaultConfigurationSent) return;

    console.log(host)
    socket = new JsSIP.WebSocketInterface('wss://' + "sip1.hetzner.tst.oxtech.org" + ':8089/ws');
    DEFAULT_CONFIGURATION.configuration = {...message};
    DEFAULT_CONFIGURATION.configuration.sockets = [socket];
    DEFAULT_CONFIGURATION.host = message.host;
    softphone =  new JsSIP.UA(DEFAULT_CONFIGURATION.configuration);

    softphone.register();
    softphone.start();


    sessions = softphone._sessions;
    isDefaultConfigurationSent = true;

    
    softphone.on('connected', function(e){
        console.log('Agent connected');
        console.log(e);
    });

    softphone.on('registered', function(e) {
        console.log('Registration completed');
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

    softphone.on('newRTCSession', function(e){
        console.log('New session');
        console.log(e);

        // sessions._connection.ontrack = function (event) {
        //     console.log('ontrack: ' + event.track.kind + ' - ' + event.track.id + 'stream ' + event.streams[0].id);
        //     console.log(event)
        //     // for (let i = 0; i < event.streams.length; ++i) {
        //     //   self.handleAudio(event.streams[i]);
        //     // }
        //   };
    })
    
    // softphone.start();
    softphone.call('sip:' + "380662972033" + '@' + DEFAULT_CONFIGURATION.host)

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
});
  // initialize softphone

//   if(type === "RTC") {
//     log('clipboard');
//   }

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

    
//   }

//   if(type === "SET_INSTANCE_ID") {
    // softphoneInstanseId = message.instance.instanceId;
//   }

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

