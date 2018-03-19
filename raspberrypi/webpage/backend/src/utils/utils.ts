/* Retrun a pretty version of date */
export function FormatDate(epoch?: number): string {
    let d = (epoch === undefined) ? new Date() : new Date(epoch);
    let s = '';
    const pad = (n: number, t: string = ''): string => { return n < 10 ? `0${n}${t}` : `${n}${t}` }
    s += pad(d.getMonth() + 1, '/');
    s += pad(d.getDate(), ' ');
    s += pad(d.getHours(), ':');
    s += pad(d.getMinutes(), ':');
    s += pad(d.getSeconds());
    //s += `,${d.getMilliseconds()}`;
    return s;
}