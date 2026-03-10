import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector)

// Selectors
export const selectAllHabits = (state: RootState) => state.habits.habits
export const selectFilterCategory = (state: RootState) => state.habits.filterCategory
export const selectFilteredHabits = (state: RootState) => {
  const { habits, filterCategory } = state.habits
  if (filterCategory === 'all') return habits
  return habits.filter(h => h.category === filterCategory)
}
export const selectCategories = (state: RootState) => {
  const cats = state.habits.habits.map(h => h.category)
  return ['all', ...Array.from(new Set(cats))]
}
export const selectCompletedCount = (state: RootState) =>
  state.habits.habits.filter(h => h.completed).length
export const selectTotalCount = (state: RootState) => state.habits.habits.length