import JsSIP from "jssip";

import { SOFTPHONE_STATUSES, TARGETS } from "../utils/types/types.d";
import { EVENTS } from "../utils/types/events.d";
import { LOG_STATUSES } from "../utils/types/log.d";

import { initSession } from "../utils/softphone/session";
import { createAudioStream } from "../utils/softphone/audio";
import { _settings } from "../utils/softphone/_settings";
import { outgoingCall, hangUpCall } from "../utils/softphone/controls";

/** IDEAS:
 * - create RE-initialization button on popup.
 * - create api hook
 * - create destroy hook
 * - create audio listeners
 * - create mute/hold listeners
 */

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  const { type } = data;
  if(data.target !== TARGETS.OFFSCREEN) return;
  // INITIALIZATON OF SOFTPHONE

  if (type === EVENTS.HANG_UP_CALL) {
    hangUpCall();
  }

  if (type === EVENTS.OUTGOING_CALL) {
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

    _settings.host = data.host;
    _settings.socket = new JsSIP.WebSocketInterface(`wss://${_settings.host}:8089/ws`);
    _settings.configuration = { ...data };
    _settings.configuration.sockets = [_settings.socket];
    
    _settings.softphoneInstanse = new JsSIP.UA(_settings.configuration);

    _settings.sessions = _settings.softphoneInstanse._sessions;
    _settings.currentSession = {};

    // Start

    _settings.softphoneInstanse.register();
    _settings.softphoneInstanse.start();

    _settings.isDefaultConfigurationSent = true;

    _settings.softphoneInstanse.on(SOFTPHONE_STATUSES.CONNECTED, (e) => {
      console.log(LOG_STATUSES.AGENT_CONNECTED);
      console.log(e);
    });

    _settings.softphoneInstanse.on(SOFTPHONE_STATUSES.DISCONNECTED, (event) => {
      console.log(LOG_STATUSES.AGENT_DISCONNECTED);
    });

    _settings.softphoneInstanse.on(SOFTPHONE_STATUSES.REGISTERED, (e) => {
      _settings.isSentDefaultConfigurationSent = true;
      console.log(LOG_STATUSES.REGISTRATION_COMPLETED);
      console.log(e);
    });

    _settings.softphoneInstanse.on(SOFTPHONE_STATUSES.UNREGISTERED, (e) => {
      console.log(LOG_STATUSES.REGISTRATION_CANCEL);
      console.log(e);
    });

    _settings.softphoneInstanse.on(SOFTPHONE_STATUSES.REGISTRATION_FAILED, (e) => {
      console.log(LOG_STATUSES.REGISTRATION_FAILED);
      console.log(e);
    });

    // TODO: MOVE EVENT TO METHOD
    _settings.softphoneInstanse.on(SOFTPHONE_STATUSES.NEW_RTC_SESSION, (rtcSessionEvent) => {
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
