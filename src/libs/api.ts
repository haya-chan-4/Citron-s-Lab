// src/libs/api.ts (例: microCMSクライアントの近く)
import { client } from './client'; // microCMSクライアントのパス
import type { Blog } from '@/types/blog';
import { PER_PAGE } from '@/constants/pagination'; // PER_PAGEをインポート

interface GetPaginatedBlogsParams {
  endpoint: 'blog'; // 他のエンドポイントが必要なら追加
  limit?: number;
  offset?: number;
  queries?: {
    filters?: string;
    [key: string]: unknown; // その他のクエリパラメータ
  };
  fields?: string;
}

export async function getPaginatedBlogs({
  endpoint,
  limit = PER_PAGE, // デフォルト値を設定
  offset = 0,
  queries,
  fields = 'id,title,publishedAt,thumbnail,category', // デフォルトのフィールド
}: GetPaginatedBlogsParams) {
  const data = await client.get<{
    contents: Blog[];
    totalCount: number;
  }>({
    endpoint,
    queries: {
      limit,
      offset,
      fields,
      ...queries, // 追加のクエリ（filtersなど）をマージ
    },
  });
  return { blogs: data.contents, totalCount: data.totalCount };
}
