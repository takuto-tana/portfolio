# Hiroto Portfolio

自社開発企業に向けて、制作実績・担当範囲・AIを活用した開発の過程を伝えるポートフォリオです。Astroで静的生成し、GitHub Pagesへの公開を想定しています。

## ローカルで見る

Node.js 24を推奨します。初回のみ `npm ci` を実行してください。

```sh
npm ci
npm run dev -- --background --host 127.0.0.1
```

ブラウザで <http://127.0.0.1:4321/portfolio/> を開きます。ポートが使用中の場合は起動ログのURLを確認してください。

```sh
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

本番相当のビルドを確認する場合は `npm run build` の後に `npm run preview -- --host 127.0.0.1` を実行します。

## 更新する場所

| 更新したい内容                           | ファイル                          |
| ---------------------------------------- | --------------------------------- |
| 名前・紹介文・外部リンク・資格・AIツール | `src/data/profile.ts`             |
| 技術スタックの名前・アイコン・使用例     | `src/data/profile.ts` の `skills` |
| 各作品の概要・担当・技術・詳細本文       | `src/content/projects/*.md`       |
| トップページの見出し・セクション構成     | `src/pages/index.astro`           |
| このサイトの制作過程                     | `src/pages/making-of.astro`       |
| サイト名・説明・パスの共通処理           | `src/consts.ts`                   |
| 配色・余白・レスポンシブ表示             | `src/styles/global.css`           |
| スクリーンショット・OG画像               | `public/images/`                  |
| GitHub Pagesの公開先                     | `astro.config.mjs`                |

プロフィールはHiroto名義で掲載しています。実務経験年数や成果数値など、確認していない情報は記載していません。

### 作品を追加する

1. `docs/project-template.md` を `src/content/projects/作品の英数字ID.md` にコピーします。
2. ファイル冒頭の `title`、`description`、`role`、`stack`、`highlights` などを記入します。本文はMarkdownです。
3. スクリーンショットを `public/images/` に置き、`image` に `images/ファイル名.jpg`、`imageAlt` に画面の説明を設定します。
4. `liveUrl` と `repoUrl` は、公開しているものだけ記載します。テンプレートのサンプルURLは必ず置き換えるか削除してください。
5. `order` で表示順、`theme`（`sage` / `lavender` / `ink`）でカード背景を設定します。
6. `npm run validate` を実行し、プレビューを確認します。

画像を省略した新しい作品には、作品名と技術名のビジュアルが表示されます。logdigのみ、実行結果ではなく処理を説明する専用の図を使用しています。

追加した作品はトップページ・詳細ページ・関連作品に自動で反映されます。必須項目が欠けている場合はコンテンツスキーマの検証で検出されます。

### プロフィール画像

元画像は `src/assets/hiroto.png` です（受け取ったファイルは拡張子がWebPでしたが、中身はPNGのため実形式に合わせて保存）。差し替える場合はこのファイルを更新してください。

Astroの `Image` コンポーネントで幅240・350・700pxのWebPをビルド時に生成します。ブラウザが表示幅と画面密度に合うものを選択し、プロフィール付近までスクロールすると遅延読み込みします。寸法を指定して、読み込み時のレイアウトのずれも抑えています。

### 外部リンク・画像

外部リンクは新しいタブで開きます。スクリーンリーダー向けの案内と `noopener noreferrer` を付けています。画像は外部CDNに依存せずローカルに配置しています。

`public/icons/` の技術ロゴは [Devicon](https://github.com/devicons/devicon) を使用しています。ライセンスは `public/icons/LICENSE.devicon` に同梱しています。VBAは独自に作成した識別用アイコンです。各技術の商標はそれぞれの権利者に帰属します。

## 検証

```sh
npm run validate
npm run format:check
```

`validate` は、Astroの型チェック、本番ビルド、生成HTMLの検証を順番に実行します。検証スクリプトは内部リンク・ページ内アンカー・画像参照・メタデータ・公開パス・サンプル文言の残存を確認します。外部サイトの到達性や視覚的な表示を保証するものではありません。

整形する場合は `npm run format` を実行してください。

ブラウザでの確認項目・制作判断は `docs/development.md` に記録しています。

## GitHub Pagesへの公開

現在のGitリモート `takuto-tana/portfolio` に合わせて、以下を設定済みです。

- `site`: `https://takuto-tana.github.io`
- `base`: `/portfolio`
- 公開予定URL: `https://takuto-tana.github.io/portfolio/`
- ワークフロー: `.github/workflows/deploy.yml`
- 対象ブランチ: 現在の `master`

公開するときは以下を行います。

1. GitHubのリポジトリで **Settings → Pages → Build and deployment → Source → GitHub Actions** を選択します。
2. 変更したソースと `package-lock.json` を `master` にコミット・pushします。
3. Actionsの `Validate and deploy to GitHub Pages` が成功したことを確認します。

`master` へのpushまたは手動実行で検証後にデプロイします。プルリクエストでは検証・ビルドのみ実行します。ブランチを `main` に変更する場合はワークフローの対象も変更してください。

別のリポジトリ名や独自ドメインに変更する場合は、`astro.config.mjs` の `site` と `base` を更新してください。内部URLは `withBase()` で生成しているため、ページごとのURL修正は不要です。

この初回実装では、コミット・push・GitHub側のPages設定変更・本番デプロイは実行していません。

## 開発背景
エンジニアコミュニティでの交流が増える中で、制作物や学習の歩みを聞かれる機会が多くなりました。個別にURLを共有する形だと情報が点在してしまい、全体像や背景が伝わりにくかったため、成果物や取り組みを一覧化できるポートフォリオサイトを用意しました。

また、掲載している説明はあえてシンプル（ざっくり）にまとめています。これから学習を始める方でも直感的に理解でき、経験豊富なエンジニアの方にはくどい説明なしでも要点が伝わるよう、誰にとっても見やすく分かりやすいサイトを目指したためです。まずは一覧で全体感を掴んでいただき、気になるものがあれば詳しくお話しできればと思っています。

## 技術選定

### Astro を採用した理由
ポートフォリオサイトは、制作物や学習の歩みを「読んでもらう・見てもらう」ことが主目的であるため、インタラクティブなWebアプリケーション向けの **React** ではオーバースペックになると判断しました。

過去にReactでサイトを構築した際に表示や動作が重くなってしまった経験も踏まえ、情報閲覧を中心とする本サイトでは軽快さとシンプルさを優先しています。静的サイト生成（SSG）によって不要なクライアントサイドJavaScriptを抑え、高速に表示できる **Astro** を採用しました。
