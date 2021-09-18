

export class AsyncManager {
    private promises: Promise<any>[];
    private caches: any[];
    private currentIndex: number;
    public readonly isClientMode;
    public constructor(isClientMode: boolean = false) {
        this.promises = [];
        this.caches = [];
        this.currentIndex = 0;
        this.isClientMode = isClientMode;
    }

    // SERVER SIDE
    public async load() {
        this.caches = await Promise.all(this.promises);
        return this.caches;
    }
    
    // SERVER SIDE (INTERNAL)
    private addPromise(promise: Promise<any>) {
        this.promises.push(promise);
        return promise;
    }

    // CLIENT SIDE (INTERNAL)
    private setCaches(caches: any[]) {
        this.caches = caches;
    }

    // BOTH SIDE (INTERNAL)
    private getCache() {
        const cache = this.caches[this.currentIndex];
        this.currentIndex++;

        return cache;
    }
    private isCacheExists() {
        return this.currentIndex !== this.caches.length;
    }
}