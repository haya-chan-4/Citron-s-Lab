// src/utils/pagination.ts
import { PER_PAGE } from '@/constants/pagination' // PER_PAGEをインポート

interface GetPaginationParamsArgs {
  pageParam: string | string[] | undefined // params.id または searchParams.page
  perPage?: number // PER_PAGEを引数で渡すことも可能
}

interface PaginationParams {
  currentPage: number
  offset: number
}

export function getPaginationParams({
  pageParam,
  perPage = PER_PAGE, // デフォルト値は共通定数から
}: GetPaginationParamsArgs): PaginationParams {
  const page = typeof pageParam === 'string' ? pageParam : '1' // 配列の場合は最初の要素を使うか、エラーハンドリング

  const currentPage = parseInt(page, 10)
  // 必要に応じて isNaN や currentPage < 1 のチェックとエラーハンドリングを追加

  const offset = (currentPage - 1) * perPage

  return { currentPage, offset }
}
