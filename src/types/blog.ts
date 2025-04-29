// types/blog.ts

export type Blog = {
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
  category: {
    name: string
  }
  props: string
  id: string;
  title: string;
  body: string;
  eyecatch?: {
    url: string;
    height: number;
    width: number;
  };
  publishedAt?: string;
  updatedAt?: string;
  fields: {
    id: string
    title: string
  }
};
