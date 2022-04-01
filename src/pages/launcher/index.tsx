import { AutoRow } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import React, { useCallback, useEffect, useState } from 'react'
import Container from '../../components/Container'
import DoubleGlowShadow from '../../components/DoubleGlowShadow'
import Head from 'next/head'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'

import TransactionConfirmationModal, { ConfirmationModalContent } from '../../modals/TransactionConfirmationModal'

import Button from '../../components/Button'

import { useERC20TokenFactoryContract, useTokenLauncherContract, useTokenContract } from '../../hooks/useContract'
import { _nameprepTableA1 } from '@ethersproject/strings/lib/idna'
import { toInteger } from 'lodash'
import { BigNumber, ethers } from 'ethers'

interface ITokenLaunchDetail {
  _launchName: string
  _campaignOwner: string
  _tokenAddr: number
  _expiringDay: string
  _quantityEarlyUsersPool: number
  _quantityLiquidityPool: number
}

export default function Launcher({ banners }) {
  useEffect(() => {
    return tokenFactoryContract.getContracts().then((listOfCrypto) => {
      let res = listOfCrypto.map((elem) => {
        return { _symbol: elem._symbol, _name: elem._name, _address: elem._address }
      })
      setCryptoList(res)
    })
  }, [])

  const { i18n } = useLingui()

  const { account, chainId } = useActiveWeb3React()

  const [launchName, setLaunchName] = useState('')
  const [launchingCampaignInProgress, setLaunchingCampaignInProgress] = useState(false)
  const [EA_liquidity, setEA_liquidity] = useState(20)
  const [LP_liquidity, setLP_liquidity] = useState(0)
  const [launching_days, setlaunching_days] = useState(0)
  const [tokenAddress, setTokenAddress] = useState('')
  const [launchList, setLaunchList] = useState(<></>)
  const [tokenToSendToPresale, setTokenToSendToPresale] = useState(0.0)

  const tokenLauncherContract = useTokenLauncherContract('0x4C800f86D31EC5879a8e624e90F190D64869DB95')
  const tokenFactoryContract = useERC20TokenFactoryContract('0xd7BbA6bf573AEf09ce57EEfE87c9e1f8e6b13745')
  const wNearToken = useTokenContract('0x4861825E75ab14553E5aF711EbbE6873d369d146')
  const tokenContract = useTokenContract(tokenAddress)

  useEffect(() => {
    getContracts()
  }, [tokenToSendToPresale])

  const fundTokenCampaign = () => {
    console.log('tokenToSendToPresale ', tokenToSendToPresale)
    wNearToken.approve(tokenLauncherContract.address, ethers.constants.MaxUint256.toString()).then((response) => {
      /*  console.log(response)
      tokenToSendToPresale * 100 */
      tokenLauncherContract.fundTokenLaunchCampaign(launchName, BigNumber.from(1)).then((res) => {
        console.log(res)
      })
    })
  }

  const getContracts = async () => {
    const arrayOfToken = await tokenLauncherContract.getListOfTokenLaunchCampaigns()
    const launches = arrayOfToken.map((res, index) => {
      console.log(res)
      return (
        <div key={index} className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{res._launchName}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Launch Owner: {res._campaignOwner}</p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Token Address: </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{res._tokenAddr}</dd>
              </div>
            </dl>
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Joining period: </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(res._expiringDay * 1000).toString()}
                </dd>
              </div>
            </dl>
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Token Destinated to early adopter </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {parseFloat(ethers.utils.formatEther(res._quantityEarlyUsersPool))}
                </dd>
              </div>
            </dl>
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Token destinated to liquidity pool</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {parseFloat(ethers.utils.formatEther(res._quantityLiquidityPool))}
                </dd>
              </div>
            </dl>
          </div>
          <div className="flex bg-gray-500 justify-center p-2">
            {/* TODO se non e' scaduto allora refundo, altrimenti ritiro. */}
            <input
              className="bg-gray-200 rounded w-1/4 text-gray-700 focus:outline-none focus:bg-white focus:border-purple-500 p-1"
              name="tokenToSendToPresale"
              id="token-to-send-to-presale"
              type="number"
              step="0.01"
              value={tokenToSendToPresale}
              onChange={(e) => setTokenToSendToPresale(parseFloat(e.target.value))}
            />
            <Button
              color="gradient"
              size="sm"
              className="w-1/4 m-1 py-2 px-4"
              onClick={fundTokenCampaign}
              disabled={launchingCampaignInProgress}
            >
              {i18n._(t`Fund Campaign!`)}
            </Button>
            {/*  <div className={'flex flex-grow items-center w-full space-x-3 rounded focus:bg-dark-700 p-3'}> */}
          </div>
          {/* <Button
                  color="gradient"
                  size="sm"
                  className="w-1/4 m-1"
                  onClick={launchToken}
                  disabled={launchingCampaignInProgress}
                >{i18n._(t`Receive Tokens!`)} */}
          {/* {Math.floor(Date.now() / 1000) > res._expiringDay
                    ? i18n._(t`Receive Tokens!`)
                    : i18n._(t`Fund Campaign!`)} */}
          {/* </Button> */}
          {/*   </div> */}
        </div>
      )
    })
    const component = <div className="p-4 space-y-4 rounded bg-dark-900 z-1">{launches}</div>
    setLaunchList(component)
  }

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

  const launchToken = async () => {
    console.log(tokenContract.address, EA_liquidity, LP_liquidity, launching_days, launchName)
    //tokenLauncherContract
    //Devo caricare l'ERC20 dall'interfaccia, approvarlo e poi nella callback dell'approvazione richiamare questo:
    //tokenLauncherContract.getListOfTokenLaunchCampaignsPerUser().then((res)=>{console.log(res)});
    //(EA_liquidity+LP_liquidity)*tokenContract.

    // eslint-disable-next-line react-hooks/rules-of-hooks
    tokenContract
      .approve(tokenLauncherContract.address, ethers.constants.MaxUint256.toString())
      .then((response) => {
        console.log(response)
        tokenLauncherContract
          .setUpTokenLaunchCampaign(tokenContract.address, EA_liquidity, LP_liquidity, launching_days, launchName)
          .then((res) => {
            console.log(res)
          })
        /*addTransaction(response, {
          summary: 'Approve ' + amountToApprove.currency.symbol,
          approval: { tokenAddress: token.address, spender: spender },
        })*/
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }

  const { library } = useActiveWeb3React()

  const [modalState, setModalState] = useState({
    attemptingTxn: false,
    txHash: '',
    open: false,
    content: '',
  })

  const [cryptoList, setCryptoList] = useState([])

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
              bottomContent={() => ({
                /* <></> */
              })}
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
                    <AutoRow justify="flex-start" style={{ padding: '0 1rem' }}>
                      <h1 className="text-3xl tracking-[-0.02em] font-medium currentColor font-bold">Token Launcher</h1>
                    </AutoRow>
                  </AutoColumn>
                  <AutoColumn justify="space-between" className="py-3 w-full">
                    <AutoRow
                      justify="flex flex-grow w-max"
                      className="w-full justify-center"
                      style={{ padding: '0 1rem' }}
                    >
                      <div className="flex items-center w-full space-x-3 rounded bg-dark-900 focus:bg-dark-700 p-3 h-20">
                        <div className="md:w-1/3">
                          <label
                            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 primary"
                            htmlFor="token-symbol"
                          >
                            Token Destinated to Early Adopter
                          </label>
                        </div>
                        <div className="md:w-2/3">
                          <input
                            type="range"
                            className="w-full"
                            min="0%"
                            max="100%"
                            step="1"
                            value={EA_liquidity}
                            onChange={(elem) => {
                              setEA_liquidity(toInteger(elem.target.value))
                              setLP_liquidity(0)
                            }}
                          />
                          <ul className="flex justify-between w-full px-[10px]">
                            <li className="flex justify-center relative">
                              <span className="absolute">0%</span>
                            </li>
                            <li className="flex justify-center relative">
                              <span className="absolute">20%</span>
                            </li>
                            <li className="flex justify-center relative">
                              <span className="absolute">40%</span>
                            </li>
                            <li className="flex justify-center relative">
                              <span className="absolute">60%</span>
                            </li>
                            <li className="flex justify-center relative">
                              <span className="absolute">80%</span>
                            </li>
                            <li className="flex justify-center relative">
                              <span className="absolute">100%</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </AutoRow>
                  </AutoColumn>
                  <AutoColumn justify="space-between" className="py-3 w-full">
                    <AutoRow
                      justify="flex flex-grow w-max"
                      className="w-full justify-center"
                      style={{ padding: '0 1rem' }}
                    >
                      <div
                        className={'flex items-center w-full space-x-3 rounded bg-dark-900 focus:bg-dark-700 p-3 h-20'}
                      >
                        <div className="md:w-1/3">
                          <label
                            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                            htmlFor="token-symbol"
                          >
                            Liquidity Destinated to Swap Pool
                          </label>
                        </div>
                        <div className="md:w-2/3">
                          <input
                            type="range"
                            className="w-full"
                            min="0%"
                            max="100%"
                            step="1"
                            value={LP_liquidity}
                            onChange={(elem) =>
                              toInteger(elem.target.value) < 100 - EA_liquidity
                                ? setLP_liquidity(toInteger(elem.target.value))
                                : 100 - EA_liquidity
                            }
                          />
                          <ul className="flex justify-between w-full px-[10px]">
                            <li className="flex justify-center relative">
                              <span className="absolute">0%</span>
                            </li>
                            <li className="flex justify-center relative">
                              <span className="absolute">20%</span>
                            </li>
                            <li className="flex justify-center relative">
                              <span className="absolute">40%</span>
                            </li>
                            <li className="flex justify-center relative">
                              <span className="absolute">60%</span>
                            </li>
                            <li className="flex justify-center relative">
                              <span className="absolute">80%</span>
                            </li>
                            <li className="flex justify-center relative">
                              <span className="absolute">100%</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </AutoRow>
                  </AutoColumn>
                  <AutoColumn justify="space-between" className="py-3">
                    <AutoRow justify="flex-start" style={{ padding: '0 1rem' }}>
                      <div className={'flex items-center w-full space-x-3 rounded bg-dark-900 focus:bg-dark-700 p-3'}>
                        <div className="md:w-1/3">
                          <label
                            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                            htmlFor="token-symbol"
                          >
                            Choose a Token
                          </label>
                        </div>
                        <div className="md:w-1">
                          <select
                            id="coin_address"
                            name="coin_address"
                            className="round"
                            value={tokenAddress}
                            onChange={(e) => {
                              setTokenAddress(e.target.value)
                            }}
                          >
                            {cryptoList?.map((element) => {
                              return (
                                <option
                                  className="bold primary"
                                  key={element._address}
                                  value={element._address}
                                  title={'Address: ' + element._address}
                                >
                                  {element._symbol + ' - ' + element._name}
                                </option>
                              )
                            })}
                          </select>
                        </div>
                      </div>
                    </AutoRow>
                  </AutoColumn>
                  <AutoColumn justify="space-between" className="py-3">
                    <AutoRow justify="flex-start" style={{ padding: '0 1rem' }}>
                      <div className={'flex items-center w-full space-x-3 rounded bg-dark-900 focus:bg-dark-700 p-3'}>
                        <div className="md:w-1/3">
                          <label
                            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                            htmlFor="token-symbol"
                          >
                            Token Launch Name
                          </label>
                        </div>
                        <div className="md:w-2/3">
                          <input
                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            name="tokenSymbol"
                            id="token-symbol"
                            type="text"
                            placeholder="Mooning BTC Launch!"
                            value={launchName}
                            onChange={(e) => setLaunchName(e.target.value)}
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
                            Days Before Unlock the Early Adopter Pool
                          </label>
                        </div>
                        <div className="md:w-1/6">
                          {/* <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-token-initial-supply" type="number" value="21000000"/> */}
                          <input
                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            name="tokenToFundCampaign"
                            id="token-to-fund-campaign"
                            type="number"
                            placeholder="0"
                            inputMode="decimal"
                            value={launching_days}
                            onChange={(e) =>
                              toInteger(e.target.value) > 180
                                ? setlaunching_days(180)
                                : setlaunching_days(toInteger(e.target.value))
                            }
                          />
                        </div>
                      </div>
                    </AutoRow>
                  </AutoColumn>

                  <AutoColumn justify="space-between" className="py-3">
                    <AutoRow justify={'flex-start'} style={{ padding: '0 1rem' }}>
                      {/*  <Button color="gradient" size="lg" onClick={(createTokenFunction)} disabled={tokenIsDeploying}> */}
                      <Button color="gradient" size="lg" onClick={launchToken} disabled={launchingCampaignInProgress}>
                        {launchingCampaignInProgress ? (
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                          </div>
                        ) : (
                          i18n._(t`Start Token Launch!`)
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
      <div>{launchList}</div>
    </Container>
  )
}
