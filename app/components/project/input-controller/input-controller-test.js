import InputController from './input-controller';

const target = document.querySelector('.game__character');
const controller = new InputController('a','a');

const bindActions = document.querySelector('.game__button_bindActions');
bindActions.addEventListener("click", function () {
    controller.bindActions();
});


const enableAction = document.querySelector('.game__button_enableAction');
enableAction.addEventListener("click", function () {
    controller.enableAction();
});


const disableAction = document.querySelector('.game__button_disableAction');
disableAction.addEventListener("click", function () {
    controller.disableAction();
});


const attach = document.querySelector('.game__button_attach');
attach.addEventListener("click", function () {
    controller.attach();
});


const detach = document.querySelector('.game__button_detach');
detach.addEventListener("click", function () {
    controller.detach();
});


const isActionActive = document.querySelector('.game__button_isActionActive');
isActionActive.addEventListener("click", function () {
    controller.isActionActive();
});


const isKeyPressed = document.querySelector('.game__button_isKeyPressed');
isKeyPressed.addEventListener("click", function () {
    controller.isKeyPressed();
});