function InfoTooltip({ isOpen, onClose, InfoTool }) {
  const { message, image } = InfoTool;
  return (
    <div className={`popup ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__form popup__form_success-error">
        <img src={image} alt=""></img>
        <p className="popup__title popup__title_success-error">{message}</p>
        <button type="button" className="popup__close" onClick={onClose} />
      </div>
    </div>
  );
}

export default InfoTooltip;
