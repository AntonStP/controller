import Keyboard from "./keyboard-plugin.js";
import Mouse from "./mouse-plugin.js";
import EventDispatcher from "./event-dispatcher.js";

export default class InputController {
    enabled = false; // <bool>: Включение/отключение генерации событий контроллера
    focused = false; // <bool>: Находится ли окно с целью контроллера в фокусе
    eventList = {
        ACTION_ACTIVATED: "input-controller:action-activated", //название события активации активности (одна из кнопок активности нажата)
        ACTION_DEACTIVATED: "input-controller:action-deactivated", //одна из кнопок активности отжата
        CONTROLLER_ATTACH: "input-controller:attach", //привязка контроллера
        CONTROLLER_DETACH: "input-controller:detach", //отвязка контроллера
        KEY_IS_PRESSED: "input-controller:isPressed", //проверка нажатия
        ACTION_CHANGE: "input-controller:action-change"
    }
    currentActivities = new Set();
    activePlugins = new Set();

    constructor(actionsToBind, target) {
        this.target = target;
        this.actionsToBind = actionsToBind;

        this.initPlugins = this.initPlugins.bind(this);
        this.isActionActive= this.isActionActive.bind(this);
        this.EventDispatcher = new EventDispatcher();//объявление диспатчера

        this.initPlugins();
        document.addEventListener(this.eventList.ACTION_CHANGE, this.initPlugins);
    }

    initPlugins() {
        for(const [,value] of Object.entries(this.actionsToBind)) {
            if(!!value?.mouse) this.activePlugins.add('Mouse')
            if(!!value?.keys) this.activePlugins.add('Keyboard')
        }
        for (const plugin of [Mouse, Keyboard]) {
            if(this.activePlugins.has(plugin.name)) new plugin(this.EventDispatcher, this.actionsToBind, this.currentActivities, this.eventList)
        }
        // new Keyboard(this.actionsToBind, this.currentActivities, this.eventList);
    }

    bindActions(newAction) {
        this.actionsToBind = { ...this.actionsToBind, ...newAction };
        this.initPlugins();
        this.EventDispatcher.dispatch(this.eventList.ACTION_CHANGE);
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
        this.EventDispatcher.dispatch(this.eventList.CONTROLLER_ATTACH);
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
        this.EventDispatcher.dispatch(this.eventList.CONTROLLER_DETACH);
        console.log('detached');
    }
w
    isActionActive(action) {
        //Проверяет активирована ли переданная активность в контроллере
        //( напр. для клавиатуры: зажата ли одна из соответствующих этой активности кнопок)
        return [...this.currentActivities].filter((el)=> el?.name===action).length>0 ? true : false;
    }

    isKeyPressed(...keys) {
        this.EventDispatcher.dispatch(this.eventList.KEY_IS_PRESSED, {keys: keys});
    }
}
