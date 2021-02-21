import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header.js";

function Login({ onLogin }) {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  function handleChange(evt) {
    const { name, value } = evt.target;
    setData({
      ...data,
      [name]: value,
    });
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onLogin(data);
  }
  return (
    <>
      <Header
        link={
          <Link to="/sign-up" className="header__link">
            Регистрация
          </Link>
        }
      />
      <form
        className="popup__form popup__form_login-register"
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className="popup__title popup__title_login-register">Вход</h2>
        <input
          className="popup__input popup__input_login-register"
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          value={data.email}
          required
        />
        <input
          className="popup__input popup__input_login-register"
          id="password"
          name="password"
          type="password"
          placeholder="Пароль"
          onChange={handleChange}
          value={data.password}
          required
        />
        <button
          type="submit"
          className="popup__button popup__button_login-register"
        >
          Войти
        </button>
      </form>
    </>
  );
}

export default Login;
