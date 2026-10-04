# リポジトリ作業ガイド

## 目的と適用範囲

このリポジトリは、開発フローを検証するためのTodoサンプルです。npm workspacesでReact FrontendとExpress Backendを管理します。本書はリポジトリ全体に適用し、下位ディレクトリの`AGENTS.md`がある場合は、より具体的な規約を併用します。

## 構成

- `apps/frontend/`: React 19、TypeScript、ViteによるUI。
- `apps/backend/`: Express、TypeScriptによるインメモリTodo API。
- `e2e/`: PlaywrightによるブラウザーE2Eテスト。
- `docs/`: リポジトリ横断の要件、アーキテクチャ、計画、運用、リリース文書。
- `plugins/dev-workflow/`: このリポジトリで使うCodex PluginとSkills。
- `.agents/plugins/`: リポジトリ内Pluginカタログ。
- `.codex/`: Pluginを有効化するリポジトリ固有のCodex設定。

機能やドメイン単位の小さなモジュールを優先し、FrontendとBackendの内部実装を直接共有しません。API契約を変える場合は両者と文書を同じ変更単位で更新します。

## 標準コマンド

リポジトリルートから実行します。

- `npm run dev`: FrontendとBackendを同時起動。
- `npm run build`: 全workspaceをビルド。
- `npm test`: 全workspaceのVitestを実行。
- `npm run test:e2e`: Playwright E2Eを実行。
- `npm run lint`: 全workspaceをESLintで検査。
- `npm run format:check`: Prettierの形式を検査。
- `docker compose up --build`: コンテナでローカル開発環境を起動。

変更範囲に合う最小の検証を開発中に実行し、完了時は原則として`npm run lint`、`npm test`、`npm run build`を実行します。利用者導線やFrontend・Backend間の契約を変更した場合は`npm run test:e2e`も実行します。実行できない検証は理由と未確認範囲を明記します。

## 開発フロー

要件定義、作業分解、設計、実装、リリース準備、障害対応の標準手順は`DEVELOPMENT.md`を参照します。現在の依頼に関係する章だけを読み、Skillの具体的な判断と手順は該当する`SKILL.md`を正とします。

1. 依頼、原本、既存実装を確認し、目的、対象外、受け入れ条件を整理します。
2. 影響する要件・設計・API・テストを特定し、複数領域にまたがる変更は`docs/plans/`へ計画を作ります。
3. 不具合修正と動作変更では、可能な限り先に失敗を再現するテストを追加します。
4. 小さな単位で実装し、該当テストを継続して実行します。
5. コード、設定、文書の整合性を確認し、標準コマンドで検証します。
6. リリース対象なら`docs/releases/release-checklist.md`を使って確認します。

要件や設計が曖昧で、実装結果が大きく変わる場合だけ利用者へ確認します。確定済みの業務要件を推測で書き換えず、差異は提案または未決事項として記録します。

## 文書の正本と同期

- Word／Excelの業務原本は`docs/requirements/business/<案件名>/source/`へ変更せず保存します。
- 原本を読み取りやすく正規化したMarkdownは同案件の`extracted/`へ置き、原本ファイル名、版、抽出日、抽出上の注意を記録します。
- 実装可能なシステム要件の正本は`docs/requirements/system/<案件名>.md`です。
- 用語は`docs/requirements/glossary.md`、横断設計は`docs/architecture/`、API契約は`docs/api/`と各アプリの設計文書を参照します。
- 実装変更により記載が古くなる場合は、関連文書を同じ変更で更新します。原本と実装可能要件に矛盾がある場合は、原本を変更せず差異を明示します。

## コーディングとテスト

TypeScriptは既存のESLint、Prettier、`tsconfig`に従います。スペース、末尾改行、`kebab-case`の一般ファイル名、`PascalCase`の型・Reactコンポーネント、`camelCase`の関数・変数を基本とします。公開動作、境界値、異常系をテストし、テストは決定的かつ外部サービス非依存にします。

## セキュリティと変更管理

秘密情報、認証情報、実値入り`.env`をコミットしません。環境変数は無害化した`.env.example`に記載し、依存関係は`package-lock.json`で固定します。無関係な変更を混ぜず、コミット件名は「Todo追加時の入力検証を追加」のように簡潔で具体的にします。PRには変更概要、検証結果、関連Issue、設定・移行の有無を記載し、UI変更には画像または動画を添付します。
