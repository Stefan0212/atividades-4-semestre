import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./redux/store";
import { addUser, incrementAge, removeUser } from "./redux/slices/userSlice";
import type { User } from "./redux/slices/userSlice";
import { useState } from "react";
import "./App.css";

export default function App() {
  const users = useSelector((state: RootState) => state.userObject.users);
  const [id, setId] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [flash, setFlash] = useState<number | null>(null);
  const dispatch: AppDispatch = useDispatch();

  const handleSave = () => {
    if (!name || !age) return;
    const user: User = { id, name, age: parseInt(age) };
    dispatch(addUser(user));
    setId((prev) => prev + 1);
    setName("");
    setAge("");
  };

  const handleAge = (userId: number) => {
    dispatch(incrementAge(userId));
    setFlash(userId);
    setTimeout(() => setFlash(null), 400);
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>, userId: number) => {
    e.preventDefault();
    dispatch(removeUser(userId));
  };

  return (
    <div className="root-bg">
      <div className="noise" />
      <div className="container">

        {/* Header */}
        <header className="header">
          <div className="header-tag">SISTEMA</div>
          <h1 className="title">
            CADASTRO<br />
            <span className="title-accent">USUÁRIOS</span>
          </h1>
          <div className="header-line" />
          <p className="subtitle">Redux · React · TypeScript</p>
        </header>

        {/* Form */}
        <section className="form-section">
          <div className="form-label-row">
            <span className="section-tag">// ENTRADA</span>
            <span className="counter">{String(users.length).padStart(3, "0")} registros</span>
          </div>

          <div className="form-grid">
            <div className="field">
              <label className="field-label">NOME</label>
              <input
                className="field-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: João Silva"
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
            </div>
            <div className="field">
              <label className="field-label">IDADE</label>
              <input
                className="field-input field-input--narrow"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="00"
                type="number"
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
            </div>
          </div>

          <button className="btn-save" onClick={handleSave}>
            <span className="btn-arrow">→</span> SALVAR REGISTRO
          </button>
        </section>

        {/* Divider */}
        <div className="divider">
          <span className="divider-text">LISTA DE USUÁRIOS</span>
        </div>

        {/* User List */}
        <section className="list-section">
          {users.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⬡</div>
              <p className="empty-text">Nenhum usuário cadastrado.</p>
            </div>
          ) : (
            <ul className="user-list">
              {users.map((user, index) => (
                <li
                  key={user.id}
                  className={`user-card ${flash === user.id ? "user-card--flash" : ""}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="user-index">{String(index + 1).padStart(2, "0")}</div>
                  <div className="user-info">
                    <span className="user-name">{user.name}</span>
                    <span className="user-age-label">IDADE</span>
                    <span className={`user-age ${flash === user.id ? "user-age--pop" : ""}`}>
                      {user.age}
                    </span>
                  </div>
                  <div className="user-actions">
                    <button
                      className="btn-age"
                      onClick={() => handleAge(user.id)}
                      title="Incrementar idade"
                    >
                      +1
                    </button>
                    <button
                      className="btn-remove"
                      onClick={(e) => handleRemove(e, user.id)}
                      title="Remover usuário"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="footer">
          <span>LAB · DEV · WEB</span>
          <span className="footer-dot">◆</span>
          <span>REDUX TOOLKIT v2</span>
        </footer>
      </div>
    </div>
  );
}