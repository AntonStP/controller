import InputController from './input-controller';


const actions = {//ключи кнопок и активность
    'left': {keys: [37,65], enabled: true},
    'up': {keys: [38,87], enabled: true},
    'right': {keys: [39,68], enabled: true},
    'down': {keys: [40,83], enabled: true}
};
const field = document.querySelector('.game__field');
const target = document.querySelector('.game__character');
let top = 0;
let left = 0;
// target.style.transition = ".1s linear";
const maxLeft = field.offsetWidth - target.offsetWidth;
const maxTop = field.offsetHeight - target.offsetHeight;

const controller = new InputController(actions,target);






//слушатели на кнопки
const bindActions = document.querySelector('.game__button_bindActions');
bindActions.addEventListener("click", function () {
    controller.bindActions();
    if(controller.enabled) bindActions.classList.add('button_active')
});

document.addEventListener('input-controller:action-activated', (e)=> {
    const action = e.detail.action;
    let side = '';
    for(const[key,value] of Object.entries(actions)) {
        console.log(key, controller.isActionActive(key))
        if(!controller.isActionActive(key)) continue;
        if(actions[key].keys.indexOf(action) !== -1) side = key;
        if(side==='up' && top-10>0) {
            top = top-10;
            target.style.top = `${top}px`;
            return;
        }
        else if(side==='down' && top+10<maxTop) {
            top = top+10;
            target.style.top = `${top}px`;
            return;
        }
        else if(side==='left' && left-10>0) {
            left = left-10;
            target.style.left = `${left}px`;
            return;
        }
        else if(side==='right' && left+10<maxLeft) {
            left = left+10;
            target.style.left = `${left}px`;
            return;
        }
    }
});


const enableAction = document.querySelector('.game__button_enableAction');
enableAction.addEventListener("click", function () {
    controller.enableAction("up");
});


const disableAction = document.querySelector('.game__button_disableAction');
disableAction.addEventListener("click", function () {
    controller.disableAction("up");
});


const attach = document.querySelector('.game__button_attach');
attach.addEventListener("click", function () {
    controller.attach(target);
    attach.classList.add('button_active')
});


const detach = document.querySelector('.game__button_detach');
detach.addEventListener("click", function () {
    controller.detach();
    attach.classList.remove('button_active');
    bindActions.classList.remove('button_active');
    console.log(controller.enabled)
    console.log(controller.focused)
});


const isActionActive = document.querySelector('.game__button_isActionActive');
isActionActive.addEventListener("click", function () {
    for(const[key,value] of Object.entries(actions)) {
        console.log(`${key} is Active: `,controller.isActionActive(key));
    }
});


const isKeyPressed = document.querySelector('.game__button_isKeyPressed');
isKeyPressed.addEventListener("click", function () {
    controller.isKeyPressed();
});