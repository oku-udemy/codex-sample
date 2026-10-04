# E2Eドキュメント

PlaywrightでFrontendとBackendを接続し、利用者の主要導線を検証します。現在の対象はTodoの追加・完了・削除と、初期取得失敗時のエラー表示です。

- 設定: `playwright.config.ts`
- テスト: `e2e/todo.spec.ts`
- 詳細方針: [testing-strategy.md](testing-strategy.md)
- 実行: リポジトリルートで`npm run test:e2e`

PlaywrightはFrontendを`127.0.0.1:5173`、Backendを`127.0.0.1:3001`で起動します。通常は既存サーバーを再利用し、CIでは再利用しません。
