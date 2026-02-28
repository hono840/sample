# bits-ui DropdownMenu の構造（Portal / Content / Separator）

> bits-ui の DropdownMenu を構成する主要コンポーネントの役割と使い方

## 全体構造

```
DropdownMenu.Root            ← 状態管理（開閉の管理者）
  DropdownMenu.Trigger       ← クリックでメニューを開くボタン
  DropdownMenu.Portal        ← 中身を body 直下にワープさせる
    DropdownMenu.Content     ← メニューの箱（位置・配置を制御）
      DropdownMenu.Group     ← 項目のグループ化
        DropdownMenu.GroupHeading  ← グループの見出し
        DropdownMenu.Item    ← メニュー項目
      DropdownMenu.Separator ← 区切り線
      DropdownMenu.Item      ← メニュー項目
```

---

## Portal — 表示場所を変える

### 何をするか

メニューの中身を **`<body>` の直下にワープさせる**。

### なぜ必要か

Portal がない場合、メニューは親要素（例: `<header>`）の中に生成される。

```
<!-- Portal なし: 親要素の中にメニューが入る -->
<header style="overflow: hidden">
  <button>メニュー</button>
  <div class="menu">          ← header の中にある
    メニュー内容               ← overflow: hidden で切れる！
  </div>
</header>
```

親要素に `overflow: hidden` があるとメニューが見切れる。`z-index` の問題も起きやすい。

```
<!-- Portal あり: body 直下にワープ -->
<header>
  <button>メニュー</button>
  <!-- ここにメニューは無い -->
</header>

<body>
  ...
  <div class="menu">          ← body 直下に移動済み
    メニュー内容               ← 何にも邪魔されない！
  </div>
</body>
```

### 使い方

```svelte
<DropdownMenu.Portal>
  <DropdownMenu.Content>
    <!-- メニューの中身 -->
  </DropdownMenu.Content>
</DropdownMenu.Portal>
```

### プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|---|---|---|---|
| `to` | `Element \| string` | `document.body` | ワープ先を変更したい場合に指定 |
| `disabled` | `boolean` | `false` | `true` にすると Portal を無効化（元の場所に表示） |

### いつ Portal を無効にするか

基本的には有効のままでOK。特殊なケース（CSS の変数スコープが切れる場合など）で `disabled` にする場合がある。

---

## Content — メニューの箱

### 何をするか

メニュー全体のコンテナ。**位置（どの方向に出すか）** と **配置（右寄せ・左寄せ）** を制御する。

### 使い方

```svelte
<DropdownMenu.Content
  class="z-50 overflow-visible"
  sideOffset={8}
  align="end"
>
  <!-- メニュー項目をここに入れる -->
</DropdownMenu.Content>
```

### 主なプロパティ

| プロパティ | 型 | デフォルト | 説明 |
|---|---|---|---|
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"bottom"` | メニューを出す方向 |
| `sideOffset` | `number` | `0` | トリガーとの隙間（px） |
| `align` | `"start" \| "center" \| "end"` | `"center"` | 水平方向の配置 |
| `alignOffset` | `number` | `0` | 配置のオフセット（px） |

### side と align の図解

```
         align="start"  align="center"  align="end"
              ↓              ↓              ↓
side=       ┌──────┐     ┌──────┐        ┌──────┐
"bottom"    │メニュー│     │メニュー│        │メニュー│
            └──────┘     └──────┘        └──────┘
         [トリガー]     [トリガー]     [トリガー]

※ side="bottom" + align="end" の場合:
  メニューはトリガーの下に出て、右端が揃う
```

### このプロジェクトでの設定

```svelte
<!-- Header.svelte -->
<DropdownMenu.Content
  class="z-50 overflow-visible"
  sideOffset={8}    <!-- トリガーの下に 8px の隙間 -->
  align="end"       <!-- メニューの右端をトリガーの右端に揃える -->
>
```

→ アカウントアイコンの **下に 8px 空けて、右揃え** でメニューが表示される。

---

## Separator — 区切り線

### 何をするか

メニュー項目の間に **水平の区切り線** を表示する。HTML 的には `<div>` が生成される。

### 使い方

```svelte
<DropdownMenu.Separator class="h-px bg-gray-200 dark:bg-gray-700" />
```

- `h-px` → 高さ 1px
- `bg-gray-200` → 線の色

### 自動で付く data 属性

| 属性 | 値 |
|---|---|
| `data-orientation` | `"horizontal"` or `"vertical"` |
| `data-menu-separator` | 空文字（存在するだけ） |

CSS でスタイリングしたいときに使える:

```css
[data-menu-separator] {
  margin: 4px 0;
}
```

### このプロジェクトでの使用箇所

```
AccountMenuContent.svelte で 3 箇所:

  アカウントセクション（マイページ、切り替え、ログアウト）
  ─────────────────────── ← Separator（200行目）
  WebStore セクション（ストアを開く、購入履歴）
  ─────────────────────── ← Separator（205行目）
  外観モード / 言語
  ─────────────────────── ← Separator（224行目）
  設定 / ヘルプ / フィードバック
```

---

## まとめ

| コンポーネント | 一言で | 必須？ |
|---|---|---|
| **Portal** | 中身を body 直下にワープ。表示が切れる問題を防ぐ | ほぼ必須（なくても動くが推奨） |
| **Content** | メニューの箱。位置と配置を制御する | 必須 |
| **Separator** | 区切り線。見た目は自分で CSS で設定 | 任意（なくても動く） |
