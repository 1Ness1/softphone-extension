import JsSIP from "jssip";

import { SOFTPHONE_STATUSES } from "../utils/types/types.d";
import { EVENTS } from "../utils/types/events.d";
import { LOG_STATUSES } from "../utils/types/log.d";

import { initSession } from "../utils/softphone/session";
import { createAudioStream } from "../utils/softphone/audio";
import { _settings } from "../utils/softphone/_settings";
import { outgoingCall, hangUpCall } from "../utils/controls/controls";

const DEFAULT_CONFIGURATION = {
  _mediaConstraints: {
    audio: true,
  },
};

// navigator.mediaDevices.getUserMedia({
//     audio: {
//       mandatory: {
//         chromeMediaSource: 'tab',
//         // chromeMediaSourceId: streamId
//       }
//     }
//   })

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  const { type } = data;
  // INITIALIZATON OF SOFTPHONE

  if(type === EVENTS.HANG_UP_CALL) {
    hangUpCall();
  }

  if(type === EVENTS.OUTGOING_CALL) {
    outgoingCall({
      number: data.number,
      userData: data.userData,
    });
  }

  if (type === EVENTS._TEST) {
    console.log(data);
  }

  // AFTER THIS EVENT ANYTHING WON'T WORK
  if (type === EVENTS.INITIALIZATION) {
    if (_settings.isSentDefaultConfigurationSent) return;

    _settings.socket = new JsSIP.WebSocketInterface("wss://sip1.hetzner.tst.oxtech.org:8089/ws");
    _settings.configuration = { ...data };
    _settings.configuration.sockets = [ _settings.socket ];
    _settings.host = data.host;
    _settings.softphoneInstanse = new JsSIP.UA(_settings.configuration);

    _settings.sessions = _settings.softphoneInstanse._sessions;
    _settings.currentSession = {};

    // Start

    _settings.softphoneInstanse.register();
    _settings.softphoneInstanse.start();

    _settings.isDefaultConfigurationSent = true;

    _settings.softphoneInstanse.on(SOFTPHONE_STATUSES.CONNECTED, function (e) {
      console.log(LOG_STATUSES.AGENT_CONNECTED);
      console.log(e);
    });

    _settings.softphoneInstanse.on(SOFTPHONE_STATUSES.DISCONNECTED, function (event) {
      console.log(LOG_STATUSES.AGENT_DISCONNECTED);
    });

    _settings.softphoneInstanse.on(SOFTPHONE_STATUSES.REGISTERED, function (e) {
      console.log(LOG_STATUSES.REGISTRATION_COMPLETED);
      console.log(e);
    });

    _settings.softphoneInstanse.on(SOFTPHONE_STATUSES.UNREGISTERED, function (e) {
      console.log(LOG_STATUSES.REGISTRATION_CANCEL);
      console.log(e);
    });

    _settings.softphoneInstanse.on(SOFTPHONE_STATUSES.REGISTRATION_FAILED, function (e) {
      console.log(LOG_STATUSES.REGISTRATION_FAILED);
      console.log(e);
    });

    // TODO: MOVE EVENT TO METHOD
    _settings.softphoneInstanse.on(SOFTPHONE_STATUSES.NEW_RTC_SESSION, function (rtcSessionEvent) {
      console.log(LOG_STATUSES.NEW_SESSION);
      console.log(rtcSessionEvent);

      initSession(rtcSessionEvent);

      rtcSessionEvent.session._connection.ontrack = function (event) {
        console.log(`ontrack: ${event.track.kind} - ${event.track.id} stream ${event.streams[0].id}`);
        console.log(event);

        event.streams.forEach((stream) => createAudioStream(stream));
      };
    });
  }

  
});
