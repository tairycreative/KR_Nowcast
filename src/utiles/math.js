// 표준편차 & 퍼센트 변화 계산
export function stdev(arr) {
    if (!arr || arr.length < 2) return 0;
    const m = arr.reduce((s, x) => s + x, 0) / arr.length;
    const v = arr.reduce((s, x) => s + (x - m) * (x - m), 0) / Math.max(1, arr.length - 1);
    return Math.sqrt(Math.max(v, 1e-6));
}

export function safePct(last, prev) {
    return last != null && prev != null && prev !== 0 ? ((last - prev) / prev) * 100 : null;
}