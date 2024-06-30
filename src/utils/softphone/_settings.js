export const _settings = {
    sessions: {},
    currentSession: {},

    _mediaConstraints: {
        audio: true,
    },

    onHold: false,
    onMute: false,

    audioCall: new Audio(chrome.runtime.getURL(`/audio/call.mp3`)),
    audioRing: new Audio(chrome.runtime.getURL(`./audio/beeps.mp3`)),
}