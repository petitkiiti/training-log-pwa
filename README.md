# Training Log PWA v0.11.2

個人向けのトレーニング記録PWAです。v0.11.2では Fullbody 区分、1日複数セッション、履歴の日時単位管理、Drive差分案内、分析グラフのレスポンシブなX軸ラベル表示に加え、Drive差分解消画面の操作不能問題を修正しています。

## 主な機能

- Push / Pull / Leg / Fullbody のセッション記録
- 重量・回数・セット数を同一条件でまとめて入力
- 種目マスタの追加・更新・削除
- 種目ごとのポイント / メモ、参考画像（最大2枚）
- 月 → 日付 → 時間帯ごとのセッション → 種目の履歴
- 種目別分析（最大負荷・総ボリューム・推定1RM）
- IndexedDBへの端末内保存
- Google Drive APIによる `training-data.json` の直接作成・更新・読込
- 手動JSON保存/読込、CSV出力（非常用・移行用）

## Google Drive OAuth

この版には次のWeb OAuth Client IDだけを組み込んでいます。

`160770788863-7i2cneav2mp51odgj8nscho15pr1j4ls.apps.googleusercontent.com`

Client IDはブラウザアプリで公開される前提の識別子です。Client Secret、Googleアカウントのメールアドレス、パスワードはアプリに含めていません。

要求スコープは以下だけです。

`https://www.googleapis.com/auth/drive.file`

Google Drive全体を読む権限ではなく、このアプリが作成・利用するファイルに限定した権限です。

## Drive同期の使い方

1. 初回に「Google Driveに接続」を押してGoogleの認証/同意を行います。
2. 「Driveへバックアップ」で、Drive上のこのアプリ用 `training-data.json` を作成または更新します。
3. 起動時またはDrive接続時に、端末側とDrive側の更新状態に差があればバックアップまたは読込を案内します。
4. Drive側がこの端末の最終確認後に更新されている状態でローカル変更を上書きしようとすると警告します。

アクセストークンは短時間で期限切れになりますが、アプリには保存しません。必要になったときGoogle Identity Servicesから再取得します。Google側の認証状態・既存の同意が利用できる場合は再同意は不要ですが、状況によって再接続が必要になることがあります。

## 重要な制約

- PCでのOAuth動作確認は、Google Cloudの「承認済みのJavaScript生成元」に登録した `http://localhost:8000` から開いてください。
- `http://192.168.x.x:8000` のようなLAN内IPはGoogle OAuthの本番利用先として扱えません。iPhoneで使う最終配信元はHTTPSで用意し、そのoriginをOAuthクライアントへ追加する必要があります。
- 現在、参考画像はJSON内にBase64で含まれます。画像が増えると `training-data.json` は大きくなります。画像をDrive上の別ファイルへ分離する方式は未実装です。
- 同時編集向けの完全なサーバー側ロックはありません。Driveの更新時刻を使って別端末更新を検知し、上書き前に警告します。個人利用で「別端末を使う前にDriveから読込」の運用を前提にしています。
- オフライン中もIndexedDBへの記録はできますが、Drive同期にはネット接続が必要です。

## ローカル起動

フォルダ内で以下を実行します。

```bash
python -m http.server 8000 --bind 0.0.0.0
```

PCのブラウザではOAuth確認のため、`http://localhost:8000` を開いてください。

## 初期データ

このリポジトリには個人のトレーニング履歴や種目マスタは含まれていません。初回は「種目管理」から追加するか、既存バックアップJSONを読み込んでください。

## Git管理上の注意

個人履歴・バックアップJSON・OAuth設定JSON・Client SecretはGitHubへ入れないでください。`.gitignore` に代表的なOAuth設定JSON名も追加しています。


## v0.10.0 additions
- Google Drive backup is stored under `Personal Apps/TrainingLog/training-data.json`; folders are created automatically. Existing app-created root backup is moved into the folder when found.
- Added Notes: title, long-form content, up to 2 images, create/edit/delete.
- Added history editing and deletion, including date, PPL, times, meal, exercises, load/reps/sets, and overall notes.
- Notes and note images are included in JSON/Drive backups.


## v0.10.1 fix
- Google Drive接続時に `ensureDriveToken is not defined` となる不具合を修正。


## v0.10.2 additions
- 種目管理に Push / Pull / Leg のチェックボックスを追加。
- 初期状態はすべて未選択。チェックした区分の種目だけ表示。
- 複数区分の同時表示に対応。


## v0.10.3 additions
- ノート・種目管理・履歴・分析の上部に「⌂ ホーム」ボタンを追加
- 従来の「← 戻る」ボタンはそのまま残しています


## v0.10.5 changes
- ホームボタンを各サブ画面内ではなく、上部ナビゲーションの左端へ移動。
- 家型アイコンのみのコンパクトなホームボタンに変更。
- 画面右上のバージョン表示を v0.10.5 に修正。


## v0.10.5
- 種目管理でPush / Pull / Legs内の表示順を手動変更（↑ / ↓）
- トレーニング入力を「登録済み種目 → 次の種目選択」の順に変更
- 各種目にその日の所感 / メモを追加（既存JSONの `note` を引き継ぎ）
- 履歴表示で種目所感と全体所感の改行を保持し、食事・全体所感を分離表示
- 履歴編集で種目所感も編集可能


## v0.10.9 additions
- 種目管理をアコーディオン化し、初期表示を種目名と並び替えボタン中心に簡略化。
- 種目並び替え・種目追加時に画面が最上段へ戻らないようスクロール位置を維持。
- トレーニング入力で種目追加後、追加した種目が見える位置へ最小限スクロール。
- 「前回をコピー」「今日を保存」を全体所感の直下へ移動。
- 入力内容の未保存/保存済みステータスを追加。


## v0.10.9 additions
- 履歴詳細の種目内容を1文字分インデントし、種目名との階層を明確化
- 食事・全体所感の本文を1文字分インデント
- 食事・全体所感の見出しを本文より強く表示するよう調整


## v0.10.9 additions
- 履歴詳細の「食事」「全体所感」の各見出しの上に、1行分の余白を追加しました。


## v0.11.0

- セッション区分に `Fullbody` を追加。Fullbody選択時は Push / Pull / Leg の全種目を候補表示。
- IndexedDBのトレーニング履歴を日付主キーからセッションID主キーへ移行し、同日に複数回のトレーニングを保存可能に変更。
- 旧 `sessions` ストアおよび旧JSONを自動移行。既存の `Full Body` 表記も `Fullbody` に統一。
- 保存後の入力画面は新規セッション用の空画面に戻し、当日の保存済みセッション件数と時間帯を表示。未保存の入力途中データは同日中なら再起動時に復元。
- 履歴を「月 → 日付 → セッション（区分・時間）」で表示し、各セッションを個別編集・削除可能に変更。
- Google Driveの更新状態と端末側の未バックアップ変更を起動時/接続時に確認し、必要に応じてバックアップまたは読込を案内。
- バックアップJSONをversion 9へ更新し、`dataUpdatedAt` とセッションIDを保存。
- 分析グラフは同日複数セッションを別データ点として扱い、実施履歴には開始時刻も表示。
- X軸の日付ラベル数をグラフ横幅に応じて自動調整し、スマホでの日付重なりを抑制。


## v0.11.2

- Drive差分・競合検出後、起動時のDrive確認画面に「Driveから読込」「Driveへバックアップ」を表示し、その場で差異を解消できるよう修正。
- 差分解消待ち状態で画面フォーカスやPWA復帰が発生しても、「Driveを確認」だけの画面へ戻らないよう状態を保持。
- 差分解消待ちでは「Driveを確認」ボタンを非表示にし、読込またはバックアップの選択肢だけを表示。
- READMEの重複していた v0.11.1 見出しを修正し、Fullbody・複数セッション対応等を v0.11.0 として整理。

## v0.11.1

- 起動時のGoogle Drive自動OAuthを廃止し、ユーザー操作によるDrive状態確認へ変更。
- Drive確認済み状態は同日中3時間有効。画面ロック、他アプリへの切り替え、PWA復帰では3時間以内なら再確認しない。
- 3時間経過または日付変更後はDrive確認を必須化し、未確認状態ではトレーニング保存をブロック。
- Drive側が新しい、またはローカルとDrive双方に変更がある場合は、読込・競合解消まで通常利用開始を保留。
- Driveバックアップ／読込成功時は確認済み状態を更新。


## v0.11.3
- iPhoneで履歴編集時などの開始・終了時刻入力欄が横にはみ出す問題を修正。
- 開始・終了時刻を専用の2列グリッドにし、狭い画面でも均等幅で表示。
- 日付とホーム / ノート / 種目管理 / 履歴 / 分析のナビゲーション領域をスティッキーヘッダー化。
- スマホではヘッダーボタンを1行に収め、スクロール中でも画面移動できるよう調整。
