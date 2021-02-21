//Компонент попапа изображения

function ImagePopup({ card, onClose }) {
  return (
    <div className={`popup popup_img ${card ? "popup_opened" : ""}`}>
      <div className="popup__zoom-container">
        <button className="popup__close" onClick={onClose} />
        <img className="popup__image" src={card.src} alt={card.name} />
        <p className="popup__subtitle">{card.name}</p>
      </div>
    </div>
  );
}

export default ImagePopup;
