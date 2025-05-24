import { Box, Button, ButtonGroup, Link, Typography } from '@mui/material';

import { LargeModal } from '@/components/CustomModal';

import { useUsageNotesModal } from './hook';

export default function UsageNotesModal() {
  const [isModalOpen, setIsModalOpen] = useUsageNotesModal();

  // TODO: マークダウンを使う
  return (
    <LargeModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
        >
          <Typography variant="large" sx={{ fontWeight: 'bold' }} gutterBottom>
            「だばの時間割」について
          </Typography>

          <Typography variant="x-small" sx={{ color: 'red' }}>
            <strong>
              授業情報や時間割情報が間違っている場合にはぜひ開発者までご連絡ください！
            </strong>
          </Typography>

          <Typography variant="x-small">
            「だばの時間割」は、有志によって開発された、群馬大学の学生専用の履修管理をサポートするアプリです。
          </Typography>

          <Typography variant="x-small" sx={{ mb: 2 }}>
            <strong>
              非公式であるため、利用の際は大学公式の情報と照らし合わせながら自己責任でご利用ください
            </strong>
            。
          </Typography>

          <Typography variant="medium" sx={{ fontWeight: 'bold' }} gutterBottom>
            開発者
          </Typography>
          <Typography variant="x-small" sx={{ mb: 2 }}>
            群大のだば
            <Link href="https://x.com/gundainodaba" target="_blank">
              <Typography variant="x-small">（x.com/gundainodaba）</Typography>
            </Link>
          </Typography>

          <Typography variant="medium" sx={{ fontWeight: 'bold' }} gutterBottom>
            協力してくれた方々
          </Typography>

          <Typography variant="x-small">
            山田ハヤオ
            <Link href="https://www.hayao0819.com/" target="_blank">
              <Typography variant="x-small">（hayao0819.com）</Typography>
            </Link>
          </Typography>

          <Typography variant="x-small">
            DaiChi904
            <Link href="https://www.daichi904.me/" target="_blank">
              <Typography variant="x-small">（daichi904.me）</Typography>
            </Link>
          </Typography>

          <Typography variant="x-small" sx={{ mb: 2 }}>
            Gavagai
          </Typography>

          <Typography variant="medium" sx={{ fontWeight: 'bold' }} gutterBottom>
            利用上の注意
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
            <Typography variant="x-small">
              - 以下
              に記載されている内容は、今後変更される可能性があります。その場合には、事前にx(twitter)でお知らせします。
            </Typography>
            <Typography variant="x-small">
              -
              情報の正確性には努めていますが、完全性・正確性を保証するものではありません。
            </Typography>
            <Typography variant="x-small">
              -
              本アプリ利用による不利益（卒業要件の見落とし等）に対し、開発者は責任を負いません。
            </Typography>
            <Typography variant="x-small">
              -
              設定情報に学内専用の情報が含まれている場合、設定コードは学外の人に共有しないでください。
            </Typography>
          </Box>

          <Typography variant="medium" sx={{ fontWeight: 'bold' }} gutterBottom>
            プライバシーポリシー
          </Typography>
          <Typography variant="x-small" sx={{ mb: 2 }}>
            当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を使用しています。このGoogleアナリティクスはデータの収集のためにCookieを使用しています。このデータは匿名で収集されており、個人を特定するものではありません。
            この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。この規約に関しての詳細は
            <Link
              href="https://marketingplatform.google.com/about/analytics/terms/jp/"
              target="_blank"
            >
              Googleアナリティクスサービス利用規約
            </Link>
            のページや
            <Link
              href="https://policies.google.com/technologies/ads?hl=ja"
              target="_blank"
            >
              Googleポリシーと規約ページ
            </Link>
            をご覧ください。
          </Typography>

          <Typography variant="medium" sx={{ fontWeight: 'bold' }} gutterBottom>
            使用している情報について
          </Typography>
          <Typography variant="x-small" sx={{ mb: 2 }}>
            群馬大学のシラバスおよび公式ホームページで公開されている情報をもとに授業情報・学部情報を取得・整形しています。
            授業情報に関しては基本的に最新の年度のもの使用し、必要な場合のみ過去の年度の情報も使用します。
          </Typography>

          <Typography variant="medium" sx={{ fontWeight: 'bold' }} gutterBottom>
            ユーザーから収集・保存する情報
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
            <Typography variant="x-small">
              以下の情報がユーザーの端末に記録されます。これらの情報は、ユーザーの端末内でのみ管理され、次項の「サーバーに送信される情報とその目的」で示していること以外の目的で使用されることはありません。
            </Typography>
            <Typography variant="x-small">
              - 学部（どの学部に所属しているか）
            </Typography>
            <Typography variant="x-small">- 必修の授業</Typography>
            <Typography variant="x-small">
              - 選択必修の情報（どの科目から何単位とる必要があるか）
            </Typography>
            <Typography variant="x-small">- 取得済の授業</Typography>
            <Typography variant="x-small">
              -
              最新年度に該当しない過去の授業（取得済の授業を正しく登録するため）
            </Typography>
            <Typography variant="x-small">
              - 時間割に登録している授業（時間割を表示するため）
            </Typography>
            <Typography variant="x-small">
              - 教室情報（時間割に登録している授業の教室を表示するため）
            </Typography>
          </Box>

          <Typography variant="medium" sx={{ fontWeight: 'bold' }} gutterBottom>
            サーバーに送信される情報とその目的
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
            <Typography variant="x-small">
              以下の目的に限り、必要最小限の情報をサーバーに送信します
            </Typography>
            <Typography variant="x-small">
              - 学部に応じた授業情報の取得のため
            </Typography>
            <Typography variant="x-small">
              -
              取得済の授業を一括で登録するときに過去の年度の授業の照合を行うため
            </Typography>
            <Typography variant="x-small">
              - 設定コードを用いて設定情報を他の端末や他のユーザーと共有するため
            </Typography>
            <Typography variant="x-small">
              - 授業の教室の情報をユーザー間で共有するため
            </Typography>
          </Box>

          <Typography variant="medium" sx={{ fontWeight: 'bold' }} gutterBottom>
            設定コードについて
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
            <Typography variant="x-small">
              -
              設定コードがユーザーにより発行されると、設定コードとそれに紐づく設定情報がデータベースに保存されます。
            </Typography>

            <Typography variant="x-small">
              -
              全ての設定情報を登録する設定コードは一度のみ使用可能です。使用済となった設定コード及び情報は開発者が定期的にデータベースから削除します。
            </Typography>
            <Typography variant="x-small">
              - 学部・必修設定用コードは何度でも使用可能です。
            </Typography>
            <Typography variant="x-small">
              -
              ６か月以上使用されていない設定コードについても同様にデータベースから削除されます。
            </Typography>
          </Box>

          <Typography variant="medium" sx={{ fontWeight: 'bold' }} gutterBottom>
            著作権について
          </Typography>
          <Typography variant="x-small" sx={{ mb: 2 }}>
            授業情報などの著作物は全て各権利者に帰属します。
          </Typography>

          <Typography variant="medium" sx={{ fontWeight: 'bold' }} gutterBottom>
            お問い合わせ
          </Typography>
          <Typography variant="x-small">
            ご意見・ご要望、不具合の報告は開発者のX（twitter）のDMまでご連絡ください。
          </Typography>
          <Link href="https://x.com/gundainodaba" target="_blank">
            <Typography variant="x-small">x.com/gundainodaba</Typography>
          </Link>
        </Box>

        <ButtonGroup sx={{ width: '100%', mt: 2 }}>
          <Button
            onClick={() => {
              setIsModalOpen(false);
            }}
            sx={{ width: '100%' }}
          >
            <Typography variant="x-small">閉じる</Typography>
          </Button>
        </ButtonGroup>
      </Box>
    </LargeModal>
  );
}
