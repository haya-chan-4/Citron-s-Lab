// import ArticleCard from '@/components/Body/Main/ArticleCard';
import { client } from '@/libs/client'; // microCMSクライアントのパスを確認
import Link from 'next/link';

// microCMSから返されるブログ記事の型定義
// (他のファイルで定義済みの場合は import してもOK)
interface Blog {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  // 他に必要なプロパティがあれば追加
  category?: Category; // カテゴリー情報も含まれる場合 (任意)
}

// microCMSから返されるカテゴリーの型定義
// (他のファイルで定義済みの場合は import してもOK)
interface Category {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name: string;
  // 他に必要なプロパティがあれば追加
}

// Propsの型定義 (URLパラメータ)
interface CategoryPageProps {
  params: {
    id: string; // [id]部分が string として渡される
  };
}



// 静的生成のためのパスを生成 (旧 getStaticPaths)
export const generateStaticParams = async () => {
  try {
    console.log("Generating static params for categories...");
    const data = await client.get<{ contents: Category[] }>({ endpoint: "category" }); // 型を指定
    console.log("Fetched categories for static params:", data.contents.length);

    const paths = data.contents.map((content) => ({
      id: content.id, // オブジェクトのキーをパラメータ名 'id' に合わせる
    }));
    console.log("Generated paths:", paths);
    return paths;

  } catch (error) {
    console.error("Error fetching categories for static params:", error);
    return []; // エラー時は空配列を返す
  }
};


// カテゴリー別ブログ一覧ページコンポーネント (Server Component)
const CategoryIdPage = async ({ params }: CategoryPageProps) => {
  const categoryId = params.id;


  // 特定カテゴリーのブログ記事を取得
  let blog: Blog[] = [];
  try {
    console.log(`Workspaceing blog data for category: ${categoryId}`);
    const data = await client.get<{ contents: Blog[] }>({ // 型を指定
      endpoint: "blog",
      queries: { filters: `category[equals]${categoryId}` },
    });
    blog = data.contents;
    console.log(`Workspaceed ${blog.length} blog posts for category ${categoryId}`);
  } catch (error) {
    console.error(`Error fetching blog data for category ${categoryId}:`, error);
    // エラーが発生した場合、blog は初期値の空配列のままになる
    // 必要に応じてエラーページを表示するなどの処理を追加できます
    // 例:notFound(); // Next.js 13.4 以降の機能
  }


  // カテゴリーに紐付いたコンテンツがない場合に表示
  if (blog.length === 0) {
    // データ取得エラーの場合もここに来る可能性がある
    console.log(`No blog content found for category: ${categoryId}`);
    return <div>このカテゴリーのブログ記事はありません。</div>;
  }

  // ブログ記事一覧を表示
  return (
    <div className='flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 py-10 gap-8 animate-fadeIn'>
      {/* 必要であればカテゴリー名などを表示 */}
      {/* <h1>Category: {categoryId}</h1> */}
      <h2 className="text-md font-bold mb-8">記事一覧</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-1 gap-4">
        {blog.map((post) => ( // 変数名を post に変更 (blog 配列の要素なので)
          <li key={post.id}>
            <Link href={`/blog/${post.id}`}>{post.title}</Link>
          </li>
          // <ArticleCard key={post.id} blog={{
          //   category: '',
          //   id: '',
          //   thumbnail: {
          //     url: ''
          //   },
          //   title: '',
          //   publishedAt: undefined
          // }}/>
        ))}
      </ul>
    </div>
  );
};

export default CategoryIdPage;

// データ再生成の設定 (任意)
// export const revalidate = 60; // 例: 60秒ごとに再生成
