# Backend API仕様

公開契約、データ形式、ステータス、エラーコードは`docs/api/todo-api.md`を正本とします。

## Backend側の入力規則

- POSTの`title`は文字列だけを受け付け、前後空白を除去します。空文字列は`400 INVALID_TITLE`です。
- PATCHの`completed`は真偽値だけを受け付けます。文字列や数値は`400 INVALID_COMPLETED`です。
- PATCHまたはDELETEの`id`が存在しない場合は`404 TODO_NOT_FOUND`です。
- 未定義の`/api`配下は`404 NOT_FOUND`です。
- JSON解析を含む予期しないエラーは共通ハンドラーで`500 INTERNAL_ERROR`へ変換します。

## 応答整合性

作成時の`id`はNode.jsの`randomUUID()`で生成します。作成時の`completed`は常に`false`です。一覧はストアの現在順を維持し、ページングや並べ替えを行いません。削除成功時はbodyなしの204を返します。

契約変更時は`docs/api/README.md`の同期対象をすべて更新します。
