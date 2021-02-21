//Компонент шапки приложения

function Header({ link, userData }) {
  return (
    <header className="header">
      <div className="header__logo" />
      <div className="header__container">
        <p className="header__info">{userData}</p>
        {link}
      </div>
    </header>
  );
}

export default Header;
