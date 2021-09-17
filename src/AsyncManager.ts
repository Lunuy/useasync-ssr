


export class AsyncManager {
    private promises: Promise<any>[];
    private caches: any[]; 
    public loaded: boolean;
    private currentIndex: number;
    public constructor(private readonly ssrMode: boolean = true) {
        this.promises = [];
        this.caches = [];
        this.loaded = false;
        this.currentIndex = 0;
    }

    public async load() {
        this.caches = await Promise.all(this.promises);
        this.loaded = true;
        return;
    }
    
    private addPromise(promise: Promise<any>) {
        this.promises.push(promise);
        return promise;
    }
    private getCache() {
        if(this.currentIndex === this.caches.length)
            throw new Error("You can't use AsyncManager for SSR multiple times.");
        return this.caches[this.currentIndex++];
    }
}