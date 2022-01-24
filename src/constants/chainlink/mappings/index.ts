import ARBITRUM from './arbitrum'
import AVALANCHE from './avalanche'
import BSC from './bsc'
import { ChainId } from '@doc_failure/sushiswap-sdk'
import HECO from './heco'
import KOVAN from './kovan'
import MAINNET from './mainnet'
import MATIC from './matic'
import XDAI from './xdai'
import AURORA from './aurora'

export type ChainlinkMappingList = {
  readonly [address: string]: {
    from: string
    to: string
    decimals: number
    fromDecimals: number
    toDecimals: number
    warning?: string
    address?: string
  }
}

export const CHAINLINK_MAPPING: {
  [chainId in ChainId]?: ChainlinkMappingList
} = {
  [ChainId.MAINNET]: MAINNET,
  [ChainId.KOVAN]: KOVAN,
  [ChainId.BSC]: BSC,
  [ChainId.HECO]: HECO,
  [ChainId.MATIC]: MATIC,
  [ChainId.XDAI]: XDAI,
  [ChainId.ARBITRUM]: ARBITRUM,
  [ChainId.AVALANCHE]: AVALANCHE,
}
