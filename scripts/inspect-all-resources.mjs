import {
  DIGITAL_BANKING_CORE_LESSONS,
  DIGITAL_BANKING_POSTERS
} from '../src/data/digitalBankingLessonsData.ts'
import { DIGITAL_BANKING_HABITS } from '../src/data/digitalBankingHabitsData.ts'
import { DIGITAL_BANKING_SCAMS } from '../src/data/digitalBankingScamsData.ts'
import { DIGITAL_BANKING_EMERGENCY_GUIDES } from '../src/data/digitalBankingEmergencyData.ts'
import { DIGITAL_BANKING_PROJECTS } from '../src/data/digitalBankingProjectsData.ts'

console.log('=== 1. ALL CORE LESSONS (17) ===')
DIGITAL_BANKING_CORE_LESSONS.forEach((l, idx) => {
  console.log(`Index ${idx}: [${l.id}] ${l.lessonNumber} | Tab: ${l.category}`)
  console.log(`  Title: ${l.hindiTitle}`)
  console.log(`  Images: ${l.infographicImages.join(', ')}`)
})

console.log('\n=== 2. ALL MASTER POSTERS (6) ===')
DIGITAL_BANKING_POSTERS.forEach((p, idx) => {
  console.log(`Poster Index ${idx}: [${p.id}] -> ${p.title} (${p.imagePath})`)
})

console.log('\n=== 3. ALL HABITS (11) ===')
DIGITAL_BANKING_HABITS.forEach((h, idx) => {
  console.log(`Habit Index ${idx}: [${h.id}] -> ${h.title} (${h.imagePath})`)
})

console.log('\n=== 4. ALL SCAMS (19) ===')
DIGITAL_BANKING_SCAMS.forEach((s, idx) => {
  console.log(`Scam Index ${idx}: [${s.id}] -> ${s.title} (${s.infographicImages.join(', ')})`)
})

console.log('\n=== 5. ALL EMERGENCY GUIDES (8) ===')
DIGITAL_BANKING_EMERGENCY_GUIDES.forEach((g, idx) => {
  console.log(`Emergency Guide Index ${idx}: [${g.id}] -> ${g.title} (${g.infographicImages.join(', ')})`)
})

console.log('\n=== 6. ALL PROJECTS (4) ===')
DIGITAL_BANKING_PROJECTS.forEach((p, idx) => {
  console.log(`Project Index ${idx}: [${p.id}] -> ${p.title}`)
})
