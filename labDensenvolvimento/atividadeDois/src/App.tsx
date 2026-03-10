import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAppDispatch, useAppSelector, selectFilteredHabits, selectCategories, selectFilterCategory, selectCompletedCount, selectTotalCount } from './store/hooks';
import { addHabit, editHabit, deleteHabit, toggleHabit, clearCompleted, setFilterCategory } from './store/habitsSlice';
import type { Habit } from './store/habitsSlice';
import './App.css';

const CATEGORY_COLORS: Record<string, string> = {
  'saúde': '#D6D578',
  'estudo': '#B1BF63',
  'lazer': '#9DAD42',
  'produtividade': '#258A60',
  'bem-estar': '#0A3740',
  'outro': '#94a3b8',
  'all': '#e2e8f0',
};

const CATEGORY_ICONS: Record<string, string> = {
  'saúde': '💪',
  'estudo': '📚',
  'lazer': '🎮',
  'produtividade': '⚡',
  'bem-estar': '🧘',
  'outro': '✨',
};

const ALL_CATEGORIES = ['saúde', 'estudo', 'lazer', 'produtividade', 'bem-estar', 'outro'];

function HabitForm({ onClose, editingHabit }: { onClose: () => void; editingHabit?: Habit }) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(editingHabit?.name || '');
  const [category, setCategory] = useState(editingHabit?.category || 'saúde');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Nome do hábito é obrigatório!');
      return;
    }
    if (editingHabit) {
      dispatch(editHabit({ id: editingHabit.id, name: name.trim(), category }));
    } else {
      dispatch(addHabit({ name: name.trim(), category }));
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingHabit ? '✏️ Editar Hábito' : '✨ Novo Hábito'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="form-group">
          <label>Nome do Hábito *</label>
          <input
            type="text"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setName(e.target.value); setError(''); }}
            placeholder="Ex: Beber 2L de água..."
            className={error ? 'input-error' : ''}
            autoFocus
            onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSubmit()}
          />
          {error && <span className="error-msg">{error}</span>}
        </div>
        <div className="form-group">
          <label>Categoria</label>
          <div className="category-picker">
            {ALL_CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-pill ${category === cat ? 'selected' : ''}`}
                style={{ '--cat-color': CATEGORY_COLORS[cat] } as React.CSSProperties}
                onClick={() => setCategory(cat)}
              >
                {CATEGORY_ICONS[cat]} {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit}>
            {editingHabit ? 'Salvar' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function HabitCard({ habit, onEdit }: { habit: Habit; onEdit: (h: Habit) => void }) {
  const dispatch = useAppDispatch();
  const color = CATEGORY_COLORS[habit.category] || '#94a3b8';
  const icon = CATEGORY_ICONS[habit.category] || '✨';

  return (
    <div className={`habit-card ${habit.completed ? 'completed' : ''}`} style={{ '--accent': color } as React.CSSProperties}>
      <div className="habit-left">
        <button
          className={`check-btn ${habit.completed ? 'checked' : ''}`}
          onClick={() => dispatch(toggleHabit(habit.id))}
          title={habit.completed ? 'Desmarcar' : 'Marcar como concluído'}
        >
          {habit.completed ? '✓' : ''}
        </button>
        <div className="habit-info">
          <span className="habit-name">{habit.name}</span>
          <span className="habit-category" style={{ color }}>
            {icon} {habit.category}
          </span>
        </div>
      </div>
      <div className="habit-actions">
        <button className="action-btn edit-btn" onClick={() => onEdit(habit)} title="Editar">✏️</button>
        <button className="action-btn delete-btn" onClick={() => dispatch(deleteHabit(habit.id))} title="Excluir">🗑️</button>
      </div>
    </div>
  );
}

function HabitTracker() {
  const dispatch = useAppDispatch();
  const habits = useAppSelector(selectFilteredHabits);
  const categories = useAppSelector(selectCategories);
  const filterCategory = useAppSelector(selectFilterCategory);
  const completedCount = useAppSelector(selectCompletedCount);
  const totalCount = useAppSelector(selectTotalCount);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);

  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingHabit(undefined);
  };

  return (
    <div className="app">
      <div className="bg-decoration">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
      <div className="container">
        <header className="header">
          <div className="header-left">
            <div className="logo">🌱</div>
            <div>
              <h1>Hábitos Diários</h1>
              <p className="subtitle">Construa a melhor versão de você</p>
            </div>
          </div>
          <button className="btn-add" onClick={() => setShowForm(true)}>
            <span>+</span> Novo Hábito
          </button>
        </header>

        <div className="progress-card">
          <div className="progress-info">
            <span className="progress-label">Progresso de hoje</span>
            <span className="progress-count">{completedCount}/{totalCount} concluídos</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-pct">{progress}%</span>
        </div>

        <div className="filters-section">
          <div className="filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
                style={{ '--cat-color': CATEGORY_COLORS[cat] || '#94a3b8' } as React.CSSProperties}
                onClick={() => dispatch(setFilterCategory(cat))}
              >
                {cat === 'all' ? '🔎 Todos' : `${CATEGORY_ICONS[cat] || '✨'} ${cat}`}
              </button>
            ))}
          </div>
          {completedCount > 0 && (
            <button className="btn-clear" onClick={() => dispatch(clearCompleted())}>
              🧹 Limpar concluídos ({completedCount})
            </button>
          )}
        </div>

        <div className="habits-list">
          {habits.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🌟</div>
              <p>Nenhum hábito encontrado</p>
              <span>Adicione um novo hábito para começar!</span>
            </div>
          ) : (
            habits.map(habit => (
              <HabitCard key={habit.id} habit={habit} onEdit={handleEdit} />
            ))
          )}
        </div>

        {habits.length > 0 && (
          <p className="footer-hint">
            💡 Clique no círculo para marcar um hábito como concluído
          </p>
        )}
      </div>
      {showForm && <HabitForm onClose={handleCloseForm} editingHabit={editingHabit} />}
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <HabitTracker />
    </Provider>
  );
}

export default App;