# daba-timetable-public

## 注意
このリポジトリは公開用のため、元のリポジトリから重要なファイルを一部除外しています。\
また、ここにある内容は、実際に運用・最新の内容やファイル構成とは異なる場合があります。\

## 概要

群馬大学の学生の履修管理をより快適にするアプリ「だばの時間割」。\
教務システム、PDF資料、シラバス、既存の時間割アプリが担っている機能を1つにまとめ、群大生に最適化されたユーザー体験を提供する。

<img width="960" alt="スクリーンショット１" src="https://github.com/user-attachments/assets/59b5ecc7-f371-4769-b768-2939607ab306" />

<img width="959" alt="スクリーンショット２" src="https://github.com/user-attachments/assets/9a9b9de3-8a73-478d-b560-8d9ace4a7da2" />

## 機能一覧

## 技術スタック

### 教務システムのスクレイピング（別レポジトリにて管理）

- Python
  - Selenium
  - Pandas

### データベース

- supabase

### Webアプリケーション

- Next.js (TypeScript & React)
- App Routing

### パッケージ管理

- pnpm

### APIサーバ

- TypeScript

### ライブラリ

- Jotai
- Material UI
- dnd kit
- pako
- supabase
- nanoid
- qrcode.react
- reqct-window

## コミットには以下のプリフィックスをつける

- feat: 新しい機能
- fix: バグの修正
- docs: ドキュメントのみの変更
- style: 空白、フォーマット、セミコロン追加など
- refactor: 仕様に影響がないコード改善(リファクタ)
- clean: 不要なコード、ファイル、コメント、デッドコードなどの削除や整理 (refactorの一部だが、特に削除や整理に特化)
- perf: パフォーマンス向上関連
- test: テスト関連
- chore: ビルド、補助ツール、ライブラリ関連

コミットメッセージは基本的に小文字の英語で始めることとする。
動詞の場合は原形を使う。  
例　feat: add courseDetailModal component

## src内ディレクトリ構成（仮）

```
.
├── app              ... ルーティングに関するコンポーネント
│   └── api          ... APIルート
├── components       ... ロジックがない共通コンポーンネント。
├── constants        ... 定数
├── features         ... ロジック + コンポーネントをまとめたもの
├── hooks            ... 共通ロジックの内、React Hooksが「ある」もの
├── utils            ... 共通ロジックの内、React Hooksが「ない」もの
└── type             ... 共通な型を定義
```

※ここでいう「共通」とは大枠の機能が異なる複数のコンポーネントから呼び出されることを指す。

## 導入

### ルートディレクトリに`.env.local`ファイルを作成し、環境変数を設定する

例：

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_GA_MEASUREMENT_ID=your-GA-measurment-id
```

###

### 依存関係をインストールする

```
pnpm install
```

### 開発サーバーを起動する

```
pnpm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) からアプリを確認できる
