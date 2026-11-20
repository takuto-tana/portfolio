export const SITE_TITLE = 'Hiroto — Portfolio';
export const SITE_DESCRIPTION =
  'Hirotoのポートフォリオ。Pythonによるツール制作、Reactを使ったWeb制作、AIを活用した既存サイトの改善を紹介します。';

/** Include the GitHub Pages repository prefix in every local URL. */
export const withBase = (path = '') =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
