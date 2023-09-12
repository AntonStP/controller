// import Keyboard from "./keyboard-plugin";

// console.log("Keyboard", Keyboard);

export default class InputController {
    enabled = false; // <bool>: Включение/отключение генерации событий контроллера
    focused = false; // <bool>: Находится ли окно с целью контроллера в фокусе
    currentKeys = new Set();
    currentActivities = new Set();
    ACTION_ACTIVATED = "input-controller:action-activated"; //название события активации активности (одна из кнопок активности нажата)
    ACTION_DEACTIVATED = "input-controller:action-deactivated"; //одна из кнопок активности отжата
    ACTION_CHANGE = "input-controller:action-change";
    plugins = [];

    constructor(actionsToBind, target) {
        this.target = target;
        this.actionsToBind = actionsToBind;
        this._keyDownHandler = this._keyDownHandler.bind(this);
        this._keyUpHandler = this._keyUpHandler.bind(this);

        const keyboardPlugin = new Keyboard();
        this.plugins.push(keyboardPlugin);
        //
        //this.plugins = this.plugins
    }



    bindActions(newAction) {
        this.actionsToBind = { ...this.actionsToBind, ...newAction };
        console.log(this.actionsToBind);
    }

    _whatIsActivity(pressedKey) {
        let activity = "";
        for (const [key] of Object.entries(this.actionsToBind)) {
            if (
                this.actionsToBind[key].keys.indexOf(pressedKey) !== -1 &&
                this.actionsToBind[key].enabled
            )
                activity = key;
        }
        return activity;
    }
    _keyDownHandler(event) {
        this.currentKeys.add(event.keyCode);
        const _action = this._whatIsActivity(event.keyCode);
        if (_action && !this.currentActivities.has(_action)) {
            this.currentActivities.add(_action);
            let myEvent1 = new CustomEvent(this.ACTION_ACTIVATED, {
                detail: { action: _action }
            });
            document.dispatchEvent(myEvent1);
        }
    }
    _keyUpHandler(event) {
        const action = this._whatIsActivity(event.keyCode);
        this.currentKeys.delete(event.keyCode);
        this.currentActivities.clear();
        [...this.currentKeys].forEach((el) => {
            const _action = this._whatIsActivity(el);
            if (_action) this.currentActivities.add(_action);
        });
        let myEvent2 = new CustomEvent(this.ACTION_DEACTIVATED, {
            detail: { action: action }
        });
        document.dispatchEvent(myEvent2);
    }

    enableAction(action) {
        //Включает объявленную активность - включает генерацию событий для этой активности при изменении её статуса
        if (this.actionsToBind.hasOwnProperty(action))
            this.actionsToBind[action].enabled = true;
        console.log("--->", "ableAction: " + action, "<---");
    }

    disableAction(action) {
        //Деактивирует объявленную активность - выключает генерацию событий для этой активности
        if (this.actionsToBind.hasOwnProperty(action))
            this.actionsToBind[action].enabled = false;
        console.log("--->", "disableAction: " + action, "<---");
    }

    attach(target) {
        //Нацеливает контроллер на переданный DOM-элемент (вешает слушатели)
        this.target = target;
        if (this.target !== null) this.enabled = true;
        this.focused = true;
        document.addEventListener("visibilitychange", this._focusHandler);
        document.addEventListener("keydown", this._keyDownHandler);
        document.addEventListener("keyup", this._keyUpHandler);
    }
    _focusHandler() {
        console.log("", document.visibilityState, "");
        if (document.visibilityState === "visible") {
            this.focused = true;
        } else this.focused = false;
        console.log("--->", "this.focused", this.focused, "<---");
    }
    detach() {
        //Отцепляет контроллер от активного DOM-элемента и деактивирует контроллер
        this.enabled = false;
        this.focused = false;
        this.target = null;
        document.removeEventListener("visibilitychange", this._focusHandler);
        document.removeEventListener("keydown", this._keyDownHandler);
        document.removeEventListener("keyup", this._keyUpHandler);
    }

    isActionActive(action) {
        //Проверяет активирована ли переданная активность в контроллере
        //( напр. для клавиатуры: зажата ли одна из соответствующих этой активности кнопок)
        console.log(Array.from(this.currentActivities));
        return this.currentActivities.has(action);
    }

    isKeyPressed(...keys) {
        //Проверяет нажата ли переданная кнопка в контроллер
        const keysPressed = {};
        for (let key of keys) {
            keysPressed[key] = this.currentKeys.has(key);
        }
        return keysPressed;
    }
}
