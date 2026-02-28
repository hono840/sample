<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { DropdownMenu } from 'bits-ui';
  import { icons } from './icons';
  import type { MenuSection, ThemeMode, Language } from '$lib/types/menu';

  let isWebStorePage = $derived($page.url.pathname.startsWith('/webstore'));

  // サブメニュー状態（クリックで開閉）
  let activeSubmenu = $state<'appearance' | 'language' | null>(null);
  let triggerEl = $state<HTMLElement | undefined>();
  let wrapperEl = $state<HTMLElement | undefined>();
  let mainMenuEl = $state<HTMLElement | undefined>();
  let submenuContentEl = $state<HTMLElement | undefined>();
  let submenuTop = $state(0);
  let submenuMaxHeight = $state(9999);

  // 現在のテーマ・言語
  let currentTheme: ThemeMode = $state('dark');
  let currentLanguage = $state('ja');

  const languages: Language[] = [
    { code: 'ja', label: '日本語' },
    { code: 'en', label: 'English' },
    { code: 'ko', label: '한국어' },
    { code: 'zh', label: '中文' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'pt', label: 'Português' },
    { code: 'it', label: 'Italiano' },
    { code: 'ru', label: 'Русский' },
  ];

  let themeLabel = $derived(currentTheme === 'dark' ? 'ダーク' : 'ライト');
  let currentLanguageLabel = $derived(
    languages.find((l) => l.code === currentLanguage)?.label ?? '日本語',
  );
  let submenuTitle = $derived(activeSubmenu === 'appearance' ? '外観モード' : '言語');

  // メニューセクション定義
  const accountSection: MenuSection = {
    title: 'アカウント',
    items: [
      { icon: icons.user, label: 'マイページ' },
      { icon: icons.switchAccount, label: 'アカウントを切り替え' },
      { icon: icons.signOut, label: 'ログアウト' },
    ],
  };

  // webstoreセクション定義
  const webStoreSection: MenuSection = {
    title: 'WebStore',
    items: [
      { icon: icons.store, label: 'ストアを開く' },
      { icon: icons.purchase, label: '購入履歴' },
      { icon: icons.purchase, label: '定期購入' },
      { icon: icons.purchase, label: '支払い方法の設定' },
    ],
  };

  // 設定セクション定義
  const generalSection: MenuSection = $derived({
    title: '設定',
    items: [
      {
        icon: icons.appearance,
        label: '外観モード',
        submenu: 'appearance',
        value: themeLabel,
      },
      {
        icon: icons.language,
        label: '言語',
        submenu: 'language',
        value: currentLanguageLabel,
      },
      { icon: icons.help, label: 'ヘルプ' },
      { icon: icons.feedback, label: 'フィードバック' },
    ],
  });

  /**
   * サブメニューの位置と最大高さを計算する。
   *
   * Phase 1: 余裕あり → ボタンの横にそのまま表示（はみ出しOK）
   * Phase 2: viewport 下端に当たる → 位置だけ上にずらす（サイズは変えない）
   * Phase 3: 親メニュー上端に到達 → これ以上ずらせないので高さを縮める
   */
  function calcSubmenuPosition() {
    if (!triggerEl || !wrapperEl || !mainMenuEl || !browser) return;

    const vh = window.innerHeight;
    const wrapperRect = wrapperEl.getBoundingClientRect();
    const buttonRect = triggerEl.getBoundingClientRect();
    const menuRect = mainMenuEl.getBoundingClientRect();

    const menuTop = menuRect.top - wrapperRect.top;
    const contentHeight = submenuContentEl?.scrollHeight ?? 0;

    // viewport と親メニュー下端のうち大きい方を下限とする
    // - vh が大きい間 → vh が採用され、親メニューから飛び出せる
    // - vh が縮むと menuRect.bottom に収束し、親メニュー下端に揃う
    const bottomLimit = Math.max(vh, menuRect.bottom) - 4;

    // ① ボタン位置を起点にする（wrapper 基準）
    let top = buttonRect.top - wrapperRect.top;

    // ② 下限を超えた分だけスムーズに上にシフト
    const submenuBottom = wrapperRect.top + top + contentHeight;
    const overflow = submenuBottom - bottomLimit;
    if (overflow > 0) {
      top -= overflow;
    }

    // ③ 親メニュー上端より上には出さない
    top = Math.max(top, menuTop);

    // ④ max-height: 下限まで（シフトしきれない場合に効く）
    const maxHeight = bottomLimit - (wrapperRect.top + top);

    submenuTop = top;
    submenuMaxHeight = Math.max(maxHeight, 50);
  }

  function handleSubmenuClick(type: 'appearance' | 'language', e: MouseEvent) {
    if (activeSubmenu === type) {
      activeSubmenu = null;
      return;
    }
    triggerEl = e.currentTarget as HTMLElement;
    activeSubmenu = type;
  }

  // サブメニューが開いている間、位置を計算し resize で再計算する
  $effect(() => {
    if (!activeSubmenu || !browser) return;

    calcSubmenuPosition();

    window.addEventListener('resize', calcSubmenuPosition);
    return () => window.removeEventListener('resize', calcSubmenuPosition);
  });

  function handleThemeChange(theme: ThemeMode) {
    currentTheme = theme;
    if (browser) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  function handleLanguageChange(code: string) {
    currentLanguage = code;
  }

  function handleBack() {
    activeSubmenu = null;
  }
</script>

<!-- ===== Snippet 定義 ===== -->

<!-- 1. menuItem: 通常メニュー項目の共通テンプレート -->
{#snippet menuItem(icon: string, label: string, value?: string)}
  <div class="flex items-center w-full">
    <span
      class="w-5 h-5 mr-3 flex items-center justify-center text-gray-500 dark:text-gray-400"
    >
      {@html icon}
    </span>
    <span class="flex-1 text-sm">{label}</span>
    {#if value}
      <span class="text-xs text-gray-500 dark:text-gray-400">{value}</span>
    {/if}
  </div>
{/snippet}

<!-- 2. subTriggerContent: サブメニュートリガー用（icon + label + 現在値 + シェブロン） -->
{#snippet subTriggerContent(icon: string, label: string, value: string)}
  <div class="flex items-center w-full">
    <span
      class="w-5 h-5 mr-3 flex items-center justify-center text-gray-500 dark:text-gray-400"
    >
      {@html icon}
    </span>
    <span class="flex-1 text-sm">{label}</span>
    <span class="text-xs text-gray-500 dark:text-gray-400 mr-1">{value}</span>
    <span class="text-gray-400">{@html icons.chevronRight}</span>
  </div>
{/snippet}

<!-- 3. radioOption: テーマ・言語選択の共通テンプレート -->
{#snippet radioOption(label: string, checked: boolean, icon?: string)}
  <div class="flex items-center w-full">
    {#if icon}
      <span
        class="w-5 h-5 mr-3 flex items-center justify-center text-gray-500 dark:text-gray-400"
      >
        {@html icon}
      </span>
    {/if}
    <span class="flex-1 text-sm">{label}</span>
    {#if checked}
      {@html icons.check}
    {/if}
  </div>
{/snippet}

<!-- 4. menuSectionBlock: セクションのレンダリングパターン -->
{#snippet menuSectionBlock(section: MenuSection)}
  <DropdownMenu.Group>
    {#if section.title}
      <DropdownMenu.GroupHeading
        class="px-4 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
      >
        {section.title}
      </DropdownMenu.GroupHeading>
    {/if}
    {#each section.items as item}
      {#if item.submenu}
        <button
          class="flex items-center w-full px-4 py-2.5 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          onclick={(e) => handleSubmenuClick(item.submenu!, e)}
        >
          {@render subTriggerContent(item.icon, item.label, item.value!)}
        </button>
      {:else}
        <DropdownMenu.Item
          class="px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-700"
        >
          {@render menuItem(item.icon, item.label, item.value)}
        </DropdownMenu.Item>
      {/if}
    {/each}
  </DropdownMenu.Group>
{/snippet}

<!-- 5. submenuItems: サブメニューの選択肢（モバイル・デスクトップ共通） -->
{#snippet submenuItems()}
  {#if activeSubmenu === 'appearance'}
    <button
      class="flex items-center w-full px-4 py-2.5 text-left text-gray-700
  dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
  cursor-pointer"
      onclick={() => handleThemeChange('dark')}
    >
      {@render radioOption('ダークモード', currentTheme === 'dark', icons.moon)}
    </button>
    <button
      class="flex items-center w-full px-4 py-2.5 text-left text-gray-700
  dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
  cursor-pointer"
      onclick={() => handleThemeChange('light')}
    >
      {@render radioOption('ライトモード', currentTheme === 'light', icons.sun)}
    </button>
  {:else if activeSubmenu === 'language'}
    {#each languages as lang}
      <button
        class="flex items-center w-full px-4 py-2.5 text-left text-gray-700
  dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
  cursor-pointer"
        onclick={() => handleLanguageChange(lang.code)}
      >
        {@render radioOption(lang.label, currentLanguage === lang.code)}
      </button>
    {/each}
  {/if}
{/snippet}
<!-- ===== メニュー本体 ===== -->

<div bind:this={wrapperEl} class="relative">
  <!-- メインメニュー（モバイルではサブメニュー展開時に非表示） -->
  <div
    bind:this={mainMenuEl}
    class="{activeSubmenu
      ? 'hidden md:block'
      : ''} w-72 max-h-[calc(100vh-4rem)] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
  >
    <!-- アカウント情報ヘッダー -->
    <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold"
        >
          U
        </div>
        <div>
          <p class="text-sm font-medium text-gray-900 dark:text-white">ユーザー名</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">user@example.com</p>
        </div>
      </div>
    </div>

    <!-- アカウントセクション -->
    {@render menuSectionBlock(accountSection)}

    <DropdownMenu.Separator class="h-px bg-gray-200 dark:bg-gray-700" />

    <!-- WebStore セクション（/webstore ページのみ） -->
    {#if isWebStorePage}
      {@render menuSectionBlock(webStoreSection)}
      <DropdownMenu.Separator class="h-px bg-gray-200 dark:bg-gray-700" />
    {/if}

    <!-- 一般セクション（設定・ヘルプ・フィードバック） -->
    {@render menuSectionBlock(generalSection)}
  </div>

  <!-- デスクトップ: サブメニュー（メインメニューの左に表示） -->
  {#if activeSubmenu}
    <div class="hidden md:block absolute right-full mr-2" style="top: {submenuTop}px">
      <div
        bind:this={submenuContentEl}
        class="w-72 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
        style="max-height: {submenuMaxHeight}px"
      >
        {@render submenuItems()}
      </div>
    </div>
  {/if}

  <!-- モバイル: サブメニュー（メインメニューを置き換え） -->
  {#if activeSubmenu}
    <div
      class="md:hidden w-72 max-h-[calc(100vh-4rem)] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <!-- ヘッダー（戻るボタン） -->
      <div
        class="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700"
      >
        <button
          onclick={handleBack}
          class="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          aria-label="戻る"
        >
          <span class="text-gray-500 dark:text-gray-400">
            {@html icons.back}
          </span>
        </button>
        <h3 class="text-sm font-medium text-gray-900 dark:text-white">{submenuTitle}</h3>
      </div>
      <!-- サブメニュー選択肢 -->
      <div class="py-1">
        {@render submenuItems()}
      </div>
    </div>
  {/if}
</div>
