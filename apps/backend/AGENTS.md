# Backend作業ガイド

ルート`AGENTS.md`に加えて、`apps/backend`以下では本書を適用します。

## 責務と構成

ExpressとTypeScriptによるTodo APIです。`src/app.ts`がHTTP境界、`src/todo-store.ts`がインメモリ保存、`src/server.ts`が環境変数の読込みと待受開始、`src/types.ts`がBackend内の型を担当します。永続化、認証、外部サービス接続は現行範囲外です。

## 実装規約

- `createApp`は待受を開始せず、依存を注入可能な状態を維持します。
- 入力はHTTP境界で検証し、エラーは`{ "error": { "code", "message" } }`形式で返します。
- 保存層から返す値は、呼び出し側が内部状態を直接変更できないようにします。
- `PORT`の既定値は`3001`、`CORS_ORIGIN`の既定値は`http://localhost:5173`です。
- API契約の変更はFrontend、`docs/api/`、`apps/backend/docs/api-spec.md`、テストと同期します。

## 検証

- `npm run test --workspace @todo/backend`
- `npm run lint --workspace @todo/backend`
- `npm run build --workspace @todo/backend`

ルート、要求body、成功ステータス、エラーコード、存在しない資源をSupertestで検証します。状態をテスト間で共有せず、各テストで新しいアプリまたはストアを使用します。
