<script lang="ts">
  import { browser } from '$app/environment';
  import { DropdownMenu } from 'bits-ui';
  import AccountMenuContent from './AccountMenuContent.svelte';

  let menuOpen = $state(false);

  // 画面幅がスマホサイズになったらメニューを閉じる
  $effect(() => {
    if (!browser) return;
    const mq = window.matchMedia('(min-width: 768px)');
    function handleChange(e: MediaQueryListEvent) {
      if (!e.matches) menuOpen = false;
    }
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  });
</script>

<header
  class="sticky top-0 z-50 flex items-center justify-between h-16 px-4 pr-96 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
>
  <!-- ロゴエリア -->
  <div class="flex items-center gap-4">
    <a href="/" class="text-xl font-bold text-gray-900 dark:text-white">MyApp</a>
  </div>

  <!-- ナビゲーション（デスクトップ） -->
  <nav class="hidden md:flex items-center gap-6">
    <a
      href="/"
      class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >ホーム</a
    >
    <a
      href="/webstore"
      class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >WebStore</a
    >
    <a
      href="/"
      class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >Forms</a
    >
  </nav>

  <!-- アカウントメニュー（bits-ui DropdownMenu） -->
  <DropdownMenu.Root bind:open={menuOpen}>
    <DropdownMenu.Trigger
      class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors cursor-pointer"
      aria-label="アカウントメニュー"
    >
      <svg
        class="w-6 h-6 text-gray-600 dark:text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </DropdownMenu.Trigger>

    <DropdownMenu.Portal>
      <DropdownMenu.Content class="z-50 overflow-visible" sideOffset={8} align="end" preventScroll={false}>
        <AccountMenuContent />
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
</header>
