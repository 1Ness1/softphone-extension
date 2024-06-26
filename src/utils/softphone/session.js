import { _settings } from "./_settings";
import { SESSIONS_TYPES } from "../types/types.d";
import { LOG_STATUSES } from "../types/log.d";

const checkActionSession = (timerDelay = 1000) => {
    const IS_NOT_EXISTS_ID = 0;

    const interval = setInterval(() => {
        const id = _settings.currentSession._id ?? IS_NOT_EXISTS_ID;
        if (id !== IS_NOT_EXISTS_ID && !_settings.sessions[id]){
            _settings.currentSession = {}
            clearInterval(interval);
        }
    }, timerDelay);
};

export const initSession = (event) => {
    _settings.currentSession = event.session;

    _settings.currentSession.on(SESSIONS_TYPES.PROGRESS, (event) => {
      console.log(LOG_STATUSES.RINGING);
    })

    _settings.currentSession.on(SESSIONS_TYPES.SDP, (event) => {
      if (event.originator === 'remote' && event.type === 'answer'){
        console.log(LOG_STATUSES.ANSWER);
      }
    })

    _settings.currentSession.on(SESSIONS_TYPES.ENDED, (event) => {
      console.log(event);
      _settings.currentSession = {}
    });

    _settings.currentSession.on(SESSIONS_TYPES.FAILED, (event) => {
      console.log(event);
      _settings.currentSession = {}
    });

    checkActionSession();
}