export interface Group {
    [key: string]: Lesson[];
}
export interface Lesson {
    id: string;
    file: string;
    title: string;
    lesson?: number;
}