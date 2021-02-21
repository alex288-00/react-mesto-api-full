//Компонент с общей разметкой попапов

function PopupWithForm({
  name,
  title,
  textBtn,
  children,
  isOpen,
  onClose,
  onSubmit,
}) {
  return (
    <div className={`popup popup_${name} ${isOpen ? "popup_opened" : ""}`}>
      <form
        className={`popup__form popup__form_${name} `}
        onSubmit={onSubmit}
        noValidate
      >
        <h2 className="popup__title popup__title_profile">{title}</h2>
        <button type="button" className="popup__close" onClick={onClose} />
        {children}
        <button type="submit" className="popup__button">
          {textBtn}
        </button>
      </form>
    </div>
  );
}

export default PopupWithForm;
