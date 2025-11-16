import React from 'react'
import { WEEKS_PROGRAM } from '@data/weeksProgram'
import '../styles/components/WeeksList.css'

interface WeeksListProps {
  onSelectWeek: (weekId: number) => void
  completedWeeks: number[]
  currentWeek: number
}

const WeeksList: React.FC<WeeksListProps> = ({
  onSelectWeek,
  completedWeeks,
  currentWeek,
}) => {
  return (
    <div className="weeks-list">
      <div className="weeks-list__header">
        <h2 className="weeks-list__title">📚 Tes semaines d'apprentissage</h2>
        <p className="weeks-list__description">
          Clique sur une semaine pour commencer!
        </p>
      </div>

      <div className="weeks-list__grid">
        {WEEKS_PROGRAM.map((week) => {
          const isCompleted = completedWeeks.includes(week.id)
          const isCurrent = week.id === currentWeek
          const isLocked = week.id > currentWeek + 1

          return (
            <button
              key={week.id}
              className={`week-card ${
                isCompleted ? 'week-card--completed' : ''
              } ${isCurrent ? 'week-card--current' : ''} ${
                isLocked ? 'week-card--locked' : ''
              }`}
              onClick={() => !isLocked && onSelectWeek(week.id)}
              disabled={isLocked}
            >
              {/* Badge de la semaine */}
              <div className="week-card__badge">
                {isCompleted && '✅'}
                {isCurrent && !isCompleted && '🎯'}
                {isLocked && '🔒'}
                {!isCompleted && !isCurrent && !isLocked && '🔓'}
              </div>

              {/* Contenu */}
              <div className="week-card__content">
                <div className="week-card__number">Semaine {week.id}</div>
                <h3 className="week-card__title">{week.title}</h3>
                <div className="week-card__icon">{week.badge.icon}</div>
                <p className="week-card__badge-name">{week.badge.name}</p>
              </div>

              {/* Sessions */}
              <div className="week-card__sessions">
                <div className="week-card__sessions-count">
                  {week.sessions.length} sessions
                </div>
              </div>

              {/* Status */}
              {isLocked && (
                <div className="week-card__lock-message">
                  Termine la semaine {week.id - 1} d'abord!
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Message motivant */}
      <div className="weeks-list__footer">
        <p className="weeks-list__motivation">
          🌟 Continue comme ça! Tu fais du super travail! 🌟
        </p>
      </div>
    </div>
  )
}

export default WeeksList
