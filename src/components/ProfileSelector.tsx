import React, { useState } from 'react'
import { useAppStore } from '@stores/appStore'
import '../styles/components/ProfileSelector.css'

const AVATARS = ['👦', '👧', '🧒', '👨‍🦱', '👩‍🦱', '🧑‍🦲', '👱‍♀️', '👱‍♂️']

const ProfileSelector: React.FC = () => {
  const { profiles, currentProfile, createProfile, setCurrentProfile } =
    useAppStore()

  const [showNewProfile, setShowNewProfile] = useState(false)
  const [newName, setNewName] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0])

  const handleCreateProfile = () => {
    if (newName.trim()) {
      createProfile(newName, selectedAvatar)
      setNewName('')
      setShowNewProfile(false)
    }
  }

  const handleSelectProfile = (profile: any) => {
    setCurrentProfile(profile)
  }

  if (currentProfile) {
    return null // Affichage dans l'app principale
  }

  return (
    <div className="profile-selector">
      <div className="profile-selector__header">
        <div className="profile-selector__title-wrapper">
          <h1 className="profile-selector__title">🎵 SyllaboKids</h1>
          <p className="profile-selector__subtitle">
            Apprends les syllabes en t'amusant!
          </p>
        </div>
      </div>

      <div className="profile-selector__content">
        {/* Profils existants */}
        {profiles.length > 0 && (
          <section className="profile-selector__existing">
            <h2 className="profile-selector__section-title">
              👶 Qui es-tu?
            </h2>
            <div className="profile-selector__grid">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  className="profile-card"
                  onClick={() => handleSelectProfile(profile)}
                >
                  <div className="profile-card__avatar">{profile.avatar}</div>
                  <div className="profile-card__name">{profile.name}</div>
                  <div className="profile-card__level">
                    Niveau {profile.level}
                  </div>
                  <div className="profile-card__stars">⭐ {profile.totalScore}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Créer nouveau profil */}
        {!showNewProfile ? (
          <button
            className="btn btn-new-profile"
            onClick={() => setShowNewProfile(true)}
          >
            ➕ Créer un nouveau profil
          </button>
        ) : (
          <section className="profile-selector__new">
            <h2 className="profile-selector__section-title">✨ Nouveau profil</h2>

            {/* Choix avatar */}
            <div className="profile-selector__avatars">
              <label className="profile-selector__label">
                Choisis ton avatar:
              </label>
              <div className="avatar-grid">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    className={`avatar-btn ${
                      selectedAvatar === avatar ? 'avatar-btn--selected' : ''
                    }`}
                    onClick={() => setSelectedAvatar(avatar)}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            {/* Entrée nom */}
            <div className="profile-selector__input-group">
              <label htmlFor="profile-name" className="profile-selector__label">
                Quel est ton nom?
              </label>
              <input
                id="profile-name"
                type="text"
                className="profile-selector__input"
                placeholder="Écris ton nom..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateProfile()
                  }
                }}
                maxLength={20}
              />
            </div>

            {/* Actions */}
            <div className="profile-selector__actions">
              <button
                className="btn btn-primary"
                onClick={handleCreateProfile}
                disabled={!newName.trim()}
              >
                ✅ Créer mon profil
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowNewProfile(false)
                  setNewName('')
                  setSelectedAvatar(AVATARS[0])
                }}
              >
                ❌ Annuler
              </button>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="profile-selector__footer">
        <p>SyllaboKids v2.0 - Apprendre en jouant 🎨</p>
      </footer>
    </div>
  )
}

export default ProfileSelector
