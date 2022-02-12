import { Grid, Stack } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { mintGift, mintPublic, mintWhitelist, sampleNFT } from '@pages/utils/_web3';
import MintNFTCard from './mint-nft-card';
import useSWR from 'swr';
import Web3 from 'web3';

const NOT_CLAIMABLE = 0;
const ALREADY_CLAIMED = 1;
const CLAIMABLE = 2;

const MintNFT = () => {
  const web3 = new Web3(Web3.givenProvider)

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { active, account, chainId, status } = useWeb3React();

  const [giftClaimable, setGiftClaimable] = useState(NOT_CLAIMABLE);
  const [whitelistClaimable, setWhitelistClaimable] = useState(NOT_CLAIMABLE);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);

  const [giftMintStatus, setGiftMintStatus] = useState();
  const [whitelistMintStatus, setWhitelistMintStatus] = useState();
  const [statusMessages, setStatusMessages] = useState();
  const [whitelistWasClaimed, setWhitelistClaimedStatus] = useState();
  const [whiteListMintStatus, setWhitelistMessageStatus] = useState();
  const [publicMintStatus, setPublicMintStatus] = useState();

  const [numToMint, setNumToMint] = useState(1);

  const connectFailed = (payload) => {
    return {
      type: "CONNECTION_FAILED",
      payload: payload,
    };
  };

  useEffect(() => {
    if (!active || !account) {
      setAlreadyClaimed(false);
      return;
    }
    async function checkIfClaimed() {
      sampleNFT.methods.claimed(account).call({ from: account }).then((result) => {
        setAlreadyClaimed(result);
        if (result){
          setWhitelistClaimedStatus(true);
        } else {
          setWhitelistClaimedStatus(false);
        }
      }).catch((err) => {
        setAlreadyClaimed(false);
      });
    }
    checkIfClaimed();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  let whitelistProof = [];
  let whitelistValid = false;
  const whitelistRes = useSWR(active && account ? `/api/whitelistProof?address=${account}` : null, {
    fetcher, revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false });
  if (!whitelistRes.error && whitelistRes.data) {
    const { proof, valid } = whitelistRes.data;
    whitelistProof = proof;
    whitelistValid = valid;
    if(!valid){document.getElementById("error-message").innerHTML = "Address is not on Whitelist";} else {document.getElementById("error-message").innerHTML = "";}
  }

  useEffect(() => {
    if (!active || !whitelistValid) {
      setWhitelistClaimable(NOT_CLAIMABLE);
      console.log("1");
      return;
    } else if (alreadyClaimed) {
      console.log("2");
      setWhitelistClaimable(ALREADY_CLAIMED);
      return;
    }

    async function validateClaim() {
      const amount = '0.01';
      const amountToWei = web3.utils.toWei(amount, 'ether');
      sampleNFT.methods.mintWhitelist(whitelistProof , numToMint).call({ from: account, value: amountToWei }).then((result) => {
        setWhitelistClaimable(CLAIMABLE);
        console.log(result);
      }).catch((err) => {

        if(err.toString().includes('presale')){
          document.getElementById("error-message2").innerHTML = "Presale closed";
        } else if(err.toString().includes('insufficient')) {
          document.getElementById("error-message2").innerHTML = "Insufficient Funds";
        } else {document.getElementById("error-message2").innerHTML = "";}
        if (err.toString().includes('claimed')) { 
          setWhitelistClaimable(ALREADY_CLAIMED); 
          setWhitelistClaimedStatus(true);
          
        } else { setWhitelistClaimable(NOT_CLAIMABLE) }
      });
    }
    validateClaim();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whitelistProof])

  const onMintGift = async () => {
    const { success, status } = await mintGift(account, giftProof);
    console.log(status);
    setGiftMintStatus(success);
  };

  const onMintWhitelist = async () => {
    const { success, status } = await mintWhitelist(account, whitelistProof);
    console.log(status);
    setWhitelistMintStatus(success);
  };

  const onPublicMint = async () => {
    const { success, status } = await mintPublic(account, numToMint);
    document.getElementById("statusMessage").innerHTML = status;
    console.log(status);
    setPublicMintStatus(success);
  };


  return (
    <>
      <Stack id="demo">
        {/* <h2>Mint a Stonky Candles NFT</h2> */}
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {/* <Grid item>
            <MintNFTCard
              title={'Gift Mint'}
              description={'Mint this sample NFT to the connected wallet. Must be on gift whitelist.'}
              canMint={giftClaimable}
              mintStatus={giftMintStatus}
              action={onMintGift}
            />
          </Grid> */}
          <Grid item>
            <MintNFTCard
              title={'Whitelist Mint'}
              description={'Mint 1 Stonky Candle to the connected wallet.'}
              description2={'Must be on whitelist.'}
              description3={'Cost: 0.035 ETH'}
              canMint={whitelistClaimable}
              mintWasClaimed={whitelistWasClaimed}
              mintStatus={whitelistMintStatus}
              statusMessage={statusMessages}
              action={onMintWhitelist}
            />
          </Grid>
          <Grid item>
            <MintNFTCard
              title={'Public Mint'}
              description={'Mint your Stonky Candles to the connected wallet.'}
              description2={'You can mint up to 10'}
              description3={'Cost: 0.035 ETH'}
              canMint={active}
              mintStatus={publicMintStatus}
              statusMessage={statusMessages}
              
              showNumToMint={true}
              setNumToMint={setNumToMint}
              action={onPublicMint}
            />
          </Grid>
        </Grid>
      </Stack>
    </>
  );
}

export default MintNFT;