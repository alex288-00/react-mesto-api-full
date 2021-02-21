import { useState } from "react";
import PopupWithForm from "./PopupWithForm.js";
function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, textBtn }) {
  //Переменная состояния ссылки на аватар
  const [avatarData, setAvatarData] = useState("");

  function handleChange(evt) {
    setAvatarData(evt.target.value);
  }

  //Обработчик сабмита формы
  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateAvatar({
      avatar: avatarData,
    });
    evt.target.reset();
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      name="update-avatar"
      nameForm="update-avatar"
      title="Обновить аватар"
      textBtn={textBtn}
    >
      <input
        className="popup__input popup__input_link"
        id="link-input"
        name="avatar"
        type="url"
        placeholder="Ссылка на картинку"
        onChange={handleChange}
        required
      />
      <span
        className="popup__error popup__error_visible"
        id="link-input-error"
      />
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
