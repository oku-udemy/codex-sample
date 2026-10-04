# Todo 開発フローサンプル

TypeScript、React、Vite、Expressで構成したTodoアプリと、Codexを使った開発フローを検証するためのモノレポです。npm workspacesでfrontendとbackendを管理します。Todoはバックエンドのメモリ上に保存されるため、再起動すると消えます。

要件受領から設計、実装、レビュー、リリース準備までの標準手順は[DEVELOPMENT.md](DEVELOPMENT.md)を参照してください。

## 必要な環境

ローカルで直接起動する場合:

- Node.js 20以上
- npm 10以上

コンテナで起動する場合:

- Docker Desktopなど、Docker Compose v2を利用できる環境

## npmでのセットアップ

```bash
npm install
copy apps\frontend\.env.example apps\frontend\.env
copy apps\backend\.env.example apps\backend\.env
npm run dev
```

macOSまたはLinuxでは `copy` の代わりに `cp` を使用してください。初期値のままなら `.env` を作成せずに起動することもできます。

- frontend: <http://localhost:5173>
- backend: <http://localhost:3001>

## Dockerでのセットアップ

ローカルにNode.jsを用意せず、ホットリロード対応の開発サーバーを起動できます。

```bash
copy .env.example .env
npm run docker:up
```

`.env` を省略した場合は `compose.yaml` の既定値を使用します。ソースコードはコンテナへbind mountされ、frontendとbackendの依存関係はそれぞれDockerのnamed volumeに保持されます。

```bash
npm run docker:logs
npm run docker:down
```

ポートを変更するときはルートの `.env` で `FRONTEND_PORT`、`BACKEND_PORT`、`VITE_API_BASE_URL`、`CORS_ORIGIN` を対応させて変更してください。`VITE_API_BASE_URL` はコンテナ間通信用URLではなく、ブラウザから到達できるバックエンドURLを指定します。

## コマンド

| コマンド               | 内容                                     |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | frontendとbackendをローカルで同時起動    |
| `npm run build`        | 全workspaceをビルド                      |
| `npm test`             | frontendとbackendのテストを実行          |
| `npm run test:e2e`     | PlaywrightのE2Eテストを実行              |
| `npm run lint`         | 全workspaceを静的解析                    |
| `npm run format:check` | フォーマットを確認                       |
| `npm run docker:up`    | Dockerイメージをビルドして開発環境を起動 |
| `npm run docker:logs`  | Composeサービスのログを追跡              |
| `npm run docker:down`  | Composeサービスを停止・削除              |

個別のworkspaceには、たとえば `npm run build --workspace @todo/frontend` のようにコマンドを実行できます。frontendの成果物は `apps/frontend/dist`、backendの成果物は `apps/backend/dist` に生成されます。

## リポジトリ構成

```text
.agents/plugins/marketplace.json  リポジトリ内Pluginカタログ
.codex/config.toml                このリポジトリ用のCodex設定
DEVELOPMENT.md                    人向けの標準開発プロセス
apps/
  frontend/                       React + Vite
  backend/                        Express
docs/                             要件、設計、計画、運用文書
e2e/                              Playwrightテスト
plugins/dev-workflow/             Codex開発フローPluginとSkills
compose.yaml                      ローカル開発用Compose定義
```

## Codex開発フローPlugin

`dev-workflow` はこのリポジトリ専用のrepo-local Pluginで、外部配布を前提としていません。Plugin本体とSkillsは `plugins/dev-workflow/` に置き、`.agents/plugins/marketplace.json` でリポジトリ内カタログとして公開し、`.codex/config.toml` から利用する構成です。

Codex DesktopまたはCLIでリポジトリを開き、`AGENTS.md` と `.codex/config.toml` を確認してから使用してください。Skillの適用条件と具体的な手順は各 `SKILL.md` を正とし、Pluginや設定を変更した場合はCodexを再読み込みしてください。外部サービスへ接続するMCP設定は、接続先が決まるまで含めません。

## Word／Excel要件の管理

業務要件やデザインの原本は、案件ごとに次のように分離します。

```text
docs/requirements/business/<案件名>/
  source/      受領したWord／Excel原本（内容を直接編集しない）
  extracted/   Codexが参照・差分確認しやすいMarkdown等の変換物
```

`source/` を一次資料として保持し、抽出・要約・構造化した結果だけを `extracted/` に保存します。変換物には原本名、変換日、対象シートや章、未解決事項を記載し、原本更新時は対応する変換物も更新します。秘密情報や個人情報を含む資料はコミットせず、必要に応じて無害化したサンプルを用意してください。

## 環境変数

| 場所                 | 変数                                | 用途                                  |
| -------------------- | ----------------------------------- | ------------------------------------- |
| `apps/frontend/.env` | `VITE_API_BASE_URL`                 | ブラウザから到達できるバックエンドURL |
| `apps/backend/.env`  | `PORT`                              | バックエンドの待受ポート              |
| `apps/backend/.env`  | `CORS_ORIGIN`                       | 許可するフロントエンドのオリジン      |
| ルート `.env`        | `FRONTEND_PORT` / `BACKEND_PORT`    | Composeがホストへ公開するポート       |
| ルート `.env`        | `VITE_API_BASE_URL` / `CORS_ORIGIN` | Compose内アプリへ渡すURLとオリジン    |

秘密値を `.env.example` に記載したり、実際の `.env` をコミットしたりしないでください。

## API

Todoは `{ "id": string, "title": string, "completed": boolean }` 形式です。

| メソッド | パス             | 内容                              |
| -------- | ---------------- | --------------------------------- |
| `GET`    | `/api/todos`     | Todo一覧を取得                    |
| `POST`   | `/api/todos`     | `{ "title": string }` で作成      |
| `PATCH`  | `/api/todos/:id` | `{ "completed": boolean }` で更新 |
| `DELETE` | `/api/todos/:id` | Todoを削除                        |

エラーは `{ "error": { "code": string, "message": string } }` の形式で返ります。frontend固有の仕様と設計は [Frontend設計ドキュメント](apps/frontend/docs/README.md) を参照してください。
