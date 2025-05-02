// types/blog.ts
import { Category } from "@/types/category";

export interface Blog  {
  publishedAt: string;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
  category: string
  props: string
  id: string;
  title: string;
  body: string;
  eyecatch?: {
    url: string;
    height: number;
    width: number;
  };

  updatedAt?: string;
  fields: {
    id: string
    title: string
  }
};
