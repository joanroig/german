export interface Group {
    [key: string]: Lesson[];
}
interface Lesson {
    file: string;
    title: string;
    lesson?: number;
}