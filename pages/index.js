import Head from 'next/head';
import styles from '../styles/Home.module.css';
import MuiNextLink from '@components/core-components/MuiNextLink';
import { Container, Stack } from '@mui/material';
import GetStarted from '@components/GetStarted';
import MintNFT from '@components/web3/mint-nft';

export default function Home() {
  return (
    <Container>
      <Head id="home">
        <title>Whitelist Mint for Stonky Candles</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Mint your Stonky Candles
        </h1>

        <div className={styles.description}>
          <Stack spacing={1}>
          </Stack>
        </div>
        <div id="error-message"></div>
        <div id="error-message2"></div>
        <MintNFT />
        <p>Note: Attempting to mint more than 1 NFT from a whitelisted account can cause a failed transaction and a loss of your gas fee. </p>
      </main>
    </Container>
  )
}
