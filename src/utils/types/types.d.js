export const SESSIONS_TYPES = {
  PROGRESS: "progress",
  SDP: "sdp",
  ENDED: "ended",
  FAILED: "failed",

  INCOMING: "remote",
  OUTGOING: "local",
};

export const SOFTPHONE_STATUSES = {
  CONNECTED: "connected",
  REGISTERED: "registered",
  UNREGISTERED: "unregistered",
  REGISTRATION_FAILED: "registrationFailed",
  DISCONNECTED: "disconnected",
  NEW_RTC_SESSION: "newRTCSession",
};

export const TARGETS = {
  TARGET: "target",
  SERVICE_WORKER: "service-worker",
  OFFSCREEN: "offscreen",
  CONTENT_SCRIPT: "content-script",
  WEB: "web",
  VUE: "vue",
}