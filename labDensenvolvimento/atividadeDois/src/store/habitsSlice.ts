import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Habit {
  id: string
  name: string
  category: string
  completed: boolean
  createdAt: string
}

export type CategoryFilter = 'all' | string

interface HabitsState {
  habits: Habit[]
  filterCategory: CategoryFilter
}

const initialState: HabitsState = {
  habits: [
    { id: '1', name: 'Beber 2L de água', category: 'saúde', completed: false, createdAt: new Date().toISOString() },
    { id: '2', name: 'Caminhar 30 minutos', category: 'saúde', completed: true, createdAt: new Date().toISOString() },
    { id: '3', name: 'Estudar 1 hora', category: 'estudo', completed: false, createdAt: new Date().toISOString() },
    { id: '4', name: 'Ler 20 páginas', category: 'lazer', completed: false, createdAt: new Date().toISOString() },
  ],
  filterCategory: 'all',
}

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    addHabit: (state, action: PayloadAction<{ name: string; category: string }>) => {
      const newHabit: Habit = {
        id: Math.random().toString(36).substr(2, 9),
        name: action.payload.name,
        category: action.payload.category || 'outro',
        completed: false,
        createdAt: new Date().toISOString(),
      }
      state.habits.push(newHabit)
    },
    editHabit: (state, action: PayloadAction<{ id: string; name: string; category: string }>) => {
      const habit = state.habits.find(h => h.id === action.payload.id)
      if (habit) {
        habit.name = action.payload.name
        habit.category = action.payload.category
      }
    },
    deleteHabit: (state, action: PayloadAction<string>) => {
      state.habits = state.habits.filter(h => h.id !== action.payload)
    },
    toggleHabit: (state, action: PayloadAction<string>) => {
      const habit = state.habits.find(h => h.id === action.payload)
      if (habit) {
        habit.completed = !habit.completed
      }
    },
    clearCompleted: (state) => {
      state.habits = state.habits.filter(h => !h.completed)
    },
    setFilterCategory: (state, action: PayloadAction<CategoryFilter>) => {
      state.filterCategory = action.payload
    },
  },
})

export const {
  addHabit,
  editHabit,
  deleteHabit,
  toggleHabit,
  clearCompleted,
  setFilterCategory,
} = habitsSlice.actions

export default habitsSlice.reducer