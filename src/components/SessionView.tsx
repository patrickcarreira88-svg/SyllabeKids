import React, { useState } from 'react'
import { WEEKS_PROGRAM } from '@data/weeksProgram'
import ExerciseContainer from './ExerciseContainer'
import '../styles/components/SessionView.css'
import { useAppStore } from '@stores/appStore'

interface SessionViewProps {
  weekId: number
  onComplete: (score: number) => void
  onBack: () => void
}

interface SessionState {
  currentSessionIndex: number
  sessionScores: number[]
  completedSessions: number[]
}

const SessionView: React.FC<SessionViewProps> = ({
  weekId,
  onComplete,
  onBack,
}) => {
  const { currentProfile, updateProfileProgress } = useAppStore()
  const week = WEEKS_PROGRAM.find((w) => w.id === weekId)

  const [state, setState] = useState<SessionState>({
    currentSessionIndex: 0,
    sessionScores: [],
    completedSessions: [],
  })

  if (!week || !currentProfile) {
    return null
  }

  const currentSession = week.sessions[state.currentSessionIndex]
  const isLastSession = state.currentSessionIndex === week.sessions.length - 1

  const handleSessionComplete = (score: number, attempts: number) => {
    const percentage = Math.round((score / currentSession.words.length) * 100)

    setState((prev) => ({
      ...prev,
      sessionScores: [...prev.sessionScores, percentage],
      completedSessions: [
        ...prev.completedSessions,
        currentSession.id,
      ],
    }))

    // Si c'est la dernière session
    if (isLastSession) {
      handleWeekComplete(percentage)
    } else {
      // Passer à la session suivante après 2 secondes
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          currentSessionIndex: prev.currentSessionIndex + 1,
        }))
      }, 2000)
    }
  }

  const handleWeekComplete = (lastScore: number) => {
    const averageScore = Math.round(
      state.sessionScores.reduce((a, b) => a + b, 0) /
        state.sessionScores.length
    )

    // Mettre à jour la progression du profil
    updateProfileProgress(currentProfile.id, weekId, averageScore)

    // Afficher l'écran de fin
    setTimeout(() => {
      onComplete(averageScore)
    }, 2000)
  }

  return (
    <div className="session-view">
      {/* Header */}
      <div className="session-view__header">
        <button className="btn-back" onClick={onBack}>
          ← Retour
        </button>

        <div className="session-view__info">
          <h1 className="session-view__week-title">{week.title}</h1>
          <p className="session-view__session-title">
            Session {currentSession.id}: {currentSession.title}
          </p>
        </div>

        <div className="session-view__badge">
          <span className="badge-emoji">{week.badge.icon}</span>
          <span className="badge-name">{week.badge.name}</span>
        </div>
      </div>

      {/* Exercice */}
      <div className="session-view__content">
        <ExerciseContainer
          words={currentSession.words}
          exerciseType={currentSession.type}
          onComplete={handleSessionComplete}
          onSkip={() => {
            setState((prev) => ({
              ...prev,
              sessionScores: [...prev.sessionScores, 0],
              completedSessions: [
                ...prev.completedSessions,
                currentSession.id,
              ],
            }))

            if (isLastSession) {
              handleWeekComplete(0)
            } else {
              setTimeout(() => {
                setState((prev) => ({
                  ...prev,
                  currentSessionIndex: prev.currentSessionIndex + 1,
                }))
              }, 1000)
            }
          }}
        />
      </div>

      {/* Progress des sessions */}
      <div className="session-view__sessions-progress">
        <div className="sessions-progress">
          {week.sessions.map((session, idx) => (
            <div
              key={session.id}
              className={`session-indicator ${
                idx < state.completedSessions.length
                  ? 'session-indicator--completed'
                  : idx === state.currentSessionIndex
                  ? 'session-indicator--active'
                  : 'session-indicator--pending'
              }`}
            >
              <span className="session-indicator__number">{session.id}</span>
              {idx < state.completedSessions.length && (
                <span className="session-indicator__check">✓</span>
              )}
            </div>
          ))}
        </div>
        <p className="session-view__session-counter">
          Session {state.currentSessionIndex + 1} / {week.sessions.length}
        </p>
      </div>
    </div>
  )
}

export default SessionView
