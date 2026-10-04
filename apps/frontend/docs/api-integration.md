# Frontend API連携仕様

## 目的

FrontendからTodo APIを利用する際の接続設定、要求、応答、エラー処理を定義します。これはFrontend視点の接続契約であり、Backendの内部実装は対象としません。

## 対象範囲

- APIベースURLの決定
- Todoの一覧取得、追加、完了状態更新、削除
- 成功応答とエラー応答のFrontendでの扱い
- Frontend内の通信型

## 現行仕様

### 接続先

APIベースURLはビルド時の環境変数`VITE_API_BASE_URL`から取得します。未設定の場合は`http://localhost:3001`を使用します。

| 環境               | 設定例                            |
| ------------------ | --------------------------------- |
| 通常のローカル開発 | `http://localhost:3001`（既定値） |
| Playwright E2E     | `http://127.0.0.1:3001`           |

パスはベースURLへ直接連結するため、設定値の末尾には`/`を付けない前提です。

### データ型

```ts
interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}
```

`api.ts`は受信JSONをこれらの型として扱いますが、実行時のスキーマ検証は行いません。

### エンドポイント

| 操作         | メソッド・パス          | 要求body                   | 成功応答        | Frontendでの利用           |
| ------------ | ----------------------- | -------------------------- | --------------- | -------------------------- |
| 一覧取得     | `GET /api/todos`        | なし                       | `200 Todo[]`    | 一覧全体を置き換える       |
| 追加         | `POST /api/todos`       | `{ "title": string }`      | `201 Todo`      | 一覧末尾へ追加する         |
| 完了状態更新 | `PATCH /api/todos/:id`  | `{ "completed": boolean }` | `200 Todo`      | 同じ`id`の要素を置き換える |
| 削除         | `DELETE /api/todos/:id` | なし                       | `204`、bodyなし | 同じ`id`の要素を除外する   |

bodyがある要求では`Content-Type: application/json`を設定します。認証ヘッダーやCookieの明示的な送信設定はありません。

### 成功応答の処理

- `204 No Content`は`undefined`として返します。
- 204以外の成功応答はJSONとして読み取ります。
- レスポンス型の妥当性はTypeScriptの型アサーションに依存します。

### エラー応答の処理

HTTPステータスが成功範囲外の場合、次の順序で表示用メッセージを決定して`Error`をthrowします。

1. 応答をJSONとして読み取ります。
2. `error.message`が存在する場合は、その値を使用します。
3. JSONとして読めない、またはメッセージがない場合は「通信に失敗しました。時間をおいて再度お試しください。」を使用します。

`error.code`は型として受け取りますが、現行Frontendでは分岐に使用しません。ネットワーク障害やJSON解析失敗など、`fetch`または成功応答の読み取りで発生した例外はそのまま呼び出し元へ伝播します。

### 型の所有

FrontendとBackendはそれぞれ独立した`types.ts`に同形の`Todo`と`ApiErrorBody`を定義しています。ビルド時の型共有や、両者の一致を検証する仕組みはありません。このため、API契約変更時は両方の型と本書を同じ変更単位で更新する必要があります。

## 制約

- タイムアウト、再試行、要求キャンセルは実装していません。
- 応答データの実行時検証は行いません。
- APIベースURLの形式検証や末尾スラッシュの正規化は行いません。
- エラーコードごとのFrontend固有表示はありません。
- 通信クライアントはブラウザー標準の`fetch`に固定されています。

## 改善候補

- OpenAPIなどを正本として型とクライアントを生成する。
- 契約テストまたは実行時スキーマ検証を導入する。
- タイムアウト、キャンセル、必要な操作に限定した再試行方針を定義する。
- エラーコードに応じた回復操作や表示を提供する。
- ベースURLを正規化し、設定誤りを起動時に検出する。

これらは未実装であり、現行の通信契約には含めません。

## 関連実装

- `apps/frontend/src/api.ts`
- `apps/frontend/src/types.ts`
- `apps/backend/src/app.ts`
- `apps/backend/src/types.ts`
- `playwright.config.ts`
