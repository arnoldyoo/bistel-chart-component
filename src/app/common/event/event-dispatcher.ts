export class EventDispatcher {
    private static Instance: EventDispatcher = null;

    public static getInstance(): EventDispatcher {
        if (EventDispatcher.Instance === null) {
            EventDispatcher.Instance = new EventDispatcher();
        }
        return EventDispatcher.Instance;
    }

    private constructor() {

    }

    addEventListner() {

    }

    dispatchEvent() {

    }
}
