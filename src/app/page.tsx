"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function StartingHand() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
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

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  // Function to tokenize JavaScript code into segments for highlighting
  const tokenizeJavaScript = (code: string) => {
    // Create segments with type information
    const commentRegex = /(\/\/.*)/g;
    const stringRegex = /('.*?'|".*?")/g;
    const keywordRegex = /\b(const|let|var|function|return|new|document|addEventListener)\b/g;
    const methodRegex = /\b(getElementById|addEventListener|src|getTime)\b/g;
    const classRegex = /\b(Date)\b/g;
    
    // Split by comments first
    const segments: {text: string, type: string}[] = [];
    let lastIndex = 0;
    let match;
    
    // Find comments
    while ((match = commentRegex.exec(code)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          text: code.substring(lastIndex, match.index),
          type: 'normal'
        });
      }
      segments.push({
        text: match[0],
        type: 'comment'
      });
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < code.length) {
      segments.push({
        text: code.substring(lastIndex),
        type: 'normal'
      });
    }
    
    // Further process each segment that's not a comment
    const processedSegments: {text: string, type: string}[] = [];
    
    segments.forEach(segment => {
      if (segment.type === 'comment') {
        processedSegments.push(segment);
        return;
      }
      
      // Process strings
      const text = segment.text;
      const parts: {text: string, type: string}[] = [];
      lastIndex = 0;
      
      while ((match = stringRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push({
            text: text.substring(lastIndex, match.index),
            type: 'normal'
          });
        }
        parts.push({
          text: match[0],
          type: 'string'
        });
        lastIndex = match.index + match[0].length;
      }
      
      if (lastIndex < text.length) {
        parts.push({
          text: text.substring(lastIndex),
          type: 'normal'
        });
      }
      
      // Process remaining normal text for keywords, methods, classes
      parts.forEach(part => {
        if (part.type !== 'normal') {
          processedSegments.push(part);
          return;
        }
        
        let normalText = part.text;
        normalText = normalText
          .replace(keywordRegex, '<keyword>$1</keyword>')
          .replace(methodRegex, '<method>$1</method>')
          .replace(classRegex, '<class>$1</class>');
        
        // Split by our custom tags
        const tagRegex = /<(keyword|method|class)>(.*?)<\/\1>/g;
        const normalParts: {text: string, type: string}[] = [];
        lastIndex = 0;
        
        while ((match = tagRegex.exec(normalText)) !== null) {
          if (match.index > lastIndex) {
            normalParts.push({
              text: normalText.substring(lastIndex, match.index),
              type: 'normal'
            });
          }
          normalParts.push({
            text: match[2],
            type: match[1]
          });
          lastIndex = match.index + match[0].length;
        }
        
        if (lastIndex < normalText.length) {
          normalParts.push({
            text: normalText.substring(lastIndex),
            type: 'normal'
          });
        }
        
        processedSegments.push(...normalParts);
      });
    });
    
    return processedSegments;
  };

  // Render function for code examples
  const renderCodeExample = (example: { title: string, code: string }, index: number) => {
    // Apply highlighting only to JavaScript example
    const isJavaScript = example.title.includes("JavaScript");
    const segments = isJavaScript ? tokenizeJavaScript(example.code) : null;
    
    return (
      <div key={index}>
        <h3 className="text-xl font-medium mt-6 mb-3">{example.title}</h3>
        <div className="bg-gray-100 p-4 rounded-md mb-4 relative">
          <button 
            className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded p-1 text-xs flex items-center"
            onClick={() => copyToClipboard(example.code, index)}
            aria-label="コードをコピー"
          >
            {copiedIndex === index ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                コピー済み
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                コピー
              </>
            )}
          </button>
          
          {isJavaScript && segments ? (
            <pre className="overflow-auto">
              {segments.map((segment, i) => {
                const style = {
                  color: segment.type === 'comment' ? '#4ade80' :
                         segment.type === 'string' ? '#d97706' :
                         segment.type === 'keyword' ? '#a855f7' :
                         segment.type === 'method' ? '#3b82f6' :
                         segment.type === 'class' ? '#ef4444' : 'inherit'
                };
                return <span key={i} style={style}>{segment.text}</span>;
              })}
            </pre>
          ) : (
            <pre className="overflow-auto">{example.code}</pre>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">麻雀配牌API</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">概要</h2>
        <p className="mb-2">
          この麻雀配牌APIは、麻雀の初期手牌（配牌）をランダムに生成し、画像として返すサービスです。
          ゲーム開発や麻雀アプリケーション、教育用途、統計分析などに利用できます。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">使い方</h2>
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <code>GET /api/starting-hand</code>
        </div>
        <p className="mb-4">
          このエンドポイントにリクエストを送ることで、ランダムな麻雀の配牌を描画した1000x300ピクセルの画像を取得できます。
          パラメータは不要で、リクエストごとに新しいランダムな配牌画像が生成されます。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">レスポンス</h2>
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
        <h2 className="text-2xl font-semibold mb-4">使用例</h2>
        
        {examples.map((example, index) => renderCodeExample(example, index))}
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
        <h2 className="text-2xl font-semibold mb-4">注意事項</h2>
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
