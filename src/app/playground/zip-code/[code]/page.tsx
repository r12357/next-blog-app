"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const Page: React.FC = () => {
  const endpoint = "https://zipcloud.ibsnet.co.jp/api/search";
  const { code } = useParams() as { code: string };
  const [response, setResponse] = useState<string>("APIからデータを取得中...");

  useEffect(() => {
    const fetchAddressFromZipCode = async () => {
      // ウェブAPIにGETリクエストを送信してレスポンスを取得
      const requestUrl = `${endpoint}?zipcode=${code}`;
      const response = await fetch(requestUrl, {
        method: "GET",
        cache: "no-store",
      });
      console.log("ウェブAPIからデータを取得しました．");

      // レスポンスからJSON形式でデータを取得して整形して表示
      const parsedData = await response.json();
      setResponse(JSON.stringify(parsedData, null, 2));
    };

    fetchAddressFromZipCode(); // 関数を実行
  }, [code]);

  return (
    <main>
      <div className="mb-5 text-2xl font-bold">{`郵便局${code}の検索`}</div>
      <div className="space-y-3">
        <div>実行結果</div>
        <pre className="rounded-md bg-green-100 p-3 text-sm">{response}</pre>
      </div>
    </main>
  );
};

export default Page;
