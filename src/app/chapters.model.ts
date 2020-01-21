export interface Chapter {
    [key: string]: Lesson[];
}

interface Lesson {
    lessonId: number;
    file: string;
    title: string;
}
