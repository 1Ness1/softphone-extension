import { _settings } from "./_settings";
import { LOG_STATUSES } from "../types/log.d";
// const handleAudio = (stream) => {
//     console.log(LOG_STATUSES.NEW_AUDIO_STREAM);
//     let audio = document.createElement("audio");
//     audio.style.display = 'none';
//     audio.autoplay = true;
//     audio.playsinline = true;
//     audio.srcObject = stream;
//     audio.onloadedmetadata = function () {
//         let audio = stream.getAudioTracks();
//         for (let i = 0; i < audio.length; ++i) {
//             audio[i].enabled = true;
//         }
//     };
//     audio.id = 'audio';
//     let multimedia = document.getElementById('softphone-audio');
//     multimedia.appendChild(audio);
// }

const insertAudioToDomElement = (audio) => {
    const multimedia = document.getElementById('softphone-audio');
    multimedia.appendChild(audio);
}

const createAudio = (stream) => {
    const audio = document.createElement("audio");
    audio.style.display = "none";
    audio.autoplay = true;
    audio.playsinline = true;
    audio.srcObject = stream;
    audio.id = 'audio';
    audio.addEventListener("loadedmetadata", () => {
        const audioStream = stream.getAudioTracks();
        audioStream.forEach((audioElement) => audioElement.enabled = true);
    });

    return audio;
}

export const createAudioStream = (audioStream) => {
    console.log(LOG_STATUSES.NEW_AUDIO_STREAM);
    createAudio();
    insertAudioToDomElement(createAudio(audioStream))
}

export const playAudioCall = () => {
    _settings.audioCall.loop = true;
    _settings.audioCall.play().catch(() => console.error("Chrome cannot play sound without user interaction first"));
}

export const playAudioRing = () => {
    _settings.audioRing.loop = true;
    _settings.audioRing.play().catch(() => console.error(`Chrome cannot play sound without user interaction first`));
}

export const stopAudioCall = () => {
    if(_settings.audioCall) _settings.audioCall.pause();
}

export const stopAudioRing = () => {
    if(_settings.audioRing) _settings.audioRing.pause();
}
