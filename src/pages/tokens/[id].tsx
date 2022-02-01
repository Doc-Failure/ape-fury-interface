import Container from '../../components/Container'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Token() {
  const router = useRouter()
  const { id } = router.query
  return (
    <Container id={`token-${id}-page`} className="py-4 md:py-8 lg:py-12" maxWidth="2xl">
      <Head>
        <title>Token {id} | Ape Fury</title>
        <meta key="description" name="description" content="Ape Fury tokens." />
        <meta key="twitter:description" name="twitter:description" content="Ape Fury tokens." />
        <meta key="og:description" property="og:description" content="Ape Fury tokens." />
      </Head>
    </Container>
  )
}
