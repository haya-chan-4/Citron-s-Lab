// src/components/TwitterEmbeds.tsx
'use client'

import Script from 'next/script'
import { useEffect } from 'react'

const TwitterEmbeds = () => {
  useEffect(() => {
    // コンポーネントがマウントされた後に X (Twitter) のウィジェットを再スキャンして初期化
    // widgets.js がロード済みであれば、twttr.widgets.load() が利用可能になります
    if (typeof twttr !== 'undefined' && twttr.widgets && twttr.widgets.load) {
      twttr.widgets.load()
    }
  }, []) // 空の依存配列で初回マウント時のみ実行

  return (
    <Script
      src="https://platform.twitter.com/widgets.js"
      strategy="lazyOnload"
    />
  )
}

export default TwitterEmbeds
