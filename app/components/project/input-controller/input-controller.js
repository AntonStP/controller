export default class InputController {
    enabled = false;// <bool>: Включение/отключение генерации событий контроллера
    focused = false;// <bool>: Находится ли окно с целью контроллера в фокусе
    ACTION_ACTIVATED = "input-controller:action-activated"; //название события активации активности (одна из кнопок активности нажата)
    ACTION_DEACTIVATED = "input-controller:action-deactivated"; //одна из кнопок активности отжата

    constructor(actionsToBind, target) {
        this.target = target;
        this.actionsToBind = actionsToBind;
        this.keysPressed = new Set();
    }

    bindActions() {//Добавляет в контроллер переданные активности
        document.addEventListener('keydown', (e)=>this._keyDownHandler(e));
        document.addEventListener('keydown', (e)=>this._move(e));
        document.addEventListener('keyup', (e)=>this._keyUpHandler(e));
        console.log(this.actionsToBind)
        console.log('bindActions')
    }
    _keyDownHandler(event) {
        if(this.keysPressed?.size<2)  this.keysPressed.add(event.keyCode);
        console.log(this.keysPressed);
    }
    _keyUpHandler(event) {
        this.keysPressed.delete(event.keyCode);
        console.log( this.keysPressed);
    }
    _move() {
        console.log("this.actionsToBind", this.actionsToBind)
        const arrayKeys = [...this.keysPressed];
        arrayKeys.forEach((el,id)=> {
            this.actionsToBind.forEach((action,idA)=> {
                if(action.keys.indexOf(el)==-1 && action.enabled) {
                    console.log("action", action)
                }
            })
        })
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
    attach() {//Нацеливает контроллер на переданный DOM-элемент (вешает слушатели)
        if(this.target!==null) this.enabled = true;
        document.addEventListener('visibilitychange', this._focusHandler);
        console.log("attach");
    }
    _focusHandler() {
        if(document.visibilityState==='visible') {
            this.focused = true;
        } else this.focused = false;
        console.log('this.focused', this.focused);
    }
    detach() {//Отцепляет контроллер от активного DOM-элемента и деактивирует контроллер
        this.enabled = false;
        this.target = null;
        document.removeEventListener('visibilitychange', this._focusHandler);
        console.log("detach");
    }
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////


    isActionActive() {//Проверяет активирована ли переданная активность в контроллере ( напр. для клавиатуры: зажата ли одна из соответствующих этой активности кнопок)
        console.log('isActionActive')
    }

    isKeyPressed() {//Проверяет нажата ли переданная кнопка в контроллере
        console.log('isKeyPressed')
    }
}