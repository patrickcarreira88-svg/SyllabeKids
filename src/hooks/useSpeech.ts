import { useEffect, useCallback, useRef } from 'react'

interface SpeechOptions {
  lang?: string
  rate?: number
  pitch?: number
  volume?: number
}

interface UseSpeechReturn {
  speak: (text: string, options?: SpeechOptions) => void
  stop: () => void
  pause: () => void
  resume: () => void
  isSpeaking: boolean
  isPaused: boolean
  isSupported: boolean
}

/**
 * Hook pour utiliser la Web Speech API
 * Permet la synthèse vocale en français avec différentes voix
 */
export const useSpeech = (): UseSpeechReturn => {
  const synth = useRef<SpeechSynthesis | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const isSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window

  // Initialiser la synthèse vocale
  useEffect(() => {
    if (isSupported) {
      synth.current = window.speechSynthesis
    }
  }, [isSupported])

  // Chercher la meilleure voix française disponible
  const getVoice = useCallback(() => {
    if (!synth.current) return null

    const voices = synth.current.getVoices()

    // Chercher d'abord une voix spécifique au français
    let voice = voices.find(
      (v) =>
        v.lang === 'fr-FR' ||
        v.lang.startsWith('fr') ||
        v.name.toLowerCase().includes('french')
    )

    // Fallback sur une voix générale
    if (!voice) {
      voice = voices.find((v) => v.lang.startsWith('fr'))
    }

    // Fallback final sur n'importe quelle voix (mais sera en anglais)
    if (!voice) {
      voice = voices[0]
    }

    return voice
  }, [])

  const speak = useCallback(
    (text: string, options: SpeechOptions = {}) => {
      if (!synth.current || !isSupported) {
        console.warn('Web Speech API non supportée')
        return
      }

      // Arrêter toute parole en cours
      synth.current.cancel()

      // Créer une nouvelle utterance
      const utterance = new SpeechSynthesisUtterance(text)

      // Configurer la voix et les paramètres
      utterance.lang = options.lang || 'fr-FR'
      utterance.rate = options.rate || 0.8 // Plus lent pour les enfants
      utterance.pitch = options.pitch || 1.2 // Légèrement plus haut
      utterance.volume = options.volume || 1

      // Chercher la voix
      const voice = getVoice()
      if (voice) {
        utterance.voice = voice
      }

      // Gérer les événements
      utterance.onstart = () => {
        console.log('[Speech] Début de la parole:', text)
      }

      utterance.onend = () => {
        console.log('[Speech] Fin de la parole')
      }

      utterance.onerror = (event) => {
        console.error('[Speech] Erreur:', event.error)
      }

      // Sauvegarder la référence et parler
      utteranceRef.current = utterance
      synth.current.speak(utterance)
    },
    [isSupported, getVoice]
  )

  const stop = useCallback(() => {
    if (synth.current) {
      synth.current.cancel()
      utteranceRef.current = null
    }
  }, [])

  const pause = useCallback(() => {
    if (synth.current && synth.current.paused === false) {
      synth.current.pause()
    }
  }, [])

  const resume = useCallback(() => {
    if (synth.current && synth.current.paused === true) {
      synth.current.resume()
    }
  }, [])

  const isSpeaking =
    isSupported && synth.current
      ? synth.current.speaking && !synth.current.paused
      : false

  const isPaused =
    isSupported && synth.current ? synth.current.paused : false

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isSupported,
  }
}

export default useSpeech
