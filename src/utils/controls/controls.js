import { _settings } from "../softphone/_settings";
import { EVENTS } from "../types/events.d";
import { LOG_STATUSES } from "../types/log.d";

export const outgoingCall = ({
    number,
    userData,
}) => {
    // If we don't have softphone instanse then send message to local softphone...
    if(!_settings.softphoneInstanse) {
        window.postMessage({type: EVENTS.INVALID_CALL});
        return;
    }

    _settings.softphoneInstanse.call(`sip:${number}@${_settings.host}`, {
        mediaConstraints: _settings._mediaConstraints,
        ...userData
    });
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