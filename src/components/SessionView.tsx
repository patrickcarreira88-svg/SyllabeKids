import React, { useState } from 'react'
import { WEEKS_PROGRAM } from '@data/weeksProgram'
import ExerciseContainer from './ExerciseContainer'
import '../styles/components/SessionView.css'

interface SessionViewProps {
  weekId: number
  onComplete: (score: number) => void
  onBack: () => void
}

const SessionView: React.FC<SessionViewProps> = ({
  weekId,
  onComplete,
  onBack,
}) => {
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0)
  const [sessionScore, setSessionScore] = useState(0)

  const week = WEEKS_PROGRAM.find((w: any) => w.id === weekId)
  if (!week) return <div>Semaine non trouvée</div>

  const currentSession = week.sessions[currentSessionIndex]

  const handleSessionComplete = (score: number) => {
    setSessionScore(score)

    // Aller à la session suivante
    if (currentSessionIndex < week.sessions.length - 1) {
      setCurrentSessionIndex(currentSessionIndex + 1)
    } else {
      // Fin de la semaine
      onComplete(sessionScore + score)
    }
  }

  const handleWeekComplete = () => {
    onComplete(sessionScore)
  }

  return (
    <div className="session-view">
      <header className="session-view__header">
        <button className="session-view__back" onClick={onBack}>
          ← Retour
        </button>
        <h1 className="session-view__title">
          {week.badge.icon} {week.title}
        </h1>
        <span className="session-view__progress">
          Session {currentSessionIndex + 1} / {week.sessions.length}
        </span>
      </header>

      <main className="session-view__main">
        <ExerciseContainer
          words={currentSession.words.map((w: any) => w.word)}
          exerciseType={currentSession.type}
          onComplete={handleSessionComplete}
          onSkip={() => {
            if (currentSessionIndex < week.sessions.length - 1) {
              setCurrentSessionIndex(currentSessionIndex + 1)
            } else {
              handleWeekComplete()
            }
          }}
        />
      </main>
    </div>
  )
}

export default SessionView
