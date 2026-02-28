export type MenuSection = {
  title?: string;
  items: MenuItem[];
};

export type MenuItem = {
  icon: string;
  label: string;
  value?: string;
  href?: string;
  submenu?: "appearance" | "language"
};

export type ThemeMode = 'dark' | 'light';

export type Language = {
  code: string;
  label: string;
};
