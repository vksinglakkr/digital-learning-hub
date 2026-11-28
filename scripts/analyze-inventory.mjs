import fs from 'fs'

const inv = JSON.parse(fs.readFileSync('scripts/inventory.json', 'utf8'))
console.log(`Total audited learning resource links: ${inv.length}\n`)

let mismatchCount = 0
let correctCount = 0

const mismatches = []

inv.forEach((item, idx) => {
  let status = 'Correct'
  let reason = ''

  if (item.isMicroLesson) {
    status = 'Correct'
  } else if (item.actual.includes('UNKNOWN_PROJECT')) {
    status = 'Incorrect'
    reason = 'Invalid Project ID (e.g. project-02 instead of project-autopay-management)'
  } else if (item.linkTitle.includes('बैलेंस जानने के 4 सरल तरीके') && item.actual.includes('डर कैसे भगाएं')) {
    status = 'Incorrect'
    reason = 'Mismatched topic: Balance overview mapped to Lesson 01 Fear Removal'
  } else if (item.linkTitle.includes('ATM') && item.actual.includes('डर कैसे भगाएं')) {
    status = 'Incorrect'
    reason = 'Mismatched topic: ATM topic mapped to Lesson 01 Fear Removal'
  } else if (item.targetTab === 'fear-removal' && !item.linkTitle.includes('डर') && item.actual.includes('डर कैसे भगाएं')) {
    status = 'Incorrect'
    reason = 'Unrelated topic mapped to Lesson 01 Fear Removal'
  } else if (item.targetTab === 'habits' && item.actual.includes('सातवीं आदत') && !item.targetRef && !item.linkTitle.includes('लॉक') && !item.linkTitle.includes('Lock')) {
    status = 'Incorrect'
    reason = 'Habit missing targetId, defaulted to Habit 07'
  } else if (item.targetTab === 'banking-savings' && item.actual.includes('बैंक के प्रकार') && !item.linkTitle.includes('प्रकार')) {
    status = 'Incorrect'
    reason = 'Topic mapped to Lesson 02 Types of Banks'
  }

  if (status === 'Incorrect') {
    mismatchCount++
    mismatches.push({ index: idx + 1, ...item, reason })
  } else {
    correctCount++
  }
})

console.log(`Audited: ${inv.length}`)
console.log(`Initial Match Status: Correct = ${correctCount}, Potential Mismatches = ${mismatchCount}\n`)

console.log('=== DETAILED MISMATCH LIST ===')
mismatches.forEach(m => {
  console.log(`\n#${m.index} [${m.source}]`)
  console.log(`  Link: "${m.linkTitle}"`)
  console.log(`  Target: tab=${m.targetTab}, ref=${m.targetRef}`)
  console.log(`  Actual Opened: ${m.actual}`)
  console.log(`  Infographic Preview: ${m.infographicPreview || 'N/A'}`)
  console.log(`  Reason: ${m.reason}`)
})
