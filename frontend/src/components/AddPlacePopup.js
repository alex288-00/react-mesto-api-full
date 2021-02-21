import { useState } from "react";
import PopupWithForm from "./PopupWithForm.js";

// Переменная состояния данных для новой карточки
function AddPlacePopup({ isOpen, onClose, onAddPlace, textBtn }) {
  const [dataCard, setDataCard] = useState({
    name: "",
    link: "",
  });

  //Берем данные из инпута
  function handleChange(evt) {
    const { name, value } = evt.target;
    setDataCard({
      ...dataCard,
      [name]: value,
    });
  }

  //Обработчик сабмита формы
  function handleSubmit(evt) {
    evt.preventDefault();
    onAddPlace(dataCard);
    evt.target.reset();
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      name="add-card"
      title="Новое место"
      textBtn={textBtn}
    >
      <input
        className="popup__input popup__input_mesto"
        id="mesto-input"
        name="name"
        type="text"
        placeholder="Название"
        minLength={2}
        maxLength={30}
        onChange={handleChange}
        required
      />
      <span
        className="popup__error popup__error_visible"
        id="mesto-input-error"
      />
      <input
        className="popup__input popup__input_link"
        id="link-input"
        name="link"
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

export default AddPlacePopup;
