import InputController from "./input-controller.js";

const actions = {
    //ключи кнопок и активность
    left: { keys: [37, 65], enabled: true },
    up: { keys: [38, 87], enabled: true },
    right: { keys: [39, 68],  mouse: 1, enabled: true },
    down: { keys: [40, 83], enabled: true }
};
const field = document.querySelector(".game__field");
const target = document.querySelector(".game__character");
let top = 0;
let left = 0;
let color = "yellowgreen";
const maxLeft = field.offsetWidth - target.offsetWidth;
const maxTop = field.offsetHeight - target.offsetHeight;

const controller = new InputController(actions, target);

//слушатели на кнопки
const bindActions = document.querySelector(".game__button_bindActions");
bindActions.addEventListener("click", function () {
    controller.bindActions({ jump: { keys: [32], enabled: true } });
});

//добавление/удаление активностей
document.addEventListener("input-controller:action-activated", (e) => {
    console.log('ЕДЕТ')
    const activity = e.detail.action;
    function move() {
        switch (activity) {
            case "up":
                if (top - 1 >= 0) top -= 3;
                break;
            case "down":
                if (top + 1 < maxTop - 3) top += 3;
                break;
            case "left":
                if (left - 1 >= 0) left -= 3;
                break;
            case "right":
                if (left + 1 < maxLeft - 3) left += 3;
                break;
            case "jump":
                color = "red";
                break;
            default:
                break;
        }
        target.style.top = `${top}px`;
        target.style.left = `${left}px`;
        target.style.backgroundColor = color;
        if (controller.currentActivities.has(activity)) {
            window.requestAnimationFrame(move);
        }
    }
    window.requestAnimationFrame(move);
});

document.addEventListener("input-controller:action-deactivated", (e) => {
    const activity = e.detail.action;
    function move() {
        if (activity === "jump") color = "yellowgreen";
        target.style.backgroundColor = color;
        if (controller.currentActivities.has(activity)) {
            window.requestAnimationFrame(move);
        }
    }
    window.requestAnimationFrame(move);
});

const enableAction = document.querySelector(".game__button_enableAction");
enableAction.addEventListener("click", function () {
    controller.enableAction("up");
});

const disableAction = document.querySelector(".game__button_disableAction");
disableAction.addEventListener("click", function () {
    controller.disableAction("up");
});

const attach = document.querySelector(".game__button_attach");
attach.addEventListener("click", function () {
    controller.attach(target);
    attach.classList.add("button_active");
});

const detach = document.querySelector(".game__button_detach");
detach.addEventListener("click", function () {
    controller.detach();
    attach.classList.remove("button_active");
    bindActions.classList.remove("button_active");
});

const isActionActive = document.querySelector(".game__button_isActionActive");
isActionActive.addEventListener("click", function () {
    console.log(controller.isActionActive("up"));
});

const isKeyPressed = document.querySelector(".game__button_isKeyPressed");
isKeyPressed.addEventListener("click", function () {
    controller.isKeyPressed(37, 38);
});
