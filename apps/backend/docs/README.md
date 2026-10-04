# Backend設計ドキュメント

## 目的

`apps/backend`のAPI、内部構成、保存方式、設定、テスト方針を実装と対応付けます。

## 技術スタック

| 分類       | 採用技術                       |
| ---------- | ------------------------------ |
| HTTP       | Express 4                      |
| 言語・実行 | TypeScript 5.7、Node.js 20以上 |
| 開発実行   | tsx                            |
| テスト     | Vitest、Supertest              |
| 設定       | dotenv、環境変数               |

バージョンの正本は`apps/backend/package.json`とルート`package.json`です。

## 文書

1. [API仕様](api-spec.md)
2. [アーキテクチャ](architecture.md)
3. [テスト戦略](testing-strategy.md)

横断的なHTTP契約は`docs/api/todo-api.md`を正本とし、本ディレクトリはBackend側の実現方法を補足します。
