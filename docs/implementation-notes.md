# 実装ノート: bits-ui + Snippet でヘッダーメニュー再実装

## 既存実装から削除できたもの

### 1. click outside 検知（既存: ~30行 → 0行）

既存では `$effect` 内で `document.addEventListener('click', ...)` を登録し、以下のエッジケースも処理していた:

- `setTimeout(0)` でトグルボタンとの競合を回避
- `target.isConnected` で再描画による DOM 消失を判定
- `closest('[aria-label="アカウントメニュー"]')` でトグルボタン自体のクリックを除外

bits-ui の `DropdownMenu` はこれを全て自動処理する。

### 2. サブメニュー位置計算（既存: ~10行 → 0行）

既存では `getBoundingClientRect()` でクリック位置を取得し、`submenuTopPx` を計算して `style="top: {submenuTopPx}px"` で配置していた。

bits-ui は内部で Floating UI を使い、自動的に最適な位置に配置する。

### 3. デスクトップ/モバイルのサブメニュー分岐（既存: ~20行 → 0行）

既存ではサブメニューを2箇所でレンダリング:

- デスクトップ: `hidden md:block absolute right-full` でメインメニューの左に表示
- モバイル: `md:hidden` でメインメニューを置き換え

bits-ui の SubContent は Floating UI で自動配置されるため、この分岐は不要。

### 4. 状態管理の簡略化

既存:

- `isMenuOpen` + `toggleMenu()` + `closeMenu()` — Header.svelte
- `activeSubmenu: SubmenuType` + サブメニュー開閉ロジック — AccountMenu.svelte
- `submenuTopPx` — サブメニュー位置計算用

bits-ui版:

- 全て bits-ui の内部状態管理に委譲

## Snippet の活用

Svelte 5 の snippet は「コンポーネントにするほどではないが、繰り返し使うUIパターン」に最適。

### 使った4つの snippet

1. **`menuItem`** — 通常のメニュー項目（icon + label + value）
   - 既存の `MenuItem.svelte`（34行）を snippet 1つ（7行）で置換

2. **`subTriggerContent`** — サブメニュートリガー（icon + label + 現在値 + シェブロン）
   - サブメニューを持つ項目の表示パターン

3. **`radioOption`** — テーマ/言語選択（label + チェックマーク）
   - bits-ui の `RadioItem` の `children({ checked })` と組み合わせて使う
   - `{#snippet children({ checked })}` → `{@render radioOption(label, checked, icon)}`

4. **`menuSectionBlock`** — セクション全体（Group + GroupHeading + Items）
   - セクションの描画パターンを共通化

### snippet vs コンポーネント の判断基準

- **snippet が適している場面**: 同一ファイル内で繰り返すUIパターン、props が少ない、状態を持たない
- **コンポーネントが適している場面**: 複数ファイルから使う、独自の状態/ロジックを持つ、テスト対象にしたい

## bits-ui の主要コンポーネント

| コンポーネント                                   | 役割                                             |
| ------------------------------------------------ | ------------------------------------------------ |
| `DropdownMenu.Root`                              | 開閉状態の管理                                   |
| `DropdownMenu.Trigger`                           | メニューを開くボタン（aria-expanded 自動設定）   |
| `DropdownMenu.Portal`                            | DOM 外にレンダリング（z-index 問題を回避）       |
| `DropdownMenu.Content`                           | メニュー本体（Floating UI で自動配置）           |
| `DropdownMenu.Item`                              | 通常のメニュー項目（キーボードナビ対応）         |
| `DropdownMenu.Separator`                         | 区切り線                                         |
| `DropdownMenu.Group` + `GroupHeading`            | セクション                                       |
| `DropdownMenu.Sub` + `SubTrigger` + `SubContent` | サブメニュー                                     |
| `DropdownMenu.RadioGroup` + `RadioItem`          | ラジオ選択（`children({ checked })` で状態取得） |

## `closeOnSelect={false}` の重要性

テーマや言語の `RadioItem` に `closeOnSelect={false}` を設定しないと、選択した瞬間にメニュー全体が閉じてしまう。
サブメニュー内での選択は「メニューを閉じずに値を変更する」ユースケースなので、このプロパティが必要。

## data-[highlighted] による keyboard ナビゲーション

bits-ui は矢印キーでフォーカスが移動すると、対象要素に `data-highlighted` 属性を付与する。
Tailwind の `data-[highlighted]:bg-gray-100` でキーボードナビ時のハイライトを実装できる。

-
