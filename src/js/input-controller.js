import Keyboard from "./keyboard-plugin.js";

export default class InputController {
    enabled = false; // <bool>: Включение/отключение генерации событий контроллера
    focused = false; // <bool>: Находится ли окно с целью контроллера в фокусе
    eventList = {
        ACTION_ACTIVATED: "input-controller:action-activated", //название события активации активности (одна из кнопок активности нажата)
        ACTION_DEACTIVATED: "input-controller:action-deactivated", //одна из кнопок активности отжата
        CONTROLLER_ATTACH: "input-controller:attach", //привязка контроллера
        CONTROLLER_DETACH: "input-controller:detach", //отвязка контроллера
        KEY_IS_PRESSED: "input-controller:isPressed" //проверка нажатия
    }
    currentActivities = new Set();
    ACTION_CHANGE = "input-controller:action-change";
    plugins = [];

    constructor(actionsToBind, target) {
        this.target = target;
        this.actionsToBind = actionsToBind;

        new Keyboard(this.actionsToBind, this.currentActivities, this.eventList);
        // keyboardPlugin
        // this.plugins.push(keyboardPlugin);
        //
        //this.plugins = this.plugins
    }


    bindActions(newAction) {
        this.actionsToBind = { ...this.actionsToBind, ...newAction };
        console.log('this.actionsToBind: ', this.actionsToBind);
    }

    enableAction(action) {
        //Включает объявленную активность - включает генерацию событий для этой активности при изменении её статуса
        if (this.actionsToBind.hasOwnProperty(action))
            this.actionsToBind[action].enabled = true;
        console.log("enableAction: " + action);
    }

    disableAction(action) {
        //Деактивирует объявленную активность - выключает генерацию событий для этой активности
        if (this.actionsToBind.hasOwnProperty(action))
            this.actionsToBind[action].enabled = false;
        console.log("disableAction: " + action);
    }

    attach(target) {
        //Нацеливает контроллер на переданный DOM-элемент (вешает слушатели)
        this.target = target;
        if (this.target !== null) this.enabled = true;
        this.focused = true;
        document.addEventListener("visibilitychange", this._focusHandler);
        const attachEvent = new CustomEvent(this.eventList.CONTROLLER_ATTACH);
        document.dispatchEvent(attachEvent);
        console.log('attached');
    }
    _focusHandler() {
        if (document.visibilityState === "visible") {
            this.focused = true;
        } else this.focused = false;
        console.log("focused", this.focused);
    }
    detach() {
        //Отцепляет контроллер от активного DOM-элемента и деактивирует контроллер
        this.enabled = false;
        this.focused = false;
        this.target = null;
        document.removeEventListener("visibilitychange", this._focusHandler);
        const detachEvent = new CustomEvent(this.eventList.CONTROLLER_DETACH);
        document.dispatchEvent(detachEvent);
        console.log('detached');
    }

    isActionActive(action) {
        //Проверяет активирована ли переданная активность в контроллере
        //( напр. для клавиатуры: зажата ли одна из соответствующих этой активности кнопок)
        return this.currentActivities.has(action);
    }

    isKeyPressed(...keys) {
        const isPressedEvent = new CustomEvent(this.eventList.KEY_IS_PRESSED, {
            detail: {keys: keys}
        });
        document.dispatchEvent(isPressedEvent);
    }
}
