interface ObjectWithId {
    id: string;
    [key: string]: any; // Optionally, define additional properties if needed
}

export function isObjectWithIdExist(array: Array<ObjectWithId>, id: string) {
    return array.some(obj => obj.id === id);
}