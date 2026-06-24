export interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}

export type NewBlogPost = Omit<BlogPost, "id">;

