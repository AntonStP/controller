export default class Mouse {

    constructor(EventDispatcher, actionsToBind, currentActivities, eventList) {
        this.EventDispatcher = EventDispatcher;
        this.actionsToBind = actionsToBind;
        this.currentActivities = currentActivities;
        this.eventList = eventList;

        this.attach = this.attach.bind(this);
        this.detach = this.detach.bind(this);
        this._pointerDownHandler = this._pointerDownHandler.bind(this);
        this._pointerUpHandler = this._pointerUpHandler.bind(this);

        document.addEventListener(this.eventList.CONTROLLER_ATTACH, this.attach);
        document.addEventListener(this.eventList.CONTROLLER_DETACH, this.detach);
        document.addEventListener(this.eventList.ACTION_CHANGE, ()=> {
            this.detach()
            this.attach()
        });
    }

    attach() {
        console.log('attach mouse')
        document.addEventListener("pointerdown", this._pointerDownHandler);
        document.addEventListener("pointerup", this._pointerUpHandler);
    }


    detach() {
        document.removeEventListener("pointerdown", this._pointerDownHandler);
        document.removeEventListener("pointerup", this._pointerUpHandler);
    }

    _whatIsActivity(pressedKey) {
        let activity = "";
        for (const [key] of Object.entries(this.actionsToBind)) {
            if (
                this.actionsToBind[key]?.mouse === pressedKey &&
                this.actionsToBind[key].enabled
            ) activity = key;
        }
        return activity;
    }


    _pointerDownHandler(event) {
        const action = this._whatIsActivity(event.buttons);
        if (action && [...this.currentActivities].filter((el)=> el?.name===action && el?.input ==='mouse').length==0) {
            this.currentActivities.add({name: action, input: 'mouse'});
            if (action && [...this.currentActivities].filter((el)=> el?.name===action).length<=1) {
                this.EventDispatcher.dispatch(this.eventList.ACTION_ACTIVATED,{action: action, input: 'mouse'})
            }
        }
    }


    _pointerUpHandler(event) {
        const action = this._whatIsActivity(event.buttons);
        this.currentActivities.clear();
        this.EventDispatcher.dispatch(this.eventList.ACTION_DEACTIVATED,{action: action, input: 'mouse'})
    }

}
