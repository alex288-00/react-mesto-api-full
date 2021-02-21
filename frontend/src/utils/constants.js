export { params, editProfileBtn, nameInput, jobInput, addPlaceButton, avatarBtn };

const editProfileBtn = document.querySelector('.profile__info-editbutton');
const nameInput = document.querySelector('.popup__input_name');
const jobInput = document.querySelector('.popup__input_job');
const addPlaceButton = document.querySelector('.profile__info-addbutton');
const avatarBtn = document.querySelector('.profile__update-btn');

//Объект настроек с селекторами для валидации формы
const params = {
    formSelector: '.popup__form',
    formSelectorProfile: '.popup__form_profile',
    formSelectorAddCard: '.popup__form_add-card',
    formSelectorUpdateAvatar: '.popup__form_update-avatar',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
};