import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App Component', () => {
  beforeEach(() => {
    // Réinitialiser le store avant chaque test
    localStorage.clear()
  })

  it('should render ProfileSelector when no profile is selected', () => {
    render(<App />)
    
    // Chercher spécifiquement le titre h1 avec "SyllaboKids"
    const title = screen.getByRole('heading', { name: /🎵 SyllaboKids/i })
    expect(title).toBeInTheDocument()
  })

  it('should render the button to create a new profile', () => {
    render(<App />)
    
    // Vérifier que le bouton existe
    const button = screen.getByText(/Créer un nouveau profil/i)
    expect(button).toBeInTheDocument()
  })

  it('should render ProfileSelector with correct structure', () => {
    render(<App />)
    
    // Vérifier que les éléments clés existent
    const subtitle = screen.getByText(/Apprends les syllabes en t'amusant/i)
    const footer = screen.getByText(/SyllaboKids v2.0 - Apprendre en jouant/i)
    
    expect(subtitle).toBeInTheDocument()
    expect(footer).toBeInTheDocument()
  })
})