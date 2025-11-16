import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Profile {
  id: string
  name: string
  avatar: string
  level: number
  totalScore: number
  progress: {
    completedWeeks: number[]
    currentWeek: number
  }
}

export interface AppState {
  profiles: Profile[]
  currentProfile: Profile | null
  
  // Actions
  createProfile: (name: string, avatar: string) => void
  setCurrentProfile: (profile: Profile) => void
  updateProfileProgress: (profileId: string, weekId: number, score: number) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profiles: [],
      currentProfile: null,

      createProfile: (name, avatar) => {
        set((state) => {
          const newProfile: Profile = {
            id: `profile_${Date.now()}`,
            name,
            avatar,
            level: 1,
            totalScore: 0,
            progress: {
              completedWeeks: [],
              currentWeek: 1,
            },
          }
          return {
            profiles: [...state.profiles, newProfile],
            currentProfile: newProfile,
          }
        })
      },

      setCurrentProfile: (profile) => {
        set({ currentProfile: profile })
      },

      updateProfileProgress: (profileId, weekId, score) => {
        set((state) => {
          const updatedProfiles = state.profiles.map((p) => {
            if (p.id === profileId) {
              return {
                ...p,
                totalScore: p.totalScore + score,
                progress: {
                  ...p.progress,
                  completedWeeks: Array.from(
                    new Set([...p.progress.completedWeeks, weekId])
                  ),
                },
              }
            }
            return p
          })

          const currentProfile = state.currentProfile?.id === profileId
            ? updatedProfiles.find((p) => p.id === profileId) || null
            : state.currentProfile

          return {
            profiles: updatedProfiles,
            currentProfile,
          }
        })
      },
    }),
    {
      name: 'syllabokids-state',
    }
  )
)
