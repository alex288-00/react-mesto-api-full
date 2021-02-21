import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header.js";

function Register({ onRegister }) {
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
    onRegister(data);
  }
  return (
    <>
      <Header
        link={
          <Link to="/sign-in" className="header__link">
            Войти
          </Link>
        }
      />
      <form
        className="popup__form popup__form_login-register"
        onSubmit={handleSubmit}
      >
        <h2 className="popup__title popup__title_login-register">
          Регистрация
        </h2>
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
          Зарегистрироваться
        </button>
        <div className="popup__register">
          <p className="popup__register-text">Уже зарегистрированы?</p>
          <Link
            to="sign-in"
            className="popup__register-text popup__register-link"
          >
            Войти
          </Link>
        </div>
      </form>
    </>
  );
}

export default Register;
