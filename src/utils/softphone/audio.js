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

