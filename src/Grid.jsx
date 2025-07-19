import React from 'react'
import { Utils } from 'alchemy-sdk';

export default function Grid({results, tokenDataObjects}) {
  return (
    <>
        {
            results?.tokenBalances?.map((e, i) => {
                return (
                    <div className='flex w-full justify-between items-center border-b-2 border-gray-200 py-3 px-6'
                        key={e?.contractAddress}>
                        <div className='flex gap-12 font-semibold items-center'>
                            <p>1</p>
                            <div className='flex flex-col'>
                                <h3 className=' text-xl'>{tokenDataObjects[i]?.name}</h3>
                                <p className=' opacity-60'>{tokenDataObjects[i]?.symbol}</p>
                            </div>
                        </div>
                        <p className='font-semibold text-xl'>{Utils.formatUnits(e.tokenBalance, tokenDataObjects[i]?.decimals)}</p>
                    </div>
                )
            })

        }
    </>
  )
}
