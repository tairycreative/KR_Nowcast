export async function mapWithLimit(items, limit, mapper) {
    const ret = new Array(items.length);
    let i = 0;
    const workers = Array(Math.min(limit, items.length))
        .fill(0)
        .map(async () => {
            while (i < items.length) {
                const idx = i++;
                ret[idx] = await mapper(items[idx], idx);
            }
        });
    await Promise.all(workers);
    return ret;
}

export function pLimit(n) {
    let i = 0;
    return async function run(list, fn) {
        const out = new Array(list.length);
        async function worker() {
            while (i < list.length) {
                const idx = i++;
                out[idx] = await fn(list[idx], idx);
            }
        }
        await Promise.all(Array(Math.min(n, list.length)).fill(0).map(worker));
        return out;
    };
}