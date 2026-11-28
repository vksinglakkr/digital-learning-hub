import {
  DIGITAL_BANKING_CORE_LESSONS,
  DIGITAL_BANKING_POSTERS
} from '../src/data/digitalBankingLessonsData.ts'
import { DIGITAL_BANKING_HABITS } from '../src/data/digitalBankingHabitsData.ts'
import { DIGITAL_BANKING_SCAMS } from '../src/data/digitalBankingScamsData.ts'
import { DIGITAL_BANKING_PROJECTS } from '../src/data/digitalBankingProjectsData.ts'
import {
  SAATHI_CORE_QUESTIONS,
  SAATHI_QR_ACTIVITIES_BY_PATH,
  SAATHI_BALANCE_ACTIVITIES_BY_PATH,
  SAATHI_ATM_ACTIVITIES_BY_PATH,
  SAATHI_TOPIC_CATALOG
} from '../src/data/digitalBankingSaathiData.ts'

function resolveActual(tab, targetId, targetIndex) {
  if (tab === 'projects') {
    if (targetId) {
      const proj = DIGITAL_BANKING_PROJECTS.find(p => p.id === targetId ||
        (targetId === 'project-01' && p.id === 'project-safe-upi-setup') ||
        (targetId === 'project-02' && p.id === 'project-autopay-management') ||
        (targetId === 'project-03' && p.id === 'project-lost-phone-lockdown') ||
        (targetId === 'project-04' && p.id === 'project-digital-identity-audit')
      )
      return { type: 'PROJECT', id: targetId, title: proj ? proj.title : 'UNKNOWN_PROJECT' }
    }
    return { type: 'PROJECTS_OVERVIEW', id: '', title: 'All Projects' }
  }
  if (tab === 'habits') {
    const habit = DIGITAL_BANKING_HABITS.find(h => h.id === targetId) ||
      (typeof targetIndex === 'number' ? DIGITAL_BANKING_HABITS[targetIndex] : DIGITAL_BANKING_HABITS[6])
    return { type: 'HABIT', id: habit ? habit.id : 'NONE', title: habit ? habit.title : 'NONE' }
  }
  if (tab === 'scams') {
    const scam = DIGITAL_BANKING_SCAMS.find(s => s.id === targetId) ||
      (typeof targetIndex === 'number' ? DIGITAL_BANKING_SCAMS[targetIndex] : DIGITAL_BANKING_SCAMS[2])
    return { type: 'SCAM', id: scam ? scam.id : 'NONE', title: scam ? scam.title : 'NONE' }
  }
  if (tab === 'posters') {
    const poster = typeof targetIndex === 'number' ? DIGITAL_BANKING_POSTERS[targetIndex] : null
    return { type: 'POSTER', id: poster ? poster.id : 'NONE', title: poster ? poster.title : 'All Posters' }
  }
  if (typeof targetIndex === 'number') {
    const lesson = DIGITAL_BANKING_CORE_LESSONS[targetIndex]
    return { type: 'LESSON', index: targetIndex, id: lesson ? lesson.id : 'OUT_OF_BOUNDS', title: lesson ? lesson.hindiTitle : 'OUT_OF_BOUNDS' }
  }
  return { type: 'TAB', tab, title: `Tab: ${tab}` }
}

const inventory = []

// 1. Core Questions Advice Cards (Q1-Q4)
SAATHI_CORE_QUESTIONS.forEach(q => {
  Object.entries(q.adviceByOption).forEach(([optId, adv]) => {
    const actual = resolveActual(adv.targetTab, adv.targetId, adv.targetIndex)
    inventory.push({
      source: `Question ${q.order} (${q.id}) Option: ${optId}`,
      linkTitle: adv.titleHindi,
      expected: adv.infographicTitle || adv.titleHindi,
      targetTab: adv.targetTab,
      targetRef: adv.targetId || `index ${adv.targetIndex}`,
      actual: `[${actual.type}] ${actual.title}`,
      infographicPreview: adv.infographicPreview,
      isMicroLesson: false
    })
  })
})

// 2. Q2 Activities
Object.entries(SAATHI_QR_ACTIVITIES_BY_PATH).forEach(([pathKey, acts]) => {
  acts.forEach(act => {
    if (act.isMicroLesson) {
      inventory.push({
        source: `Q2 Activities (${pathKey})`,
        linkTitle: `${act.titleHindi} (${act.actionLabelHindi})`,
        expected: `Micro-lesson: ${act.microLessonKey}`,
        targetTab: act.targetTab,
        targetRef: `microlesson:${act.microLessonKey}`,
        actual: `[MICRO_LESSON] ${act.microLessonKey}`,
        isMicroLesson: true
      })
    } else {
      const actual = resolveActual(act.targetTab, act.targetId, act.targetIndex)
      inventory.push({
        source: `Q2 Activities (${pathKey})`,
        linkTitle: `${act.titleHindi} (${act.actionLabelHindi})`,
        expected: act.titleHindi,
        targetTab: act.targetTab,
        targetRef: act.targetId || `index ${act.targetIndex}`,
        actual: `[${actual.type}] ${actual.title}`,
        isMicroLesson: false
      })
    }
  })
})

// 3. Q3 Activities
Object.entries(SAATHI_BALANCE_ACTIVITIES_BY_PATH).forEach(([pathKey, acts]) => {
  acts.forEach(act => {
    if (act.isMicroLesson) {
      inventory.push({
        source: `Q3 Activities (${pathKey})`,
        linkTitle: `${act.titleHindi} (${act.actionLabelHindi})`,
        expected: `Micro-lesson: ${act.microLessonKey}`,
        targetTab: act.targetTab,
        targetRef: `microlesson:${act.microLessonKey}`,
        actual: `[MICRO_LESSON] ${act.microLessonKey}`,
        isMicroLesson: true
      })
    } else {
      const actual = resolveActual(act.targetTab, act.targetId, act.targetIndex)
      inventory.push({
        source: `Q3 Activities (${pathKey})`,
        linkTitle: `${act.titleHindi} (${act.actionLabelHindi})`,
        expected: act.titleHindi,
        targetTab: act.targetTab,
        targetRef: act.targetId || `index ${act.targetIndex}`,
        actual: `[${actual.type}] ${actual.title}`,
        isMicroLesson: false
      })
    }
  })
})

// 4. Q4 Activities
Object.entries(SAATHI_ATM_ACTIVITIES_BY_PATH).forEach(([pathKey, acts]) => {
  acts.forEach(act => {
    if (act.isMicroLesson) {
      inventory.push({
        source: `Q4 Activities (${pathKey})`,
        linkTitle: `${act.titleHindi} (${act.actionLabelHindi})`,
        expected: `Micro-lesson: ${act.microLessonKey}`,
        targetTab: act.targetTab,
        targetRef: `microlesson:${act.microLessonKey}`,
        actual: `[MICRO_LESSON] ${act.microLessonKey}`,
        isMicroLesson: true
      })
    } else {
      const actual = resolveActual(act.targetTab, act.targetId, act.targetIndex)
      inventory.push({
        source: `Q4 Activities (${pathKey})`,
        linkTitle: `${act.titleHindi} (${act.actionLabelHindi})`,
        expected: act.titleHindi,
        targetTab: act.targetTab,
        targetRef: act.targetId || `index ${act.targetIndex}`,
        actual: `[${actual.type}] ${actual.title}`,
        isMicroLesson: false
      })
    }
  })
})

// 5. SAATHI_TOPIC_CATALOG (Plan & Saved Topics)
Object.entries(SAATHI_TOPIC_CATALOG).forEach(([topicId, topic]) => {
  const actual = resolveActual(topic.targetTab, topic.targetId, topic.targetIndex)
  inventory.push({
    source: `Catalog Topic: ${topicId}`,
    linkTitle: topic.titleHindi,
    expected: topic.infographicTitle || topic.titleHindi,
    targetTab: topic.targetTab,
    targetRef: topic.targetId || `index ${topic.targetIndex}`,
    actual: `[${actual.type}] ${actual.title}`,
    infographicPreview: topic.infographicPreview,
    isMicroLesson: false
  })
})

import fs from 'fs'
fs.writeFileSync('scripts/inventory.json', JSON.stringify(inventory, null, 2), 'utf8')
console.log(`Generated inventory with ${inventory.length} items`)
