export interface Idea {
    id: number,
    title: string,
    description: string,
};

export type IdeaWithCreatorId = Idea & { creator: string };
export type IdeaWithCreatorUsername = Idea & { username: string };