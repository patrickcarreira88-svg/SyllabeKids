// Types pour SyllaboKids
// Auto-generated structure

export type ExerciseType = 'syllable_count' | 'first_syllable' | 'build_word' | 'fusion' | 'mixed'

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
