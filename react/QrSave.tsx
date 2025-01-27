import React, { useEffect, useState } from 'react'
import { canUseDOM, useRuntime } from 'vtex.render-runtime'
import { useRenderSession } from 'vtex.session-client'
import updateClientMd from './helpers/updateClientMd'
import { letterToMonth } from './utils/letterToMonth'


declare global {
    interface window {
        gigya: {
            accounts: {
                getAccountInfo: any
                setAccountInfo: any
            }
        }
    }
}

export default function QrSave() {
    const { session } = useRenderSession() as any
    const { navigate, route } = useRuntime()
    const [isAuth, setIsAuth] = useState(false)
    const [userId, setUserId] = useState(null) as any
    let dataQR = canUseDOM && JSON.parse(localStorage.getItem('data_haceb_QR') || '{}')
    const [responseCDC, setResponseCDC] = useState() as any

    useEffect(() => {
        if (!session) return
        setIsAuth(session?.namespaces?.profile?.isAuthenticated?.value)
    }, [session])

    function handleGetAccountInfoResponse(response: any) {
        if (isAuth && response.errorCode === 0) {
            setUserId(response.data.IdVTEX)
            setResponseCDC(response)
        }
    }

    const existDataLocal = () => {

        let contentDataLocal = Object.values(dataQR)

        if (contentDataLocal.length === 0) {
            const term = route?.params?.term
            const letter = term?.[0].toUpperCase() as keyof typeof letterToMonth
            const month = letterToMonth[letter]
            const year = term?.slice(1, 3)
            const random = term?.slice(3, 7)
            const productCode = term?.slice(7, term.length - 4)
            const random2 = term?.slice(term.length - 4, term.length)

            let data = {
                letter,
                month,
                year,
                random,
                productCode,
                random2,
                term,
                status: "pending"
            }

            localStorage.setItem('data_haceb_QR', JSON.stringify(data))
            return true
        }
        return true
    }

    useEffect(() => {

        if (!userId) return
        if (!responseCDC) return

        let params = null;
        const qrcode = responseCDC.data.QRCODES ? responseCDC.data.QRCODES : []
        const qrExists = qrcode.some((item: any) => item.QR === newqr?.QR)
        let validateData = existDataLocal()

        if (validateData) {
            dataQR = { ...dataQR, dateRedemption: new Date().toISOString() }
        }

        const newqr = {
            QR: `${dataQR.letter}${dataQR.year}${dataQR.productCode}`,
        }

        if (newqr.QR && !newqr.QR.includes('undefined')) {
            if (!qrExists) {
                qrcode.push(newqr)
                params = {
                    data: {
                        QRCODES: qrcode,
                    },
                }
            }
        }

        if (params && dataQR) {
            const updateClient = updateClientMd(userId, dataQR)
            window.gigya.accounts.setAccountInfo(params)

            updateClient.then(() => {
                localStorage.removeItem('data_haceb_QR')
                navigate({
                    to: '/account#/hogar-haceb'
                })
            })

        }

    }, [userId, responseCDC])

    useEffect(() => {
        setTimeout(() => {
            window.gigya.accounts.getAccountInfo({
                callback: handleGetAccountInfoResponse,
            })
        }, 3000)
    }, [isAuth])
    return (
        <>
        </>
    )
}
