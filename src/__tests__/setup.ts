import '@testing-library/jest-dom'

// Mock Web Speech API
window.speechSynthesis = {
  speak: () => {},
  cancel: () => {},
  pause: () => {},
  resume: () => {},
  getVoices: () => [],
} as any

// Mock Service Worker
navigator.serviceWorker = {
  register: () => Promise.resolve(),
} as any
