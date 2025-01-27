const updateClientMd = async (IdVTEX: string, data: any) => {
  // Respuestas de la petición
  // 0: 'Producto registrado exitosamente',
  // 1: 'Hubo un error al registrar el producto, por favor intenta de nuevo, si el problema persiste contáctanos',
  // 2: 'Este producto ya ha sido registrado anteriormente',


  let res
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  myHeaders.append('Accept', 'application/vnd.vtex.ds.v10+json')
  myHeaders.append('Cookie', 'janus_sid=38ceb1fc-9a1b-4c1f-b9d5-aaae5b0b925d')

  const requestOptionsGet = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  }

  const requestOptionsPatch = {
    method: 'PATCH',
    headers: myHeaders,
    body: null as any,
    redirect: 'follow',
  }

  try {
    const response = await fetch(
      `/api/dataentities/CL/documents/${IdVTEX}?_fields=extraGuarantee`,
      requestOptionsGet as any
    )
    const responseData = await response.json()
    if (responseData.extraGuarantee && responseData.extraGuarantee.length > 0) {
      const termExists = responseData.extraGuarantee.some(
        (item: any) => item.term === data.term
      )

      if (!termExists) {
        requestOptionsPatch.body = JSON.stringify({
          extraGuarantee: [...responseData.extraGuarantee, data],
        })

        await fetch(
          `/api/dataentities/CL/documents/${IdVTEX}`,
          requestOptionsPatch as any
        )

        res = 0
      } else {
        res = 2
      }
    } else {
      // Si no hay datos previos, simplemente agregar el nuevo objeto
      requestOptionsPatch.body = JSON.stringify({
        extraGuarantee: [data],
      })

      await fetch(
        `/api/dataentities/CL/documents/${IdVTEX}`,
        requestOptionsPatch as any
      )

      res = 0
    }
  } catch (error) {
    console.error('Error:', error)
    res = 1
  }

  return res
}

export default updateClientMd
