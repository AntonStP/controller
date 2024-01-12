export default class EventDispatcher {
    constructor () {}

    dispatch(event,detail) {
        const customEvent = new CustomEvent(event, {detail:detail});
        document.dispatchEvent(customEvent);
    }
}