# Frontend設計ドキュメント

## 目的

`apps/frontend`の公開動作、画面、内部構成、API連携、テスト方針を、実装と対応付けて参照できるようにします。

## 対象範囲

- Reactで構築された単一画面のTodo UI
- Todo APIとのHTTP通信
- Frontendの単体・結合テストと、リポジトリ全体のE2Eテスト
- Frontendに影響する技術判断の記録

Backendの保存方式やサーバー内部構造は対象外です。

## 技術スタック

| 分類                 | 採用技術                       |
| -------------------- | ------------------------------ |
| UI                   | React 19                       |
| 言語                 | TypeScript 5.7                 |
| 開発・ビルド         | Vite 6                         |
| コンポーネントテスト | Vitest、Testing Library、jsdom |
| E2Eテスト            | Playwright                     |
| 静的解析・整形       | ESLint、Prettier               |

バージョンの正本は`apps/frontend/package.json`およびルートの`package.json`です。

## 推奨閲覧順

1. [機能仕様](functional-spec.md) — 利用者に提供する動作
2. [UI仕様](ui-spec.md) — 表示、操作、アクセシビリティ
3. [アーキテクチャ](architecture.md) — モジュールの責務とデータフロー
4. [API連携仕様](api-integration.md) — Backendとの通信契約
5. [テスト戦略](testing-strategy.md) — 品質を担保する範囲と方法
6. [ADR運用](adr/README.md) — 今後の重要な設計判断

## 実装との対応

| 関心事                   | 主な実装                                  | 正本文書                          |
| ------------------------ | ----------------------------------------- | --------------------------------- |
| 画面と状態管理           | `apps/frontend/src/App.tsx`               | [機能仕様](functional-spec.md)    |
| 表示と操作               | `apps/frontend/src/App.tsx`、`styles.css` | [UI仕様](ui-spec.md)              |
| エントリーポイントと責務 | `apps/frontend/src/main.tsx`ほか          | [アーキテクチャ](architecture.md) |
| HTTP通信と型             | `apps/frontend/src/api.ts`、`types.ts`    | [API連携仕様](api-integration.md) |
| 自動テスト               | `apps/frontend/tests/`、`e2e/`            | [テスト戦略](testing-strategy.md) |

## 現行仕様

Frontendは1つの`App`コンポーネントでTodoの取得、追加、完了状態の切り替え、削除を提供します。状態はReactのローカルstateで管理し、永続化はBackendに委ねます。

## 改善候補

機能やチーム規模が拡大した場合は、状態管理、デザインシステム、運用手順を独立した文書へ分割します。分割の判断条件は[アーキテクチャ](architecture.md)に記載します。

## 関連実装

- `apps/frontend/src/`
- `apps/frontend/tests/`
- `e2e/`
- `apps/frontend/package.json`
