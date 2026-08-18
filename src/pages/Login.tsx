import { useState } from "react";

type LoginProps = {
  onLogin: () => void;
};

function Login({ onLogin }: LoginProps) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!login.trim() || !password.trim()) {
      setError("Введите логин и пароль — их выдаёт менеджер");
      return;
    }
    setError("");
    onLogin();
  }

  return (
    <div className="screen screen--plain">
      <p className="eyebrow">Обучение персонала</p>
      <h1 className="brand" style={{ marginBottom: 28 }}>
        ОФИЦИ<span>АНТ</span>
      </h1>

      <input
        className="field"
        placeholder="Логин"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />
      <input
        className="field"
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />

      {error && <p className="form-error">{error}</p>}

      <button className="btn" onClick={handleSubmit}>
        Войти
      </button>

      <p className="muted" style={{ textAlign: "center", marginTop: 22 }}>
        Пока проверки пароля нет — она появится вместе с аккаунтами.
      </p>
    </div>
  );
}

export default Login;
