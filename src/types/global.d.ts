// global.d.ts (または src/types/global.d.ts)
// Twitter のウィジェットスクリプトがグローバルに定義する twttr オブジェクトの型定義

declare global {
  interface Window {
    twttr?: {
      // twttr はスクリプトロード前は undefined の可能性があるため ? をつける
      widgets?: {
        // widgets も同様
        load: (element?: HTMLElement) => void // load メソッドの型
      }
    }
  }
  // グローバル変数 twttr を Window インターフェースの twttr プロパティとして宣言
  const twttr: Window['twttr']
}

export {} // このファイルをモジュールとして扱うために必要
