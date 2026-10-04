# API文書

FrontendとBackend間の公開HTTP契約を管理します。現行契約は[todo-api.md](todo-api.md)です。

API変更では次を同じ変更単位で更新します。

1. `docs/api/todo-api.md`
2. `apps/backend/docs/api-spec.md`とBackend実装・テスト
3. `apps/frontend/docs/api-integration.md`とFrontend実装・テスト
4. 主要導線または互換性へ影響する場合はPlaywright E2E

互換性を壊す変更は、利用側と提供側を同時に変更できるかを確認し、必要なら移行期間、版管理、ロールバック方法を計画へ記載します。
