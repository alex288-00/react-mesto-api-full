import { useContext, useEffect, useState } from "react";
import PopupWithForm from "./PopupWithForm.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
function EditProfilePopup({ isOpen, onClose, onUpdateUser, textBtn }) {
  //Подписка на контекст
  const currentUser = useContext(CurrentUserContext);

  //Переменные состояния данных пользователя
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  //Отслеживаем изменения инпута и обновляем стейт для имени пользователя
  function handleChangeName(evt) {
    setName(evt.target.value);
  }

  //Отслеживаем изменения инпута и обновляем стейт для описания пользователя
  function handleChangeDescription(evt) {
    setDescription(evt.target.value);
  }

  //Обработчик сабмита формы
  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  }

  // После загрузки текущего пользователя из API
  // его данные будут использованы в управляемых компонентах.
  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser]);

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      name="profile"
      nameForm="profile"
      title="Редактировать профиль"
      textBtn={textBtn}
    >
      <input
        className="popup__input popup__input_name"
        id="name-input"
        name="name"
        type="text"
        placeholder="Имя"
        minLength={2}
        maxLength={40}
        required
        value={name}
        onChange={handleChangeName}
      />
      <span
        className="popup__error popup__error_visible"
        id="name-input-error"
      />
      <input
        className="popup__input popup__input_job"
        id="job-input"
        name="about"
        type="text"
        placeholder="Описание"
        minLength={2}
        maxLength={200}
        required
        value={description}
        onChange={handleChangeDescription}
      />
      <span
        className="popup__error popup__error_visible"
        id="job-input-error"
      />
    </PopupWithForm>
  );
}

export default EditProfilePopup;
