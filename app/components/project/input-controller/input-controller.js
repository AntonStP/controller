export default class InputController {
    constructor(actionsToBind, target) {

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
        console.log('attach')
    }

    detach() {//Отцепляет контроллер от активного DOM-элемента и деактивирует контроллер
        console.log('detach')
    }

    isActionActive() {//Проверяет активирована ли переданная активность в контроллере ( напр. для клавиатуры: зажата ли одна из соответствующих этой активности кнопок)
        console.log('isActionActive')
    }

    isKeyPressed() {//Проверяет нажата ли переданная кнопка в контроллере
        console.log('isKeyPressed')
    }
}