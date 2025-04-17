"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import JSCode from '@/components/elements/Code/JSCode';
import H2 from '@/components/elements/Text/H2';

export default function StartingHand() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [examples, setExamples] = useState([
    {
      title: "HTMLでの使用例",
      code: `<img src="https://your-domain.com/api/starting-hand" alt="麻雀の配牌" />`
    },
    {
      title: "JavaScriptでの動的読み込み例",
      code: `// 新しい配牌画像をボタンクリックで読み込む例
document.getElementById('newHandBtn').addEventListener('click', () => {
  const img = document.getElementById('handImage');
  // キャッシュ回避のためのクエリパラメータを追加
  img.src = 'https://your-domain.com/api/starting-hand?' + new Date().getTime();
});`
    },
    {
      title: "cURLでの使用例",
      code: `curl -X GET "https://your-domain.com/api/starting-hand" --output mahjong_hand.png`
    }
  ]);

  useEffect(() => {
    // Add timestamp to avoid caching issues
    const url = `/api/starting-hand?t=${new Date().getTime()}`;
    setImageUrl(url);
    setIsLoading(false);

    // Update examples with the actual domain
    if (typeof window !== 'undefined') {
      const domain = window.location.origin;
      setExamples(prev => prev.map(example => ({
        ...example,
        code: example.code.replace(/https:\/\/your-domain\.com/g, domain)
      })));
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">麻雀配牌API</h1>
      <section className="mb-8">
        <H2>概要</H2>
        <p className="mb-2">
          この麻雀配牌APIは、麻雀の初期手牌（配牌）をランダムに生成し、画像として返すサービスです。
          ゲーム開発や麻雀アプリケーション、教育用途、統計分析などに利用できます。
        </p>
      </section>

      <section className="mb-8">
        <H2>使い方</H2>
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <code>GET /api/starting-hand</code>
        </div>
        <p className="mb-4">
          このエンドポイントにリクエストを送ることで、ランダムな麻雀の配牌を描画した1000x300ピクセルの画像を取得できます。
          パラメータは不要で、リクエストごとに新しいランダムな配牌画像が生成されます。
        </p>
      </section>

      <section className="mb-8">
        <H2>レスポンス</H2>
        <p className="mb-2">
          APIは1000x300ピクセルのサイズの画像ファイルを返します。画像には麻雀の配牌（通常13枚）が描画されています。
        </p>
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <p className="italic text-gray-600 text-center mb-2">（画像サンプル）</p>
          {isLoading ? (
            <div className="border border-dashed border-gray-400 w-full h-0 pb-[30%] relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500">画像を読み込み中...</p>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-0 pb-[30%]">
              <Image
                src={imageUrl || '/placeholder.png'}
                alt="麻雀の配牌サンプル"
                className="border border-gray-300"
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 1200px) 100vw, 1000px"
              />
            </div>
          )}
          <div className="mt-4 flex justify-center">
            <a 
              href="/api/starting-hand" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded inline-flex items-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              APIを直接試す
            </a>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <H2>使用例</H2>

        {examples.map((example, idx) => (
          <JSCode code={example.code} key={idx}/>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">技術仕様</h2>
        <ul className="list-disc pl-6">
          <li className="mb-2">画像サイズ: 1000x300 ピクセル</li>
          <li className="mb-2">画像形式: PNG</li>
          <li className="mb-2">内容: ランダムに選ばれた麻雀の配牌（13枚）</li>
          <li className="mb-2">更新頻度: リクエストごとに新しい配牌が生成されます</li>
        </ul>
      </section>

      <section className="mb-8">
        <H2>注意事項</H2>
        <ul className="list-disc pl-6">
          <li className="mb-2">このAPIは教育・研究・個人利用目的で自由に使用できます</li>
          <li className="mb-2">商用利用の場合は、お問い合わせください</li>
          <li className="mb-2">大量のリクエストはサーバー負荷の観点からご遠慮ください</li>
          <li className="mb-2">画像のキャッシュを防ぐため、動的に読み込む場合はクエリパラメータを追加することをお勧めします</li>
        </ul>
      </section>

      <footer className="border-t pt-6 text-sm text-gray-600">
        <p>© {new Date().getFullYear()} 麻雀配牌API. All rights reserved.</p>
      </footer>
    </div>
  );
}
