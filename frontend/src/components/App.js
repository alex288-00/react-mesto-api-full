import api from "../utils/api.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import ImagePopup from "./ImagePopup.js";
import * as mestoAuth from "../mestoAuth.js";
import React, { useEffect, useState } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import "../index.css";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import Login from "./Login.js";
import Register from "./Register.js";
import ProtectedRoute from "./ProtectedRoute.js";
import imgSuccessful from "../images/Union.jpg";
import imgError from "../images/error.jpg";
import InfoTooltip from "./InfoTooltip.js";

function App() {
  const history = useHistory();

  //Переменная состояния попапа ошибки/успешной регистрации
  const [infoModal, setInfoModal] = useState({
    message: "",
    image: "",
  });

  //Переменная состояния проверки залогинен пользователь или нет
  const [loggedIn, setLoggedIn] = useState(false);

  //Переменная состояния данных пользователя
  const [userData, setUserData] = useState({
    email: "",
  });

  //Переменная состояния открытия попапа ошибки/успешной регистрации
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  //Переменная состояния данных пользователя
  const [currentUser, setCurrentUser] = useState({});

  //Прелоадер для обновления аватара и данных пользователя
  const [loader, setLoader] = useState("Сохранить");

  //Прелоадер для добавления карточки
  const [placeLoader, setPlaceLoader] = useState("Создать");

  // Переменные состояния и обработчики для открытия попапов
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  //Переменные состояния для карточки
  const [selectedCard, setSelectedCard] = useState(false);
  const [cards, setCards] = useState([]);

  //Функция открытия попапа изображения и передачи данных для карточки
  function handleCardClick(card) {
    setSelectedCard({
      src: card.src,
      name: card.name,
    });
  }

  //Функия закрытия попапов
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(false);
    setInfoModalOpen(false);
  }

  //Обработчик изменения данных пользователя
  function handleUpdateUser(userData) {
    setLoader("Сохранение..");
    api
      .patchUserData(userData)
      .then((userInfo) => {
        setCurrentUser(userInfo);
      })
      .catch((err) => {
        console.log("Произошла ошибка:", err);
      })
      .finally(() => {
        setLoader("Сохранить");
        closeAllPopups();
      });
  }

  //Обработчик аватара пользователя
  function handleUpdateAvatar(userData) {
    setLoader("Сохранение..");
    api
      .patchUserAvatar(userData)
      .then((userAva) => {
        setCurrentUser(userAva);
      })
      .catch((err) => {
        console.log("Произошла ошибка:", err);
      })

      .finally(() => {
        setLoader("Сохранить");
        closeAllPopups();
      });
  }

  //Обработчик создания новой карточки
  function handleAddPlaceSubmit(cardData) {
    setPlaceLoader("Создание..");
    api
      .postAddCard(cardData)
      .then((newCard) => {
        setCards([newCard, ...cards]);
      })
      .catch((err) => {
        console.log("Произошла ошибка:", err);
      })
      .finally(() => {
        setPlaceLoader("Создать");
        closeAllPopups();
      });
  }

  //Обработчик лайка карточки
  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        setCards(newCards);
      })
      .catch((err) => {
        console.log("Произошла ошибка:", err);
      });
  }

  //Обработчик удаления карточек
  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        const newCardData = cards.filter((c) => c._id !== card._id);
        setCards(newCardData);
      })
      .catch((err) => {
        console.log("Произошла ошибка:", err);
      });
  }

  //Эффект совершает запрос для проверки валидности токена и получения емайл для вставки в шапку сайта
  useEffect(() => {
    function tokenCheck() {
      if (localStorage.getItem("jwt")) {
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
          return mestoAuth
            .getContent(jwt)
            .then((res) => {
              if (res) {
                setLoggedIn(true);
                history.push("/");
                const userData = {
                  email: res.email,
                };
                setUserData(userData);
              }
            })
            .catch((err) => {
              console.log("Произошла ошибка:", err);
            });
        }
      }
    }
    tokenCheck();
  }, [history]);

  //Обработчик регистрации
  function onRegister(data) {
    const { email, password } = data;
    return mestoAuth
      .register(email, password)
      .then((res) => {
        if (res) {
          setInfoModalOpen(true);
          setInfoModal({
            message: "Вы успешно зарегистрировались!",
            image: imgSuccessful,
          });
          history.push("/sign-in");
        }
      })
      .catch((err) => {
        setInfoModalOpen(true);
        setInfoModal({
          message: "Что-то пошло не так! Попробуйте ещё раз.",
          image: imgError,
        });
        console.log("Произошла ошибка: ", err);
      });
  }

  //Обработчик авторизации и сохранения токена
  function onLogin(data) {
    const { email, password } = data;
    return mestoAuth
      .autorize(email, password)
      .then((res) => {
        if (res.token) {
          setLoggedIn(true);
          setUserData({
            email: email,
          });
          localStorage.setItem("jwt", res.token);
          return res;
        }
      })
      .then(() => history.push("/"))
      .catch((err) => {
        setInfoModalOpen(true);
        setInfoModal({
          message: "Что-то пошло не так! Попробуйте ещё раз.",
          image: imgError,
        });
        console.log("Произошла ошибка:", err);
      });
  }

  //Обработчик выхода и стирания токена
  function onSignOut() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    history.push("/sign-in");
  }

  //Эффект совершает запрос в API за карточками
  useEffect(() => {
    if (loggedIn) {
      setLoggedIn(true)
      api
      .getInitialCards()
      .then((card) => {
        setCards(card);
      })

      .catch((err) => {
        console.log("Произошла ошибка:", err);
      });
    }
    
  }, [loggedIn]);

  //Эффект совершает запрос в API за данными пользователя
  useEffect(() => {
    api
      .getUserData()
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => {
        console.log("Произошла ошибка:", err);
      });
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            loggedIn={loggedIn}
            userData={userData.email}
            onSignOut={onSignOut}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            cards={cards}
            component={Main}
          />
          <Route path="/sign-in">
            <Login onLogin={onLogin} />
          </Route>
          <Route path="/sign-up">
            <Register onRegister={onRegister} />
          </Route>

          <Route exact path="/">
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>
        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          textBtn={loader}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          textBtn={loader}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          textBtn={placeLoader}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <InfoTooltip
          isOpen={infoModalOpen}
          onClose={closeAllPopups}
          InfoTool={infoModal}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;