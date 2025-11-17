import React, { useState } from 'react'
import './styles/index.css'

interface Word {
  word: string
  syllables: string[]
  emoji: string
}

interface Profile {
  id: number
  name: string
  avatar: string
  level: number
}

const App: React.FC = () => {
  const [screen, setScreen] = useState<'profiles' | 'newProfile' | 'weeks' | 'exercise' | 'quiz'>('profiles')
  const [profileName, setProfileName] = useState('')
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null)
  const [currentWordIdx, setCurrentWordIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [selectedSyllables, setSelectedSyllables] = useState<string[]>([])  // ← NOUVEAU

  const availableProfiles: Profile[] = [
    { id: 1, name: 'Alice', avatar: '👧', level: 1 },
    { id: 2, name: 'Bob', avatar: '👦', level: 2 },
    { id: 3, name: 'Charlie', avatar: '🧒', level: 1 },
    { id: 4, name: 'Diana', avatar: '👩‍🦰', level: 3 },
  ]

  const weeks = [
    { id: 1, title: 'Les Animaux', icon: '🐻', color: '#FF6B6B' },
    { id: 2, title: 'Les Couleurs', icon: '🌈', color: '#4ECDC4' },
    { id: 3, title: 'Les Fruits', icon: '🍎', color: '#FFE66D' },
    { id: 4, title: 'Les Légumes', icon: '🥕', color: '#95E1D3' },
  ]

  const wordsDatabase: { [key: number]: Word[] } = {
    1: [
      { word: 'chat', syllables: ['chat'], emoji: '🐱' },
      { word: 'chien', syllables: ['chien'], emoji: '🐶' },
      { word: 'oiseau', syllables: ['oi', 'seau'], emoji: '🐦' },
      { word: 'papillon', syllables: ['pa', 'pil', 'lon'], emoji: '🦋' },
    ],
    2: [
      { word: 'rouge', syllables: ['rouge'], emoji: '🔴' },
      { word: 'bleu', syllables: ['bleu'], emoji: '🔵' },
      { word: 'jaune', syllables: ['jaune'], emoji: '🟡' },
      { word: 'violet', syllables: ['vi', 'o', 'let'], emoji: '🟣' },
    ],
    3: [
      { word: 'pomme', syllables: ['pom', 'me'], emoji: '🍎' },
      { word: 'banane', syllables: ['ba', 'na', 'ne'], emoji: '🍌' },
      { word: 'fraise', syllables: ['frai', 'se'], emoji: '🍓' },
      { word: 'cerise', syllables: ['ce', 'ri', 'se'], emoji: '🍒' },
    ],
    4: [
      { word: 'carotte', syllables: ['ca', 'rot', 'te'], emoji: '🥕' },
      { word: 'tomate', syllables: ['to', 'ma', 'te'], emoji: '🍅' },
      { word: 'concombre', syllables: ['con', 'com', 'bre'], emoji: '🥒' },
      { word: 'épinard', syllables: ['é', 'pi', 'nard'], emoji: '🥬' },
    ],
  }

  const exercises: { [key: number]: string[] } = {
    1: ['Compter les syllabes', 'Première syllabe', 'Construire le mot'],
    2: ['Compter les syllabes', 'Première syllabe', 'Construire le mot'],
    3: ['Compter les syllabes', 'Première syllabe', 'Construire le mot'],
    4: ['Compter les syllabes', 'Première syllabe', 'Construire le mot'],
  }

  const handleStartQuiz = (exerciseIdx: number) => {
    setSelectedExercise(exerciseIdx)
    setCurrentWordIdx(0)
    setScore(0)
    setSelectedAnswer(null)
    setSelectedSyllables([])  // ← RESET
    setScreen('quiz')
  }

  const handleAnswer = (answer: string) => {
    const words = wordsDatabase[selectedWeek!] || []
    const currentWord = words[currentWordIdx]
    let isCorrect = false

    if (selectedExercise === 0) {
      // Exercice 1 : Compter les syllabes
      isCorrect = parseInt(answer) === currentWord.syllables.length
    } else if (selectedExercise === 1) {
      // Exercice 2 : Première syllabe
      isCorrect = answer === currentWord.syllables[0]
    } else if (selectedExercise === 2) {
      // Exercice 3 : Construire le mot (cliquer les syllabes dans l'ordre)
      const newSyllables = [...selectedSyllables, answer]
      setSelectedSyllables(newSyllables)

      // Vérifier si c'est la bonne syllabe
      const expectedSyllable = currentWord.syllables[newSyllables.length - 1]
      isCorrect = answer === expectedSyllable

      // Si toutes les syllabes sont cliquées correctement
      if (newSyllables.length === currentWord.syllables.length && isCorrect) {
        setScore(score + 1)
        setSelectedAnswer('COMPLETE')  // Flag pour afficher le succès
        setTimeout(() => {
          if (currentWordIdx < words.length - 1) {
            setCurrentWordIdx(currentWordIdx + 1)
            setSelectedSyllables([])
            setSelectedAnswer(null)
          } else {
            setTimeout(() => setScreen('exercise'), 500)
          }
        }, 1500)
        return  // Important : exit ici !
      }
      return  // Exit sans décrémenter
    }

    if (isCorrect && selectedExercise !== 2) {
      setScore(score + 1)
    }

    setSelectedAnswer(answer)

    if (selectedExercise !== 2) {
      setTimeout(() => {
        if (currentWordIdx < words.length - 1) {
          setCurrentWordIdx(currentWordIdx + 1)
          setSelectedAnswer(null)
        } else {
          setTimeout(() => setScreen('exercise'), 500)
        }
      }, 1500)
    }
  }

  // ========== ÉCRAN 1 : GALERIE DE PROFILS ==========
  if (screen === 'profiles') {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          maxWidth: '800px',
          width: '100%',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>🎵</h1>
          <h2 style={{ color: '#333', marginBottom: '0.5rem' }}>SyllaboKids</h2>
          <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1rem', minHeight: '16px' }}>
            Sélectionnez un profil ou créez-en un nouveau !
          </p>

          {/* Grille de profils */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {availableProfiles.map((profile) => (
              <button
                key={profile.id}
                className="profile-card"
                onClick={() => {
                  setProfileName(profile.name)
                  setScreen('weeks')
                }}
                style={{
                  background: '#f0f0f0',
                  border: '2px solid #667eea',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  textAlign: 'center'
                }}
              >
                <img
                  src={`data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><text x="5" y="50" font-size="50">${profile.avatar}</text></svg>`}
                  alt={profile.name}
                  style={{ width: '60px', height: '60px', display: 'block', margin: '0 auto 0.5rem' }}
                />
                <p style={{ margin: 0, fontSize: '1rem', color: '#333', fontWeight: 'bold', minHeight: '16px' }}>
                  {profile.name}
                </p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', color: '#666', minHeight: '16px' }}>
                  Niveau {profile.level}
                </p>
              </button>
            ))}
          </div>

          {/* Créer un nouveau profil */}
          <button
            onClick={() => setScreen('newProfile')}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.1rem',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ➕ Créer un nouveau profil
          </button>
        </div>
      </div>
    )
  }

  // ========== ÉCRAN 2 : CRÉER PROFIL ==========
  if (screen === 'newProfile') {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>🎵</h1>
          <h2 style={{ color: '#333', marginBottom: '0.5rem' }}>Nouveau Profil</h2>

          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && profileName.trim() && setScreen('weeks')}
              placeholder="Écris ton nom..."
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '2px solid #667eea',
                borderRadius: '0.5rem',
                boxSizing: 'border-box',
                minHeight: '40px'
              }}
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button
              onClick={() => setScreen('profiles')}
              style={{
                padding: '1rem',
                fontSize: '1rem',
                background: '#f0f0f0',
                color: '#333',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ← Retour
            </button>
            <button
              onClick={() => profileName.trim() && setScreen('weeks')}
              style={{
                padding: '1rem',
                fontSize: '1rem',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ✨ Commencer
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ========== ÉCRAN 3 : SEMAINES ==========
  if (screen === 'weeks') {
    return (
      <div style={{
        background: 'linear-gradient(to bottom, #667eea, #764ba2)',
        minHeight: '100vh',
        padding: '2rem 1rem'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            color: 'white'
          }}>
            <button
              onClick={() => setScreen('profiles')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              ← Retour
            </button>
            <h1>🎵 SyllaboKids</h1>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', minHeight: '16px' }}>👤 {profileName}</div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {weeks.map((week) => (
              <button
                key={week.id}
                className="week-item"
                onClick={() => {
                  setSelectedWeek(week.id)
                  setScreen('exercise')
                }}
                style={{
                  background: week.color,
                  border: 'none',
                  borderRadius: '1rem',
                  padding: '2rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'transform 0.3s'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{week.icon}</div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'white', fontSize: '1.2rem', minHeight: '18px' }}>
                  Semaine {week.id}
                </h3>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)', fontSize: '1rem', minHeight: '16px' }}>
                  {week.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ========== ÉCRAN 4 : EXERCICES ==========
  if (screen === 'exercise' && selectedWeek) {
    const week = weeks.find(w => w.id === selectedWeek)
    const weekExercises = exercises[selectedWeek] || []

    return (
      <div style={{
        background: '#f5f5f5',
        minHeight: '100vh',
        padding: '2rem 1rem'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            background: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <button
              onClick={() => setScreen('weeks')}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              ← Retour
            </button>
            <h1 style={{ margin: 0, flex: 1, textAlign: 'center', fontSize: '1.5rem', minHeight: '20px' }}>
              {week?.icon} Semaine {selectedWeek}
            </h1>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', minHeight: '16px' }}>👤 {profileName}</div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {weekExercises.map((exercise, idx) => (
              <button
                key={idx}
                className="exercise-item"
                onClick={() => handleStartQuiz(idx)}
                style={{
                  background: 'white',
                  border: '2px solid #667eea',
                  borderRadius: '1rem',
                  padding: '2rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                  {idx === 0 ? '🔢' : idx === 1 ? '📍' : '🧩'}
                </div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', minHeight: '16px' }}>
                  Exercice {idx + 1}
                </h3>
                <p style={{ margin: 0, opacity: 0.7, color: '#666', fontSize: '0.95rem', minHeight: '16px' }}>
                  {exercise}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ========== ÉCRAN 5 : QUIZ ==========
  if (screen === 'quiz' && selectedWeek && selectedExercise !== null) {
    const words = wordsDatabase[selectedWeek] || []
    const currentWord = words[currentWordIdx]

    if (!currentWord) return null

    return (
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '1rem', color: '#666', fontSize: '1rem', minHeight: '16px' }}>
            Mot {currentWordIdx + 1} / {words.length}
          </div>

          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            {currentWord.emoji}
          </div>

          <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0', color: '#333', minHeight: '28px' }}>
            {currentWord.word}
          </h2>

          <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1rem', minHeight: '16px' }}>
            {selectedExercise === 0
              ? 'Combien de syllabes ?'
              : selectedExercise === 1
              ? 'Quelle est la première syllabe ?'
              : 'Construis le mot'}
          </p>

          {/* Compteur pour exercice 3 */}
          {selectedExercise === 2 && (
            <div style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#667eea', fontWeight: 'bold' }}>
              Syllabes cliquées: {selectedSyllables.length} / {currentWord.syllables.length}
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '1rem'
          }}>
            {selectedExercise === 0 ? (
              [1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => !selectedAnswer && handleAnswer(num.toString())}
                  style={{
                    padding: '1rem',
                    fontSize: '1.2rem',
                    background: selectedAnswer === num.toString() ? '#FFE66D' : '#f0f0f0',
                    border: '2px solid #667eea',
                    borderRadius: '0.5rem',
                    cursor: selectedAnswer ? 'default' : 'pointer',
                    fontWeight: 'bold',
                    minHeight: '40px'
                  }}
                >
                  {num}
                </button>
              ))
            ) : selectedExercise === 1 ? (
              currentWord.syllables.map((syl, idx) => (
                <button
                  key={idx}
                  onClick={() => !selectedAnswer && handleAnswer(syl)}
                  style={{
                    padding: '1rem',
                    fontSize: '1rem',
                    background: selectedAnswer === syl ? '#95E1D3' : '#f0f0f0',
                    border: '2px solid #667eea',
                    borderRadius: '0.5rem',
                    cursor: selectedAnswer ? 'default' : 'pointer',
                    fontWeight: 'bold',
                    minHeight: '40px'
                  }}
                >
                  {syl}
                </button>
              ))
            ) : selectedExercise === 2 ? (
              currentWord.syllables.map((syl, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (!selectedAnswer || selectedAnswer === 'COMPLETE') {
                      handleAnswer(syl)
                    }
                  }}
                  disabled={selectedSyllables.includes(syl) && idx < selectedSyllables.length}
                  style={{
                    padding: '1rem',
                    fontSize: '1rem',
                    background: selectedSyllables.includes(syl)
                      ? '#95E1D3'  // Vert si déjà cliqué
                      : '#f0f0f0',
                    border: selectedSyllables.length === idx
                      ? '3px solid #FFE66D'  // Border jaune pour la prochaine syllabe attendue
                      : '2px solid #667eea',
                    borderRadius: '0.5rem',
                    cursor: selectedSyllables.includes(syl) ? 'default' : 'pointer',
                    fontWeight: 'bold',
                    minHeight: '40px',
                    opacity: selectedSyllables.includes(syl) && idx < selectedSyllables.length ? 0.5 : 1
                  }}
                >
                  {syl}
                </button>
              ))
            ) : null}
          </div>

          {selectedAnswer && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              borderRadius: '0.5rem',
              background: '#f0f0f0',
              color: '#333',
              fontSize: '1rem',
              minHeight: '20px'
            }}>
              {selectedExercise === 0 && parseInt(selectedAnswer) === currentWord.syllables.length && '✅ Correct !'}
              {selectedExercise === 0 && parseInt(selectedAnswer) !== currentWord.syllables.length && `❌ Non, il y a ${currentWord.syllables.length} syllabe(s)`}
              {selectedExercise === 1 && selectedAnswer === currentWord.syllables[0] && '✅ Correct !'}
              {selectedExercise === 1 && selectedAnswer !== currentWord.syllables[0] && `❌ Non, c'est "${currentWord.syllables[0]}"`}
              {selectedExercise === 2 && selectedAnswer === 'COMPLETE' && '✅ Mot complété avec succès !'}
              {selectedExercise === 2 && selectedAnswer !== 'COMPLETE' && selectedSyllables.length > 0 && selectedSyllables.length < currentWord.syllables.length && (
                <div>
                  ✅ Bonne syllabe ! Syllabe suivante: "{currentWord.syllables[selectedSyllables.length]}"
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: '1.5rem', color: '#667eea', fontWeight: 'bold', fontSize: '1.1rem', minHeight: '18px' }}>
            Score: {score} / {words.length}
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default App
