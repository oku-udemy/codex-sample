# ローカル開発Runbook

## 前提

- Node.js 20以上、npm 10以上、またはDocker Composeを利用できること。
- 実値の`.env`をコミットしないこと。

## npmで起動

```bash
npm install
npm run dev
```

Frontendは`http://localhost:5173`、Backendは`http://localhost:3001`で起動します。環境変数を変える場合は各アプリの`.env.example`を参照します。

## Docker Composeで起動

```bash
docker compose up --build
```

終了は`Ctrl+C`です。コンテナを削除する場合は`docker compose down`を実行します。Todoはメモリ保存のため、Backendを再起動すると消えます。

## 検証

```bash
npm run lint
npm test
npm run build
npm run format:check
npm run test:e2e
```

E2Eは設定によりFrontendとBackendを自動起動します。ポート5173または3001が別プロセスに使われている場合は、そのプロセスを特定して終了するか、既存サーバーが対象コードで動作していることを確認します。

## よくある確認

| 症状                  | 確認                                                             |
| --------------------- | ---------------------------------------------------------------- |
| UIがAPIへ接続できない | `VITE_API_BASE_URL`、Backendの待受、ブラウザーのNetworkを確認    |
| CORSエラー            | `CORS_ORIGIN`がFrontendのオリジンと完全一致するか確認            |
| E2E起動失敗           | 5173/3001の競合、Playwrightブラウザーの導入、webServerログを確認 |
| Todoが消えた          | 現行Backendはインメモリ保存で、再起動時消去が仕様                |
