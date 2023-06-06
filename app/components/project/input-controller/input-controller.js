export default class InputController {
    enabled = false;// <bool>: Включение/отключение генерации событий контроллера
    focused = false;// <bool>: Находится ли окно с целью контроллера в фокусе
    ACTION_ACTIVATED = "input-controller:action-activated"; //название события активации активности (одна из кнопок активности нажата)
    ACTION_DEACTIVATED = "input-controller:action-deactivated"; //одна из кнопок активности отжата

    constructor(actionsToBind, target) {
        this.target = target;
        this.actionsToBind = actionsToBind;
        this._keyDownHandler = this._keyDownHandler.bind(this);
        this._keyUpHandler = this._keyUpHandler.bind(this);
    }

    bindActions() {//Добавляет в контроллер переданные активности
        console.log('this.enabled',this.enabled)
        console.log('this.focused',this.focused)
        if(this.enabled && this.focused) {
            document.addEventListener('keydown', this._keyDownHandler);
            document.addEventListener('keyup', this._keyUpHandler);
            console.log('bindActions');
        }
    }
    _keyDownHandler(event) {
        console.log('_keyDownHandler')
        let myEvent = new CustomEvent(this.ACTION_ACTIVATED, {detail:{action:event.keyCode}})
        document.dispatchEvent(myEvent);
        // console.log(this.keysPressed);
    }
    _keyUpHandler() {
        let myEvent = new CustomEvent(this.ACTION_DEACTIVATED)
        document.dispatchEvent(myEvent);
        // console.log(this.keysPressed);
    }



    enableAction() {//Включает объявленную активность - включает генерацию событий для этой активности при изменении её статуса
        console.log('enableAction')
    }

    disableAction() {//Деактивирует объявленную активность - выключает генерацию событий для этой активности
        console.log('disableAction')
    }


    ////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////Привязка/отвязка///////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    attach(target) {//Нацеливает контроллер на переданный DOM-элемент (вешает слушатели)
        this.target = target;
        if(this.target!==null) this.enabled = true;
        this.focused = true;
        document.addEventListener('visibilitychange', this._focusHandler);
    }
    _focusHandler() {
        if(document.visibilityState==='visible') {
            this.focused = true;
        } else this.focused = false;
        console.log('this.focused', this.focused);
    }
    detach() {//Отцепляет контроллер от активного DOM-элемента и деактивирует контроллер
        this.enabled = false;
        this.focused = false;
        this.target = null;
        document.removeEventListener('visibilitychange', this._focusHandler);
        document.removeEventListener('keydown', this._keyDownHandler);
        document.removeEventListener('keyup', this._keyUpHandler);
    }
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////


    isActionActive(action) {//Проверяет активирована ли переданная активность в контроллере ( напр. для клавиатуры: зажата ли одна из соответствующих этой активности кнопок)
        return this.actionsToBind[action].enabled ? true : false;
        console.log('isActionActive')
    }

    isKeyPressed() {//Проверяет нажата ли переданная кнопка в контроллере
        console.log('isKeyPressed')
    }
}