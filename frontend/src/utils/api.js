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
  getUserData() {
    return fetch(this._baseUrl + "/users/me", {
      headers: {
        authorization: this._headers,
      },
    }).then(this._statusJson);
  }

  //Запрашиваем карточки
  getInitialCards() {
    return fetch(this._baseUrl + "/cards", {
      headers: {
        authorization: this._headers,
      },
    }).then(this._statusJson);
  }

  //Обновляем информацию о пользователе
  patchUserData(userData) {
    return fetch(this._baseUrl + "/users/me", {
      method: "PATCH",
      headers: {
        authorization: this._headers,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: userData.name,
        about: userData.about,
      }),
    }).then(this._statusJson);
  }

  //Отправляем новую карточку на сервер
  postAddCard(cardData) {
    return fetch(this._baseUrl + "/cards", {
      method: "POST",
      headers: {
        authorization: this._headers,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: cardData.name,
        link: cardData.link,
      }),
    }).then(this._statusJson);
  }

  //Добавляем или удаляем лайк
  changeLikeCardStatus(cardId, isLiked) {
    return fetch(this._baseUrl + "/cards/likes/" + cardId, {
      method: isLiked ? "PUT" : "DELETE",
      headers: {
        authorization: this._headers,
      },
    }).then(this._statusJson);
  }

  //Удаляем карточку
  deleteCard(cardId) {
    return fetch(this._baseUrl + "/cards/" + cardId, {
      method: "DELETE",
      headers: {
        authorization: this._headers,
      },
    }).then(this._statusJson);
  }

  //Обновляем аватар пользователя
  patchUserAvatar(userData) {
    return fetch(this._baseUrl + "/users/me/avatar", {
      method: "PATCH",
      headers: {
        authorization: this._headers,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        avatar: userData.avatar,
      }),
    }).then(this._statusJson);
  }
}

const api = new Api({
  baseUrl: "https://mesto.nomoreparties.co/v1/cohort-17",
  headers: "206505f6-db9d-4d3e-9753-f9e84f791b0d",
});

export default api;
