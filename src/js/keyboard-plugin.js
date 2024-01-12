export default class Keyboard {
    currentKeys = new Set();

    constructor(EventDispatcher, actionsToBind, currentActivities, eventList) {
        this.EventDispatcher = EventDispatcher;
        this.actionsToBind = actionsToBind;
        this.currentActivities = currentActivities;
        this.eventList = eventList;

        this._keyDownHandler = this._keyDownHandler.bind(this);
        this._keyUpHandler = this._keyUpHandler.bind(this);
        this.attach = this.attach.bind(this);
        this.detach = this.detach.bind(this);
        this.isKeyPressed = this.isKeyPressed.bind(this);

        document.addEventListener(this.eventList.CONTROLLER_ATTACH, this.attach);
        document.addEventListener(this.eventList.CONTROLLER_DETACH, this.detach);
        document.addEventListener(this.eventList.KEY_IS_PRESSED, (e)=>this.isKeyPressed(e.detail.keys));
        document.addEventListener(this.eventList.ACTION_CHANGE, ()=> {
            this.detach()
            this.attach()
        });
        console.log('проверка приходящих экшенов', this.actionsToBind)
    }


    attach() {
        document.addEventListener("keydown", this._keyDownHandler);
        document.addEventListener("keyup", this._keyUpHandler);
    }


    detach() {
        document.removeEventListener("keydown", this._keyDownHandler);
        document.removeEventListener("keyup", this._keyUpHandler);
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
            this.EventDispatcher.dispatch(this.eventList.ACTION_ACTIVATED,{action: _action})
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
        this.EventDispatcher.dispatch(this.eventList.ACTION_DEACTIVATED,{action: action})
    }

    isKeyPressed(keys) {
        //Проверяет нажата ли переданная кнопка в контроллер
        const keysPressed = {};
        for (let key of keys) {
            keysPressed[key] = this.currentKeys.has(key);
        }
        console.log("Переданные кнопки нажаты: ", keysPressed);
    }

}
