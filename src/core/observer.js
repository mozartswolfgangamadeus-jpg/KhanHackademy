export class PageObserver {
    constructor(callback) {
        this.callback = callback;
        this.observer = null;
        this.timer = null;
    }

    start() {
        if (this.observer || !document.body) return;

        this.observer = new MutationObserver(() => {
            this.schedule();
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        this.schedule();
    }

    schedule() {
        clearTimeout(this.timer);
        this.timer = setTimeout(this.callback, 400);
    }

    stop() {
        this.observer?.disconnect();
        clearTimeout(this.timer);
        this.observer = null;
    }
}
