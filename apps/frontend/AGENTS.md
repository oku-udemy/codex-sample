# Frontend作業ガイド

ルート`AGENTS.md`に加えて、`apps/frontend`以下では本書を適用します。

## 責務と構成

React 19とViteによる単一画面Todo UIです。`src/App.tsx`が画面状態と操作、`src/api.ts`がHTTP通信、`src/types.ts`がFrontend内の型、`src/styles.css`が表示を担当します。画面や責務が増えるまでは、不必要な抽象化や状態管理ライブラリを追加しません。

## 実装規約

- UIからBackendへは`api.ts`を介して接続します。
- 利用者に見える状態には読み込み中、空、成功、失敗を含めます。
- 操作要素は意味的なHTML、関連付けられたラベル、キーボード操作、フォーカス表示を維持します。
- `VITE_API_BASE_URL`未設定時の接続先は`http://localhost:3001`です。
- API契約を変える場合はBackend実装、Frontend/Backendの型、`docs/api/`、双方の設計文書、テストを同期します。

## 検証

- `npm run test --workspace @todo/frontend`
- `npm run lint --workspace @todo/frontend`
- `npm run build --workspace @todo/frontend`

利用者操作、表示状態、通信結果の反映はTesting Libraryで公開動作として検証します。主要導線やブラウザー上の挙動を変えた場合はルートから`npm run test:e2e`も実行します。仕様の正本は`apps/frontend/docs/`を参照し、実装変更と同じ変更単位で更新します。
