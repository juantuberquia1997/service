import React, { useEffect, useState } from 'react'
import { useRenderSession } from 'vtex.session-client'
import updateInfoUserMD from './helpers/updateInfoUserMD'

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

export default function SaveInfoUser() {
    const { session } = useRenderSession() as any
    const [isAuth, setIsAuth] = useState(false)

    useEffect(() => {
        if (!session) return
        setIsAuth(session?.namespaces?.profile?.isAuthenticated?.value)
    }, [session])

    function handleGetAccountInfoResponse(response: any) {
        if (isAuth && response.errorCode === 0) {
            updateInfoUserMD(response)
        }
    }

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
