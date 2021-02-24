export class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  //Статус ответа
  _statusJson(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  //Запрашиваем информацию о пользователе
  getUserData(token) {
    return fetch(this._baseUrl + "/users/me", {
      headers: {
        authorization: "Bearer " + token,
      },
    }).then(this._statusJson);
  }

  //Запрашиваем карточки
  getInitialCards(token) {
    return fetch(this._baseUrl + "/cards", {
      headers: {
        authorization: "Bearer " + token,
      },
    }).then(this._statusJson);
  }

  //Обновляем информацию о пользователе
  patchUserData(userData, token) {
    return fetch(this._baseUrl + "/users/me", {
      method: "PATCH",
      headers: {
        authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: userData.name,
        about: userData.about,
      }),
    }).then(this._statusJson);
  }

  //Отправляем новую карточку на сервер
  postAddCard(cardData, token) {
    return fetch(this._baseUrl + "/cards", {
      method: "POST",
      headers: {
        authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: cardData.name,
        link: cardData.link,
      }),
    }).then(this._statusJson);
  }

  //Добавляем или удаляем лайк
  changeLikeCardStatus(cardId, isLiked, token) {
    return fetch(this._baseUrl + "/cards/" + cardId + "/likes/", {
      method: isLiked ? "PUT" : "DELETE",
      headers: {
        authorization: "Bearer " + token,
      },
    }).then(this._statusJson);
  }

  //Удаляем карточку
  deleteCard(cardId, token) {
    return fetch(this._baseUrl + "/cards/" + cardId, {
      method: "DELETE",
      headers: {
        authorization: "Bearer " + token,
      },
    }).then(this._statusJson);
  }

  //Обновляем аватар пользователя
  patchUserAvatar(userData, token) {
    return fetch(this._baseUrl + "/users/me/avatar", {
      method: "PATCH",
      headers: {
        authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        avatar: userData.avatar,
      }),
    }).then(this._statusJson);
  }
}

const api = new Api({
  baseUrl: "https://api.mesto.alex.students.nomoreparties.space",
});

export default api;
