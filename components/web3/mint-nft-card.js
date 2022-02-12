import { Button, Card, CardActions, CardContent, Input, Typography, Select, FormControl, InputLabel, MenuItem } from '@mui/material';
import Image from 'next/image';

const MintNFTCard = ({title, description, description2, description3, action, canMint, showNumToMint, setNumToMint, mintStatus, mintWasClaimed}) => {
  const handleChange = (event) => {
    const numToMint = parseInt(event.target.value);
    setNumToMint(numToMint);
  };

  return (
    <Card sx={{ maxWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Image alt="Stonky Candles NFT" src='/stonkycandles.jpg' width={250} height={250}/>
        {mintStatus ? <p>Success! Check your wallet in a few minutes.</p> : <p>{description}<br/>{description2}<br/>{description3}</p>}
        {mintWasClaimed ? <p><strong>Your mint was already claimed</strong></p> : <p></p>}
        <div id="statusMessage"></div>
      </CardContent>
      <CardActions>
        {/* <Input onChange={handleChange} defaultValue={1} type="number" label="number to mint"
            sx={{max: 10}}
          />} */}
        {showNumToMint &&
          <FormControl sx={{ m: 1, minWidth: 110 }}>
          <InputLabel id="demo-simple-select-label">Mint Amount</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Mint Amount"
            onChange={handleChange}
            defaultValue={1}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={8}>8</MenuItem>
            <MenuItem value={9}>9</MenuItem>
            <MenuItem value={10}>10</MenuItem>
          </Select>
        </FormControl>}
        <Button disabled={!canMint} onClick={action} variant="contained">Mint</Button>
      </CardActions>
    </Card>
  );
}

export default MintNFTCard;