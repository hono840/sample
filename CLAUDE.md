# CLAUDE.md - SvelteKit bits-ui Header Menu

## プロジェクト概要

bits-ui（ヘッドレスUI）+ Svelte 5 snippet を使ったヘッダーメニューの実装サンプル。
既存の `sveltekit-header-menu` を bits-ui で再実装し、コード量を削減したもの。

## 技術スタック

- Svelte 5（ルーンズ構文 + snippet）
- SvelteKit
- Tailwind CSS v4（`@tailwindcss/vite`）
- bits-ui v2（ヘッドレスUIコンポーネント）
- TypeScript

## コマンド

```bash
pnpm dev      # 開発サーバー起動
pnpm build    # 本番ビルド
pnpm preview  # ビルド結果プレビュー
```

## 設計方針

- bits-ui の DropdownMenu で開閉管理・click outside・キーボードナビを自動化
- サブメニューは bits-ui の Sub（ホバー駆動）を不使用、クリック開閉を手動実装
- Svelte 5 の snippet で MenuItem.svelte / SubMenu.svelte を不要に
- モバイル: サブメニューがメインメニューを置き換え + 戻るボタン
- デスクトップ: サブメニューはメインメニューの左にサイドパネル表示
- 画面幅がモバイルサイズになったらメニューを自動で閉じる（matchMedia）
