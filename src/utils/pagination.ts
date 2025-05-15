// src/utils/pagination.ts
import { PER_PAGE } from '@/constants/pagination' // ページあたりの表示件数

interface GetPaginationParamsArgs {
  // pageParam: searchParams.page (string | string[] | undefined) または params.page (string | undefined)
  // この関数が受け取る可能性のある型を反映します
  pageParam: string | string[] | undefined
  perPage?: number // ページあたりの表示件数
}

interface PaginationParams {
  currentPage: number // 現在のページ番号（数値、常に1以上）
  offset: number // 取得開始位置（オフセット）
}

export function getPaginationParams({
  pageParam, // ページ番号パラメータ
  perPage = PER_PAGE, // ページあたりの表示件数
}: GetPaginationParamsArgs): PaginationParams {
  let pageStr: string | undefined

  // pageParam の型をチェックし、文字列のページ番号を取得
  if (Array.isArray(pageParam)) {
    // pageParam が配列の場合、最初の要素を文字列として使用（または適切にエラーハンドリング）
    pageStr = pageParam.length > 0 ? pageParam[0] : undefined
  } else {
    // pageParam が文字列または undefined の場合
    pageStr = pageParam
  }

  // 取得した文字列のページ番号を整数に変換
  const parsedPage = parseInt(pageStr ?? '1', 10) // 文字列がない場合はデフォルトで '1' をパース

  // ★ 変換結果が NaN または 1 未満の場合は、デフォルトのページ番号 1 を使用 ★
  const currentPage = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage

  // オフセットを計算
  const offset = (currentPage - 1) * perPage

  // 現在のページ番号とオフセットを返す
  return { currentPage, offset }
}
