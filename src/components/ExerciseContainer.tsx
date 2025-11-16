import React, { useState } from 'react'
import { WORDS_DATABASE } from '@data/wordsDatabase'
import { useSpeech } from '@hooks/useSpeech'
import '../styles/components/ExerciseContainer.css'

export type ExerciseType =
  | 'syllable_count'
  | 'first_syllable'
  | 'build_word'
  | 'fusion'
  | 'mixed'

interface ExerciseContainerProps {
  words: string[]
  exerciseType: ExerciseType
  onComplete: (score: number) => void
  onSkip: () => void
}

interface ExerciseState {
  currentWordIndex: number
  score: number
  attempts: number
  feedback: string
  isCorrect: boolean | null
  selectedAnswer: string | null
  buildingBlocks: string[]
}

const ExerciseContainer: React.FC<ExerciseContainerProps> = ({
  words,
  exerciseType,
  onComplete,
  onSkip,
}) => {
  const { speak, stop, isSpeaking } = useSpeech()

  const [state, setState] = useState<ExerciseState>({
    currentWordIndex: 0,
    score: 0,
    attempts: 0,
    feedback: '',
    isCorrect: null,
    selectedAnswer: null,
    buildingBlocks: [],
  })

  const currentWord = words[state.currentWordIndex]
  const wordData = WORDS_DATABASE[currentWord]

  // Générer les options de réponse
  const generateOptions = () => {
    const syllables = wordData.syllables
    const shuffled = [...syllables].sort(() => Math.random() - 0.5)
    return shuffled
  }

  const options = generateOptions()

  // Gestionnaire pour les réponses
  const handleAnswer = (answer: string) => {
    const syllables = wordData.syllables

    let isCorrect = false
    let feedback = ''

    switch (exerciseType) {
      case 'syllable_count':
        isCorrect = parseInt(answer) === syllables.length
        feedback = isCorrect
          ? `✅ Bravo! "${currentWord}" a ${syllables.length} syllabe(s)!`
          : `❌ Non, "${currentWord}" a ${syllables.length} syllabe(s), pas ${answer}.`
        break

      case 'first_syllable':
        isCorrect = answer === syllables[0]
        feedback = isCorrect
          ? `✅ Exact! La première syllabe est "${syllables[0]}"!`
          : `❌ Non, c'est "${syllables[0]}", pas "${answer}".`
        break

      case 'build_word':
      case 'fusion':
        isCorrect =
          state.buildingBlocks.join('') === syllables.join('')
        feedback = isCorrect
          ? `✅ Excellent! Tu as construit "${currentWord}"!`
          : `❌ Non, essaie à nouveau!`
        break

      case 'mixed':
        // Mélange de tous les types
        if (state.currentWordIndex % 3 === 0) {
          // syllable_count
          isCorrect = parseInt(answer) === syllables.length
        } else if (state.currentWordIndex % 3 === 1) {
          // first_syllable
          isCorrect = answer === syllables[0]
        } else {
          // build_word
          isCorrect =
            state.buildingBlocks.join('') === syllables.join('')
        }
        feedback = isCorrect
          ? '✅ Bravo! C\'est juste!'
          : `❌ Non, c'est "${syllables.join('')}".`
        break
    }

    // Parler le feedback
    if (isCorrect) {
      speak('Bravo! C\'est correct!', {
        rate: 0.7,
        pitch: 1.3,
      })
    } else {
      speak('Essaie encore!', {
        rate: 0.7,
        pitch: 1.0,
      })
    }

    setState((prev) => ({
      ...prev,
      isCorrect,
      feedback,
      selectedAnswer: answer,
      attempts: prev.attempts + 1,
      score: isCorrect ? prev.score + 1 : prev.score,
    }))

    // Passage au mot suivant après 2 secondes
    setTimeout(() => {
      if (state.currentWordIndex < words.length - 1) {
        setState((prev) => ({
          ...prev,
          currentWordIndex: prev.currentWordIndex + 1,
          feedback: '',
          isCorrect: null,
          selectedAnswer: null,
          buildingBlocks: [],
        }))
      } else {
        // Fin de l'exercice
        onComplete(state.score + (isCorrect ? 1 : 0))
      }
    }, 2000)
  }

  // Gestionnaire pour construire les mots
  const handleAddBlock = (syllable: string) => {
    setState((prev) => ({
      ...prev,
      buildingBlocks: [...prev.buildingBlocks, syllable],
    }))
  }

  const handleRemoveBlock = (index: number) => {
    setState((prev) => ({
      ...prev,
      buildingBlocks: prev.buildingBlocks.filter((_, i) => i !== index),
    }))
  }

  const handleValidateBuilding = () => {
    handleAnswer(state.buildingBlocks.join(''))
  }

  const handleSpeak = () => {
    if (isSpeaking) {
      stop()
    } else {
      speak(currentWord, {
        rate: 0.8,
        pitch: 1.2,
      })
    }
  }

  // Rendu selon le type d'exercice
  const renderExercise = () => {
    switch (exerciseType) {
      case 'syllable_count':
        return (
          <div className="exercise exercise--count">
            <div className="exercise__word">
              <div className="exercise__audio-btn">
                <button
                  className={`btn-audio ${isSpeaking ? 'btn-audio--speaking' : ''}`}
                  onClick={handleSpeak}
                >
                  {isSpeaking ? '🔊 Écoutant...' : '🔊 Écoute'}
                </button>
              </div>
              <div className="exercise__emoji">{wordData.emoji}</div>
            </div>

            <div className="exercise__question">
              <p>Combien de syllabes dans "{currentWord}"?</p>
            </div>

            <div className="exercise__options">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  className={`btn-option ${
                    state.selectedAnswer === num.toString()
                      ? 'btn-option--selected'
                      : ''
                  }`}
                  onClick={() => handleAnswer(num.toString())}
                  disabled={state.selectedAnswer !== null}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )

      case 'first_syllable':
        return (
          <div className="exercise exercise--first">
            <div className="exercise__word">
              <button
                className={`btn-audio ${isSpeaking ? 'btn-audio--speaking' : ''}`}
                onClick={handleSpeak}
              >
                {isSpeaking ? '🔊 Écoutant...' : '🔊 Écoute'}
              </button>
              <div className="exercise__emoji">{wordData.emoji}</div>
            </div>

            <div className="exercise__question">
              <p>Quelle est la PREMIÈRE syllabe?</p>
            </div>

            <div className="exercise__options">
              {options.map((syl) => (
                <button
                  key={syl}
                  className={`btn-option ${
                    state.selectedAnswer === syl ? 'btn-option--selected' : ''
                  }`}
                  onClick={() => handleAnswer(syl)}
                  disabled={state.selectedAnswer !== null}
                >
                  {syl}
                </button>
              ))}
            </div>
          </div>
        )

      case 'build_word':
      case 'fusion':
        return (
          <div className="exercise exercise--build">
            <div className="exercise__word">
              <button
                className={`btn-audio ${isSpeaking ? 'btn-audio--speaking' : ''}`}
                onClick={handleSpeak}
              >
                {isSpeaking ? '🔊 Écoutant...' : '🔊 Écoute'}
              </button>
              <div className="exercise__emoji">{wordData.emoji}</div>
            </div>

            <div className="exercise__question">
              <p>Construis le mot "{currentWord}" avec les syllabes</p>
            </div>

            {/* Zone de construction */}
            <div className="exercise__building-zone">
              <div className="building-blocks">
                {state.buildingBlocks.length === 0 ? (
                  <span className="empty-placeholder">Clique sur les syllabes...</span>
                ) : (
                  state.buildingBlocks.map((block, idx) => (
                    <button
                      key={idx}
                      className="building-block"
                      onClick={() => handleRemoveBlock(idx)}
                      title="Clique pour enlever"
                    >
                      {block} ✕
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Banque de syllabes */}
            <div className="exercise__syllable-bank">
              {wordData.syllables.map((syl, idx) => (
                <button
                  key={`${syl}-${idx}`}
                  className="btn-syllable"
                  onClick={() => handleAddBlock(syl)}
                  disabled={state.buildingBlocks.filter((b) => b === syl).length >= wordData.syllables.filter((s) => s === syl).length}
                >
                  {syl}
                </button>
              ))}
            </div>

            {/* Bouton validation */}
            <button
              className="btn btn-primary"
              onClick={handleValidateBuilding}
              disabled={state.buildingBlocks.length === 0}
            >
              ✅ Valider
            </button>
          </div>
        )

      case 'mixed':
        // Alterner les types d'exercices
        const mixedType = [
          'syllable_count',
          'first_syllable',
          'build_word',
        ][state.currentWordIndex % 3] as ExerciseType
        
        // Récursion avec le type mélangé
        if (mixedType === 'syllable_count') {
          return (
            <div className="exercise exercise--count">
              <div className="exercise__word">
                <button
                  className={`btn-audio ${isSpeaking ? 'btn-audio--speaking' : ''}`}
                  onClick={handleSpeak}
                >
                  {isSpeaking ? '🔊 Écoutant...' : '🔊 Écoute'}
                </button>
                <div className="exercise__emoji">{wordData.emoji}</div>
              </div>
              <div className="exercise__question">
                <p>Combien de syllabes dans "{currentWord}"?</p>
              </div>
              <div className="exercise__options">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    className={`btn-option ${
                      state.selectedAnswer === num.toString()
                        ? 'btn-option--selected'
                        : ''
                    }`}
                    onClick={() => handleAnswer(num.toString())}
                    disabled={state.selectedAnswer !== null}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )
        } else if (mixedType === 'first_syllable') {
          return (
            <div className="exercise exercise--first">
              <div className="exercise__word">
                <button
                  className={`btn-audio ${isSpeaking ? 'btn-audio--speaking' : ''}`}
                  onClick={handleSpeak}
                >
                  {isSpeaking ? '🔊 Écoutant...' : '🔊 Écoute'}
                </button>
                <div className="exercise__emoji">{wordData.emoji}</div>
              </div>
              <div className="exercise__question">
                <p>Quelle est la PREMIÈRE syllabe?</p>
              </div>
              <div className="exercise__options">
                {options.map((syl) => (
                  <button
                    key={syl}
                    className={`btn-option ${
                      state.selectedAnswer === syl ? 'btn-option--selected' : ''
                    }`}
                    onClick={() => handleAnswer(syl)}
                    disabled={state.selectedAnswer !== null}
                  >
                    {syl}
                  </button>
                ))}
              </div>
            </div>
          )
        } else {
          return (
            <div className="exercise exercise--build">
              <div className="exercise__word">
                <button
                  className={`btn-audio ${isSpeaking ? 'btn-audio--speaking' : ''}`}
                  onClick={handleSpeak}
                >
                  {isSpeaking ? '🔊 Écoutant...' : '🔊 Écoute'}
                </button>
                <div className="exercise__emoji">{wordData.emoji}</div>
              </div>
              <div className="exercise__question">
                <p>Construis le mot "{currentWord}" avec les syllabes</p>
              </div>
              <div className="exercise__building-zone">
                <div className="building-blocks">
                  {state.buildingBlocks.length === 0 ? (
                    <span className="empty-placeholder">Clique sur les syllabes...</span>
                  ) : (
                    state.buildingBlocks.map((block, idx) => (
                      <button
                        key={idx}
                        className="building-block"
                        onClick={() => handleRemoveBlock(idx)}
                      >
                        {block} ✕
                      </button>
                    ))
                  )}
                </div>
              </div>
              <div className="exercise__syllable-bank">
                {wordData.syllables.map((syl, idx) => (
                  <button
                    key={`${syl}-${idx}`}
                    className="btn-syllable"
                    onClick={() => handleAddBlock(syl)}
                    disabled={state.buildingBlocks.filter((b) => b === syl).length >= wordData.syllables.filter((s) => s === syl).length}
                  >
                    {syl}
                  </button>
                ))}
              </div>
              <button
                className="btn btn-primary"
                onClick={handleValidateBuilding}
                disabled={state.buildingBlocks.length === 0}
              >
                ✅ Valider
              </button>
            </div>
          )
        }

      default:
        return null
    }
  }

  return (
    <div className="exercise-container">
      {/* En-tête */}
      <div className="exercise-container__header">
        <div className="exercise-container__progress">
          <div className="progress-bar">
            <div
              className="progress-bar__fill"
              style={{
                width: `${
                  ((state.currentWordIndex + 1) / words.length) * 100
                }%`,
              }}
            ></div>
          </div>
          <p className="exercise-container__counter">
            {state.currentWordIndex + 1} / {words.length}
          </p>
        </div>

        <div className="exercise-container__score">
          <span>✨ Score: {state.score}</span>
        </div>
      </div>

      {/* Exercice */}
      <div className="exercise-container__content">{renderExercise()}</div>

      {/* Feedback */}
      {state.feedback && (
        <div
          className={`exercise-container__feedback ${
            state.isCorrect
              ? 'exercise-container__feedback--correct'
              : 'exercise-container__feedback--incorrect'
          }`}
        >
          <p>{state.feedback}</p>
        </div>
      )}

      {/* Actions */}
      <div className="exercise-container__actions">
        <button className="btn btn-secondary" onClick={onSkip}>
          ⏭️ Passer
        </button>
      </div>
    </div>
  )
}

export default ExerciseContainer
