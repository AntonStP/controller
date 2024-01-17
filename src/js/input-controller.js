import Keyboard from "./keyboard-plugin.js";
import Mouse from "./mouse-plugin.js";
import EventDispatcher from "./event-dispatcher.js";

export default class InputController {
    /**
     *  ACTION_ACTIVATED    название события активации активности (одна из кнопок активности нажата)
     *  ACTION_DEACTIVATED  одна из кнопок активности отжата
     *  CONTROLLER_ATTACH   привязка контроллера
     *  CONTROLLER_DETACH   отвязка контроллера
     *  KEY_IS_PRESSED      проверка нажатия
     * @type {{CONTROLLER_ATTACH: string, KEY_IS_PRESSED: string, CONTROLLER_DETACH: string, ACTION_ACTIVATED: string, ACTION_CHANGE: string, ACTION_DEACTIVATED: string}}
     */
     EVENT_LIST= {
        ACTION_ACTIVATED: "input-controller:action-activated",
        ACTION_DEACTIVATED: "input-controller:action-deactivated",
        CONTROLLER_ATTACH: "input-controller:attach",
        CONTROLLER_DETACH: "input-controller:detach",
        KEY_IS_PRESSED: "input-controller:isPressed",
        ACTION_CHANGE: "input-controller:action-change"
    }

    /**
     * Включение/отключение генерации событий контроллера
     * @type {boolean}
     */
    enabled = false;

    /**
     * Находится ли окно с целью контроллера в фокусе
     * @type {boolean}
     */
    focused = false;

    currentActivities = new Set();
    pluginClasses = [];
    activePlugins = new Set();

    constructor(actionsToBind, target) {
        this.registerPlugin = this.registerPlugin.bind(this);
        this.initPlugins = this.initPlugins.bind(this);
        this.target = target;

        this.actionsToBind = actionsToBind;
        this.EventDispatcher = new EventDispatcher();

        this.registerPlugin([Mouse, Keyboard]);
        this.initPlugins();
        document.addEventListener(this.EVENT_LIST.ACTION_CHANGE, this.initPlugins);
    }

    registerPlugin(plugins){
        plugins.forEach((Cls)=> this.pluginClasses.push(Cls));
    }

    initPlugins() {
        this.pluginClasses.forEach(Cls=> {
            for(const [,value] of Object.entries(this.actionsToBind)) {
                if(Cls.check(value)) this.activePlugins.add(Cls)
            }
        })
        for (const Plugin of [...this.activePlugins]) {
            new Plugin(this.EventDispatcher, this.actionsToBind, this.currentActivities, this.EVENT_LIST)
        }
        // new Keyboard(this.actionsToBind, this.currentActivities, this.eventList);
    }

    bindActions(newAction) {
        this.actionsToBind = { ...this.actionsToBind, ...newAction };
        this.initPlugins();
        this.EventDispatcher.dispatch(this.EVENT_LIST.ACTION_CHANGE);
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
        this.EventDispatcher.dispatch(this.EVENT_LIST.CONTROLLER_ATTACH);
        console.log('attached');
    }
    _focusHandler() {
        this.focused = document.visibilityState === "visible";
        console.log("focused", this.focused);
    }
    detach() {
        //Отцепляет контроллер от активного DOM-элемента и деактивирует контроллер
        this.enabled = false;
        this.focused = false;
        this.target = null;
        document.removeEventListener("visibilitychange", this._focusHandler);
        this.EventDispatcher.dispatch(this.EVENT_LIST.CONTROLLER_DETACH);
        console.log('detached');
    }

    isActionActive(action) {
        //Проверяет активирована ли переданная активность в контроллере
        //( напр. для клавиатуры: зажата ли одна из соответствующих этой активности кнопок)
        return [...this.currentActivities].some((el)=> el?.name===action);
    }

    isKeyPressed(...keys) {
        this.EventDispatcher.dispatch(this.EVENT_LIST.KEY_IS_PRESSED, {keys: keys});
    }
}
