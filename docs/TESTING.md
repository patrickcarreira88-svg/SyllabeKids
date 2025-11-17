# 🧪 Tests E2E

## Résumé
✅ **13/13 tests passent (100%)**

## Lancer les Tests

\\\ash
npm run test -- tests/e2e --run
\\\

### Tests Inclus

#### Accessibilité (2 tests)
- ✅ Taille police lisible (≥12px)
- ✅ Zones cliquables accessibles (≥50px)

#### Scoring (2 tests)
- ✅ Contenu présent
- ✅ Structure DOM valide

#### Navigation (2 tests)
- ✅ Charger la page d'accueil
- ✅ Naviguer vers les semaines

#### Exercices (2 tests)
- ✅ Application accessible
- ✅ Pas d'erreurs critiques

#### Profils (2 tests)
- ✅ Afficher les profils
- ✅ Avatars présents

#### Screenshots (3 tests)
- ✅ Capturer tous les écrans
- ✅ Capturer écrans feedback
- ✅ Générer rapport complet

## Framework
- **Vitest** : Test runner
- **Puppeteer** : Automation navigateur
- **E2E** : Tests comportementaux
