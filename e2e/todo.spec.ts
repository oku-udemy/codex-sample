import { expect, test } from '@playwright/test';

test('Todoを追加し、完了にして、削除できる', async ({ page }) => {
  const title = `E2E Todo ${Date.now()}`;
  await page.goto('/');

  await page.getByLabel('新しいTodo').fill(title);
  await page.getByRole('button', { name: '追加' }).click();

  const todoItem = page.getByRole('listitem').filter({ hasText: title });
  await expect(todoItem).toBeVisible();
  await todoItem.getByRole('checkbox').click();
  await expect(todoItem.getByRole('checkbox')).toBeChecked();
  await expect(todoItem).toHaveClass(/completed/);

  await todoItem.getByRole('button', { name: `${title}を削除` }).click();
  await expect(todoItem).toHaveCount(0);
});

test('初期取得に失敗したときエラーを表示する', async ({ page }) => {
  await page.route('http://127.0.0.1:3001/api/todos', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        error: { code: 'INTERNAL_ERROR', message: 'テスト用のAPIエラーです。' },
      }),
    });
  });

  await page.goto('/');

  await expect(page.getByRole('alert')).toHaveText('テスト用のAPIエラーです。');
});
