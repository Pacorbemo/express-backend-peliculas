export function cutArray(array, page = 1){
    const start = 20 * (page - 1);
    const finish = 20 * page;

    return array.slice(start,finish)
}