export default class InputController {
    enabled = false;// <bool>: Включение/отключение генерации событий контроллера
    focused = false;// <bool>: Находится ли окно с целью контроллера в фокусе
    ACTION_ACTIVATED = "input-controller:action-activated"; //название события активации активности (одна из кнопок активности нажата)
    ACTION_DEACTIVATED = "input-controller:action-deactivated"; //одна из кнопок активности отжата

    constructor(actionsToBind, target) {
        this.target = target;
    }

    bindActions() {//Добавляет в контроллер переданные активности
        console.log('bindActions')
    }

    enableAction() {//Включает объявленную активность - включает генерацию событий для этой активности при изменении её статуса
        console.log('enableAction')
    }

    disableAction() {//Деактивирует объявленную активность - выключает генерацию событий для этой активности
        console.log('disableAction')
    }

    attach() {//Нацеливает контроллер на переданный DOM-элемент (вешает слушатели)
        if(this.target!==null) this.enabled = true;
        document.addEventListener('visibilitychange', this.focusHandler);
        console.log("attach");
    }

    focusHandler() {
        if(document.visibilityState==='visible') {
            this.focused = true;
        } else this.focused = false;
        console.log('this.focused', this.focused);
    }

    detach() {//Отцепляет контроллер от активного DOM-элемента и деактивирует контроллер
        this.enabled = false;
        this.target = null;
        document.removeEventListener('visibilitychange', this.focusHandler);
        console.log("detach");
    }

    isActionActive() {//Проверяет активирована ли переданная активность в контроллере ( напр. для клавиатуры: зажата ли одна из соответствующих этой активности кнопок)
        console.log('isActionActive')
    }

    isKeyPressed() {//Проверяет нажата ли переданная кнопка в контроллере
        console.log('isKeyPressed')
    }
}