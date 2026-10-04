# Todo API契約

## 基本情報

- ローカル既定URL: `http://localhost:3001`
- Content-Type: bodyを持つ要求・応答は`application/json`
- 認証: なし
- 永続性: なし。サーバー再起動でTodoは失われる

## データ形式

```json
{
  "id": "UUID文字列",
  "title": "Todoタイトル",
  "completed": false
}
```

エラーは次の共通形式です。

```json
{
  "error": {
    "code": "MACHINE_READABLE_CODE",
    "message": "利用者向けメッセージ"
  }
}
```

## エンドポイント

| 操作     | メソッド・パス          | 要求body                   | 成功         | 主な失敗                                      |
| -------- | ----------------------- | -------------------------- | ------------ | --------------------------------------------- |
| 一覧     | `GET /api/todos`        | なし                       | `200 Todo[]` | `500 INTERNAL_ERROR`                          |
| 作成     | `POST /api/todos`       | `{ "title": string }`      | `201 Todo`   | `400 INVALID_TITLE`                           |
| 完了更新 | `PATCH /api/todos/:id`  | `{ "completed": boolean }` | `200 Todo`   | `400 INVALID_COMPLETED`、`404 TODO_NOT_FOUND` |
| 削除     | `DELETE /api/todos/:id` | なし                       | `204`        | `404 TODO_NOT_FOUND`                          |

`title`はサーバーで前後空白を除去し、空になった値を拒否します。PATCHは完了状態だけを更新し、タイトル編集には使用しません。未知の`/api`配下のパスは`404 NOT_FOUND`を返します。

## CORS

許可する単一オリジンはBackendの`CORS_ORIGIN`で指定し、未設定時は`http://localhost:5173`です。
