import React, { useState } from 'react'
import { useAppStore } from '@stores/appStore'
import ProfileSelector from '@components/ProfileSelector'
import WeeksList from '@components/WeeksList'
import SessionView from '@components/SessionView'
import './styles/index.css'

type AppView = 'profile-selector' | 'weeks-list' | 'session' | 'completion'

interface CompletionState {
  weekId: number
  score: number
}

const App: React.FC = () => {
  const { currentProfile } = useAppStore()
  const [currentView, setCurrentView] = useState<AppView>('profile-selector')
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [completionState, setCompletionState] = useState<CompletionState | null>(
    null
  )

  // Gestion de la navigation
  const handleSelectWeek = (weekId: number) => {
    setSelectedWeek(weekId)
    setCurrentView('session')
  }

  const handleSessionComplete = (score: number) => {
    setCompletionState({
      weekId: selectedWeek || 0,
      score,
    })
    setCurrentView('completion')
  }

  const handleBackToWeeks = () => {
    setCurrentView('weeks-list')
    setSelectedWeek(null)
  }

  const handleReturnHome = () => {
    setCurrentView('weeks-list')
    setSelectedWeek(null)
    setCompletionState(null)
  }

  const handleLogout = () => {
    setCurrentView('profile-selector')
    setSelectedWeek(null)
    setCompletionState(null)
  }

  // Vue : Sélection de profil
  if (currentView === 'profile-selector') {
    return <ProfileSelector />
  }

  // Si pas de profil, afficher le sélecteur
  if (!currentProfile) {
    return <ProfileSelector />
  }

  return (
    <div className="app">
      {/* Header principal */}
      <header className="app__header">
        <div className="app__header-content">
          <button 
            className="app__logo" 
            onClick={() => setCurrentView('weeks-list')}
          >
            🎵 SyllaboKids
          </button>

          <div className="app__profile-info">
            <span className="app__profile-avatar">{currentProfile.avatar}</span>
            <span className="app__profile-name">{currentProfile.name}</span>
            <span className="app__profile-level">
              Niveau {currentProfile.level}
            </span>
          </div>

          <button 
            className="app__logout" 
            onClick={handleLogout}
          >
            👤 Changer de profil
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="app__main">
        {/* Vue : Liste des semaines */}
        {currentView === 'weeks-list' && (
          <WeeksList
            onSelectWeek={handleSelectWeek}
            completedWeeks={currentProfile.progress.completedWeeks}
            currentWeek={currentProfile.progress.currentWeek}
          />
        )}

        {/* Vue : Session d'exercice */}
        {currentView === 'session' && selectedWeek && (
          <SessionView
            weekId={selectedWeek}
            onComplete={handleSessionComplete}
            onBack={handleBackToWeeks}
          />
        )}

        {/* Vue : Completion screen */}
        {currentView === 'completion' && completionState && (
          <div className="completion-screen">
            <div className="completion-screen__content">
              <div className="completion-screen__celebration">
                <div className="celebration-emoji">🎉</div>
              </div>

              <h1 className="completion-screen__title">Félicitations! 🌟</h1>

              <p className="completion-screen__message">
                Tu as complété cette semaine avec un score de{' '}
                <strong>{completionState.score}%</strong>!
              </p>

              <div className="completion-screen__stats">
                <div className="stat-item">
                  <span className="stat-label">📈 Progression</span>
                  <span className="stat-value">
                    {Math.min(
                      100,
                      Math.round(
                        (currentProfile.progress.completedWeeks.length / 12) *
                          100
                      )
                    )}
                    %
                  </span>
                </div>

                <div className="stat-item">
                  <span className="stat-label">⭐ Score Total</span>
                  <span className="stat-value">
                    {currentProfile.totalScore}
                  </span>
                </div>

                <div className="stat-item">
                  <span className="stat-label">🏆 Niveau</span>
                  <span className="stat-value">{currentProfile.level}</span>
                </div>
              </div>

              <p className="completion-screen__motivation">
                Continue comme ça! Tu es formidable! 💪
              </p>

              <div className="completion-screen__actions">
                <button
                  className="btn btn-primary"
                  onClick={handleReturnHome}
                >
                  ➡️ Prochaine semaine
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleSelectWeek(completionState.weekId)}
                >
                  🔄 Rejouer cette semaine
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app__footer">
        <p>
          SyllaboKids v2.0 - Apprendre en jouant 🎨 | Semaines{' '}
          {currentProfile.progress.completedWeeks.length} / 12
        </p>
      </footer>
    </div>
  )
}

export default App