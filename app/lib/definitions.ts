export interface Idea {
    id: number,
    title: string,
    description: string,
};

export type IdeaWithCreator = Idea & { username: string };