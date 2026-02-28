# SvelteKit Header Menu（bits-ui版）

bits-ui（ヘッドレスUI）と Svelte 5 snippet を使って、ヘッダーのドロップダウンメニューを再実装したサンプル。

## 目的

既存の `sveltekit-header-menu` で手動実装していた以下を bits-ui で自動化:

- メニュー開閉の状態管理
- click outside でメニューを閉じる
- サブメニューの位置計算（Floating UI）
- キーボードナビゲーション
- aria 属性の管理

## 技術スタック

- **Svelte 5** + **SvelteKit**
- **bits-ui v2** — ヘッドレスUIコンポーネント
- **Tailwind CSS v4**
- **TypeScript**

## セットアップ

```bash
pnpm install
pnpm dev
```

## 構成

```
src/
├── lib/
│   ├── components/
│   │   ├── Header.svelte            # ヘッダー + DropdownMenu Root/Trigger
│   │   ├── AccountMenuContent.svelte # メニュー内容（snippet活用）
│   │   └── icons.ts                 # SVGアイコン定義
│   └── types/
│       └── menu.ts                  # 型定義
└── routes/
    ├── +layout.svelte
    ├── +page.svelte
    └── webstore/
        └── +page.svelte
```

## 既存版との比較

| 項目 | 既存版（手動実装） | bits-ui版 |
|---|---|---|
| コンポーネント数 | 4（Header, AccountMenu, MenuItem, SubMenu） | 2（Header, AccountMenuContent） |
| click outside | `$effect` + `document.addEventListener` | bits-ui 自動処理 |
| サブメニュー位置 | `getBoundingClientRect` 手動計算 | Floating UI 自動配置 |
| テーマ/言語選択 | 手動チェックマーク表示 | `RadioGroup` + `RadioItem` |
| キーボード操作 | 未対応 | bits-ui 自動対応 |

## 学びのポイント

- `docs/implementation-notes.md` に詳細な比較・学びを記録
