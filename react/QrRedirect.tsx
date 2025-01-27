import React, { useEffect } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { Spinner } from 'vtex.styleguide'


import { letterToMonth } from './utils/letterToMonth'

enum status {
    PENDING = 'pending',
}

const QrRedirect = () => {

    const { route, navigate } = useRuntime()

    const term = route?.params?.term
    const letter = term[0].toUpperCase() as keyof typeof letterToMonth
    const month = letterToMonth[letter]
    const year = term.slice(1, 3)
    const random = term.slice(3, 7)
    const productCode = term.slice(7, term.length - 4)
    const random2 = term.slice(term.length - 4, term.length)


    let data = {
        letter,
        month,
        year,
        random,
        productCode,
        random2,
        term,
        status: status.PENDING
    }

    useEffect(() => {
        localStorage.setItem('data_haceb_QR', JSON.stringify(data))
        navigate({
            to: '/hogar-haceb'
        })
    }, [])


    return (
        <div className='flex justify-center items-center w-100' style={{ height: '500px' }}><Spinner /></div>
    )
}

export default QrRedirect
