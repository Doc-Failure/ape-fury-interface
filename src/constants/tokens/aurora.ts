import { ChainId, Token } from '@doc_failure/sushiswap-sdk'

export const USDC = new Token(
  ChainId.AURORA_TESTNET,
  '0xb12bfca5a55806aaf64e99521918a4bf0fc40802',
  6,
  'USDC',
  'USD Coin'
)

export const WBTC = new Token(
  ChainId.AURORA_TESTNET,
  '0xf4eb217ba2454613b15dbdea6e5f22276410e89e',
  8,
  'WBTC',
  'Wrapped Bitcoin'
)

export const USDT = new Token(
  ChainId.AURORA_TESTNET,
  '0x4988a896b1227218e4a686fde5eabdcabd91571f',
  8,
  'USDT',
  'Tether USD'
)

//Added 2 Custom Token to test functionalities on the network
export const MLT = new Token(ChainId.AURORA_TESTNET, '0x72ea2aDcadD044EfB77606894699B114CFf6eB01', 8, 'MLT', 'MalToken')
export const NBTC = new Token(
  ChainId.AURORA_TESTNET,
  '0x65dB021bF79ca3d1840B19F87473d0A2f0F317a2',
  8,
  'NBTC',
  'NotBitconnect'
)

/* export const MIM = new Token(
  ChainId.AURORA_TESTNET,
  '0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A',
  18,
  'MIM',
  'Magic Internet Money'
)

export const SPELL = new Token(
  ChainId.AURORA_TESTNET,
  '0x3E6648C5a70A150A88bCE65F4aD4d506Fe15d2AF',
  18,
  'SPELL',
  'Spell Token'
)

export const ICE = new Token(ChainId.AURORA_TESTNET, '0xCB58418Aa51Ba525aEF0FE474109C0354d844b7c', 18, 'ICE', 'ICEToken')

export const gOHM = new Token(
  ChainId.AURORA_TESTNET,
  '0x8D9bA570D6cb60C7e3e0F31343Efe75AB8E65FB1',
  18,
  'gOHM',
  'Governance OHM'
) */
/* 
export const MAGIC = new Token(ChainId.AURORA_TESTNET, '0x539bdE0d7Dbd336b79148AA742883198BBF60342', 18, 'MAGIC', 'MAGIC') */
