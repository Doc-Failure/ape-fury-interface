import { AutoRow } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import React, { useCallback, useState } from 'react'
import { useDefaultsFromURLSearch } from '../../state/swap/hooks'
import {
  useUserArcherETHTip,
  useUserArcherGasPrice,
  useUserArcherUseRelay,
  useUserTransactionTTL,
} from '../../state/user/hooks'
import Container from '../../components/Container'
import DoubleGlowShadow from '../../components/DoubleGlowShadow'
import Head from 'next/head'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import useIsArgentWallet from '../../hooks/useIsArgentWallet'
import { useLingui } from '@lingui/react'
import { useRouter } from 'next/router'

import TransactionConfirmationModal, { ConfirmationModalContent } from '../../modals/TransactionConfirmationModal'

import { fetchAPI } from '../../lib/api'
import Button from '../../components/Button'
import QuestionHelper from '../../components/QuestionHelper'
import Image from 'next/image'

import { useERC20TokenFactoryContract } from '../../hooks/useContract'

export async function getServerSideProps() {
  try {
    const { data } = await fetchAPI('/banners?populate=image')
    return {
      props: { banners: data || [] },
    }
  } catch (e) {
    return {
      props: { banners: [] },
    }
  }
}

export default function Swap({ banners }) {
  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setTokenDetail({ ...tokenDetail, [name]: value })
  }

  const createTokenFunction = async () => {
    setTokenIsDeploying(true)
    setModalState({
      attemptingTxn: true,
      open: true,
      txHash: '',
      content: '',
    })
    return tokenFactoryContract
      .deployNewToken(tokenDetail.tokenSymbol, tokenDetail.tokenName, BigInt(tokenDetail.tokenInitialSupply))
      .then((response) => {
        console.log('response: ' + response.hash)
        tokenFactoryContract.getLastDeployedContract().then((res) => {
          setModalState({
            attemptingTxn: false,
            open: true,
            txHash: response.hash,
            content: res,
          })
          console.log('Token deployed: ', res)
        })
        setTokenIsDeploying(false)
      })
      .catch((error: Error) => {
        setTokenIsDeploying(false)
        console.debug('Failed to approve token', error)
        throw error
      })
  }

  const tokenFactoryContract = useERC20TokenFactoryContract('0x80B2f8B2eA0B79347dBA5d9715AC047df3beED5f')
  const { i18n } = useLingui()

  const loadedUrlParams = useDefaultsFromURLSearch()

  const { account, chainId } = useActiveWeb3React()

  const router = useRouter()

  const [tokenDetail, setTokenDetail] = useState({ tokenSymbol: '', tokenName: '', tokenInitialSupply: 0 })
  const [tokenIsDeploying, setTokenIsDeploying] = useState(false)

  // get custom setting values for user
  const [ttl] = useUserTransactionTTL()
  const [useArcher] = useUserArcherUseRelay()
  const [archerETHTip] = useUserArcherETHTip()
  const [archerGasPrice] = useUserArcherGasPrice()

  const closeModal = () => {
    if (!modalState.txHash) {
      setModalState((prevState) => ({
        ...prevState,
        open: false,
      }))
    } else {
      setModalState((prevState) => ({
        ...prevState,
        txHash: '',
      }))
    }
  }

  const signatureData = undefined
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  const isArgentWallet = useIsArgentWallet()

  const { library } = useActiveWeb3React()

  const [modalState, setModalState] = useState({
    attemptingTxn: false,
    txHash: '',
    open: false,
    content: '',
  })

  return (
    <Container id="factory-token" className="py-4 md:py-8 lg:py-12">
      <Head>
        {/* TODO: Insert some proper Meta */}
        <title>Ape Fury</title>
        {/* <meta
          key="description"
          name="description"
          content="SushiSwap allows for swapping of ERC20 compatible tokens across multiple networks"
        /> */}
      </Head>
      <DoubleGlowShadow>
        <TransactionConfirmationModal
          isOpen={modalState.open}
          onDismiss={closeModal}
          attemptingTxn={modalState.attemptingTxn}
          hash={modalState.txHash}
          content={() => (
            <ConfirmationModalContent
              title="New Token Created!"
              onDismiss={closeModal}
              topContent={() => <p>Token deployed at address: {modalState.content}</p>}
              bottomContent={() => (
                <>
                  <QuestionHelper text={`Add ${tokenDetail.tokenName} to your MetaMask wallet`}>
                    <div
                      className="hidden rounded-md cursor-pointer sm:inline-flex bg-dark-900 hover:bg-dark-800 p-0.5 flex-col"
                      onClick={() => {
                        const params: any = {
                          type: 'ERC20',
                          options: {
                            address: modalState.content,
                            symbol: tokenDetail.tokenSymbol,
                            decimals: 18,
                            image: 'https://raw.githubusercontent.com/sushiswap/icons/master/token/unknown.png',
                          },
                        }
                        if (library && library.provider.isMetaMask && library.provider.request) {
                          library.provider
                            .request({
                              method: 'wallet_watchAsset',
                              params,
                            })
                            .then((success) => {
                              if (success) {
                                console.log(`Successfully added ${tokenDetail.tokenName} to MetaMask`)
                              } else {
                                throw new Error('Something went wrong.')
                              }
                            })
                            .catch(console.error)
                        }
                      }}
                    >
                      <h1>Click to Import your Token In Metamask</h1>

                      <Image
                        src="https://raw.githubusercontent.com/sushiswap/icons/master/token/unknown.png"
                        alt={tokenDetail.tokenName}
                        width="50px"
                        height="50px"
                        objectFit="contain"
                        className="rounded"
                      />
                    </div>
                  </QuestionHelper>
                </>
              )}
            />
          )}
          pendingText={'pendingText'}
        />
        <div className="p-4 space-y-4 rounded bg-dark-900 z-1">
          <div className="rounded bg-dark-800">
            <div className="flex flex-col justify-between space-y-3 sm:space-y-0">
              <div className="w-full">
                <div>
                  <AutoColumn justify="space-between" className="py-3">
                    <AutoRow justify={'flex-start'} style={{ padding: '0 1rem' }}>
                      <h1 className="text-3xl tracking-[-0.02em] font-medium currentColor">Token Deployer</h1>
                    </AutoRow>
                  </AutoColumn>
                  <AutoColumn justify="space-between" className="py-3">
                    <AutoRow justify={'flex-start'} style={{ padding: '0 1rem' }}>
                      <div className={'flex items-center w-full space-x-3 rounded bg-dark-900 focus:bg-dark-700 p-3'}>
                        <div className="md:w-1/3">
                          <label
                            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                            htmlFor="token-name"
                          >
                            Token Name
                          </label>
                        </div>
                        <div className="md:w-2/3">
                          <input
                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            name="tokenName"
                            id="token-name"
                            type="text"
                            placeholder="Bitcoin"
                            value={tokenDetail.tokenName}
                            onChange={(e) => handleChange(e)}
                          />
                        </div>
                      </div>
                    </AutoRow>
                  </AutoColumn>
                  <AutoColumn justify="space-between" className="py-3">
                    <AutoRow justify={'flex-start'} style={{ padding: '0 1rem' }}>
                      <div className={'flex items-center w-full space-x-3 rounded bg-dark-900 focus:bg-dark-700 p-3'}>
                        <div className="md:w-1/3">
                          <label
                            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                            htmlFor="token-symbol"
                          >
                            Token Symbol
                          </label>
                        </div>
                        <div className="md:w-2/3">
                          <input
                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            name="tokenSymbol"
                            id="token-symbol"
                            type="text"
                            placeholder="BTC"
                            value={tokenDetail.tokenSymbol}
                            onChange={(e) => handleChange(e)}
                          />
                        </div>
                      </div>
                    </AutoRow>
                  </AutoColumn>
                  <AutoColumn justify="space-between" className="py-3">
                    <AutoRow justify={'flex-start'} style={{ padding: '0 1rem' }}>
                      <div className={'flex items-center w-full space-x-3 rounded bg-dark-900 focus:bg-dark-700 p-3'}>
                        <div className="md:w-1/3">
                          <label
                            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                            htmlFor="token-initial-supply"
                          >
                            Initial Supply
                          </label>
                        </div>
                        <div className="md:w-2/3">
                          {/* <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-token-initial-supply" type="number" value="21000000"/> */}
                          <input
                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            name="tokenInitialSupply"
                            id="token-initial-supply"
                            type="number"
                            placeholder="21000000"
                            inputMode="decimal"
                            min={0}
                            minLength={1}
                            maxLength={79}
                            value={tokenDetail.tokenInitialSupply}
                            onChange={(e) => handleChange(e)}
                          />
                        </div>
                      </div>
                    </AutoRow>
                  </AutoColumn>

                  <AutoColumn justify="space-between" className="py-3">
                    <AutoRow justify={'flex-start'} style={{ padding: '0 1rem' }}>
                      <Button color="gradient" size="lg" onClick={createTokenFunction} disabled={tokenIsDeploying}>
                        {tokenIsDeploying ? (
                          <div className=" flex justify-center items-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                          </div>
                        ) : (
                          i18n._(t`Create Token`)
                        )}
                      </Button>
                    </AutoRow>
                  </AutoColumn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DoubleGlowShadow>
    </Container>
  )
}
