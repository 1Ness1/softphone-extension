const DEFAULT_FLAGS = {
    isInitialized: false,
    softphone: null,
}

let sockets = null;

const T = {
    instance_id: null,
}

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

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log(message)
    if (message.type === "CHANGE") {
        console.log(message)
        DEFAULT_FLAGS.softphone = message.instanceId;
    }

    if (message.type === "INTANCE_ID") {
        console.log("message")
        T.instance_id = `${message.instanceId}`;
    }
});

window.addEventListener("message", function(event) {
  if(!event.data.type) return;
  const { host } = event.data.initialization;

  console.log(host)
//   if(event.data.type === "INTANCE_ID") {
//       T.instance_id = event.data.instanceId;
//   }

  if(event.data.type === "INITIALIZATION") {
      console.log(event.data)

    //   chrome.runtime.sendMessage({type: "INITIALIZATION"});
    //   const socket = new JsSIP.WebSocketInterface(`wss://${host}:8089/ws`);

    //   DEFAULT_FLAGS.softphone =  new JsSIP.UA({
    //       sockets: [socket],
    //       ...event.data.initialization,
    //       ...T.instance_id
    //   });

    //   if(!T.instance_id) {
    //           console.log(DEFAULT_FLAGS.softphone)
    //           chrome.runtime.sendMessage({type: "SET_INSTANCE_ID", instance: {
    //               instanceId: DEFAULT_FLAGS.softphone.configuration.instance_id
    //           }
    //       });
    //   }

      chrome.runtime.sendMessage({type: "INITIALIZATION", ...event.data.initialization});
  }

  if(event.data.type === "OUTGOING_CALL") {
      const {brand, userId} = event.data.userInformation;
      chrome.runtime.sendMessage({type: "OUTGOING_CALL"});
      requestToCallByUserId({
          brand,
          userId
      }).then((result) => {
          if(!DEFAULT_FLAGS.softphone) return;
          console.log(DEFAULT_FLAGS.softphone)
          callToUser(DEFAULT_FLAGS.softphone, {
              brand,
              userId
          })
      });
  }
});