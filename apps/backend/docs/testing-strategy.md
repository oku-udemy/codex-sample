# Backendテスト戦略

## 現行レベル

`apps/backend/tests/`ではVitestとSupertestを使い、実ポートを開かず`createApp()`のHTTP公開動作を検証します。外部サービスや永続DBへ依存しません。

## 追加基準

- エンドポイント追加・変更: メソッド、パス、status、bodyを検証する。
- 入力規則変更: 有効値、境界値、不正な型、欠落値を検証する。
- エラー変更: 機械判定用`code`と利用者向け`message`を検証する。
- Store変更: コピー境界、存在しないID、順序などHTTPテストだけで不明瞭な規則を単体検証する。
- 不具合修正: 可能な限り修正前に失敗する回帰テストを追加する。

テストごとに新しいアプリとTodoStoreを使い、実行順に依存させません。ランダムUUIDそのものへ固定値を期待せず、形式または操作間の一貫性を確認します。

## コマンド

| コマンド                                  | 内容             |
| ----------------------------------------- | ---------------- |
| `npm run test --workspace @todo/backend`  | Backendテスト    |
| `npm run lint --workspace @todo/backend`  | Backend静的解析  |
| `npm run build --workspace @todo/backend` | TypeScriptビルド |

Frontendとの接続契約や主要導線を変えた場合は、ルートから`npm run test:e2e`も実行します。
