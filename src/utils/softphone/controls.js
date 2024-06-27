import { _settings } from "./_settings";
import { EVENTS } from "../types/events.d";
import { LOG_STATUSES } from "../types/log.d";
import { usePlayerData } from "../api/usePlayerData";

export const outgoingCall = async ({
    number,
    userData,
}) => {
    // If we don't have softphone instanse then send message to local softphone...
    if(!_settings.softphoneInstanse) {
        window.postMessage({type: EVENTS.INVALID_CALL});
        return;
    }

    const playersData = await usePlayerData(number);
    console.log(playersData);
    // _settings.softphoneInstanse.call(`sip:${number}@${_settings.host}`, {
    //     mediaConstraints: _settings._mediaConstraints,
    //     ...userData
    // });
}

export const answerCall = (event) => {
    console.log(`ontrack: ${event.track.kind} - ${event.track.id} stream ${event.streams[0].id}`);
    console.log(event);

    event.streams.forEach((stream) => createAudioStream(stream));
    // timer
}

export const hangUpCall = () => {
    try {
        if(_settings.currentSession["_connection"]) _settings.currentSession._connection.close();
        if(_settings.currentSession["_id"]) _settings.currentSession.terminate();
    } catch (error) {
        console.error(`${LOG_STATUSES.FAILED_HANG_UP}: ${error}`);
    } finally {
        _settings.currentSession = {};    
        // stop timer
    }
}

export const holdCall = () => {
    if(_settings.onHold) {
        _settings.currentSession.unhold();
        _settings.onHold = false;
        return;
    }

    _settings.currentSession.hold();
    _settings.onHold = true;
}

export const muteCall = () => {
    if(_settings.onMute) {
        _settings.currentSession.unmute();
        _settings.onMute = false;
        return;
    }

    _settings.currentSession.mute();
    _settings.onMute = true;
}

export const resetSettings = () => {
    _settings.onHold = false;
    _settings.onMute = false;
}