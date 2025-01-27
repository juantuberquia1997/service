import React, { useEffect, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { canUseDOM, useRuntime } from 'vtex.render-runtime'
import { useRenderSession } from 'vtex.session-client'
import { Modal, Spinner } from 'vtex.styleguide'
import './css/styles.css'
import updateClientMd from './helpers/updateClientMd'

declare global {
  interface Window {
    gigya: {
      accounts: {
        getAccountInfo: any
        setAccountInfo: any
      }
    }
  }
}

type PropsQrValidation = {
  children: React.ReactNode
  textNotAuth: string
  registerSuccess: string
  registerError: string
  registerExist: string
}

const CSS_HANDLES = ['container_modal'] as const

const QrValidation = ({
  children,
  registerError,
  registerExist,
  registerSuccess,
  textNotAuth,
}: PropsQrValidation) => {
  const { navigate } = useRuntime()
  const { session } = useRenderSession() as any
  const handle = useCssHandles(CSS_HANDLES)
  let dataqr =
    canUseDOM && JSON.parse(localStorage.getItem('data_haceb_QR') || '{}')
  const [isModalOpen, setIsModalOpen] = useState(
    Object.keys(dataqr).length === 0 ? false : true
  )
  const [loading, setLoading] = useState(true)
  const [isAUTH, setIsAUTH] = useState(true)
  const [qrStatus, setQrStatus] = useState('')
  const [userId, setUserId] = useState(null) as any

  dataqr = { ...dataqr, dateRedemption: new Date().toISOString() }

  const handleGetAccountInfoResponse = (response: any) => {
    const isAuthenticated = session?.namespaces?.profile?.isAuthenticated?.value

    if (isAuthenticated === 'true' && response.errorCode === 0) {
      setUserId(response.data.IdVTEX)
      setLoading(false)
      const qrcode = response.data.QRCODES ? response.data.QRCODES : []

      const newqr = {
        QR: `${dataqr.letter}${dataqr.year}${dataqr.productCode}`,
      }

      const qrExists = qrcode.some((item: any) => item.QR === newqr.QR)
      if (!qrExists) {
        qrcode.push(newqr)

        let params = {
          data: {
            QRCODES: qrcode,
          },
        }
        window.gigya.accounts.setAccountInfo(params)
      }
    } else if (response.errorCode !== 0 || isAuthenticated === 'false') {
      setLoading(false)
      setIsAUTH(false)
    }
  }

  useEffect(() => {
    if (userId) {
      // Respuestas de la petición
      const responses: { [key: number]: string } = {
        0: registerSuccess,
        1: registerError,
        2: registerExist,
      }

      const updateClient = updateClientMd(userId, dataqr)
      updateClient.then(status => {
        setQrStatus(responses[status])
        setLoading(false)
        localStorage.removeItem('data_haceb_QR')
      })
    }
  }, [userId])

  useEffect(() => {
    setTimeout(() => {
      window.gigya.accounts.getAccountInfo({
        callback: handleGetAccountInfoResponse,
      })
    }, 3000)
  }, [session])

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }
  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        title={isAUTH ? 'Estado del registro' : 'Inicia sesión'}
        responsiveFullScreen={false}
        onClose={handleCloseModal}
      >
        {isAUTH ? (
          <div className="flex justify-center items-center w-100">
            {loading ? (
              <Spinner />
            ) : (
              <div className="flex flex-column justify-center">
                <p className="f4 tc">{qrStatus}</p>
                <button
                  className="w-100 mt3 pa3 bg-action-primary white bn br2"
                  onClick={() => {
                    handleCloseModal()
                    navigate({ to: '/account#/hogar-haceb' })
                  }}
                >
                  Ver mis productos
                </button>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`flex justify-center items-center w-100 ${handle.handles.container_modal}`}
          >
            {loading ? (
              <Spinner />
            ) : (
              <div className="flex flex-column justify-center">
                <p className="f4 tc">{textNotAuth}</p>
                {children}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

QrValidation.defaultProps = {
  textNotAuth:
    'Para poder registrar tu producto es necesario que tengas una cuenta activa, si ya la tienes por favor inicia sesión',
  registerSuccess: 'Producto registrado exitosamente',
  registerError:
    'Hubo un error al registrar el producto, por favor intenta de nuevo, si el problema persiste contáctanos',
  registerExist: 'Este producto ya se encuentra registrado',
}

QrValidation.schema = {
  title: 'Mensajes de validación de QR',
  description: 'Modifica los mensajes de validación de QR',
  type: 'object',
  properties: {
    textNotAuth: {
      title: 'Texto para no autenticado',
      type: 'string',
    },
    registerSuccess: {
      title: 'Mensaje de registro exitoso',
      type: 'string',
    },
    registerError: {
      title: 'Mensaje de error en el registro',
      type: 'string',
    },
    registerExist: {
      title: 'Mensaje de registro existente',
      type: 'string',
    },
  },
}

export default QrValidation
