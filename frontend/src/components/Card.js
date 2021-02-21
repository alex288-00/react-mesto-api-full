import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import { useContext } from "react";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  //Подписка на контекст
  const currentUser = useContext(CurrentUserContext);

  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwner = card.owner._id === currentUser._id;

  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = `element__trash ${
    isOwner ? "" : "element__trash_hidden"
  }`;

  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = card.likes.some((i) => i._id === currentUser._id);

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = `element__like ${
    isLiked ? "element__like_active" : ""
  }`;

  //Функция с подставлением данных при клике на карточку
  function handleClick() {
    onCardClick({
      src: card.link,
      name: card.name,
    });
  }

  //Обработчик лайков
  function handleLikeClick() {
    onCardLike(card);
  }

  //Обработчик удаления карточек
  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <div className="element">
      <button
        className={cardDeleteButtonClassName}
        onClick={handleDeleteClick}
      ></button>
      <img
        className="element__image"
        src={card.link}
        alt={card.name}
        onClick={handleClick}
      />

      <div className="element__title-like">
        <h3 className="element__title">{card.name}</h3>
        <div className="element__like-counter">
          <button
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
          ></button>
          <p className="element__counter">{card.likes.length}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
