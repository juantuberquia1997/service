import { json } from 'co-body'

export async function createOrUpdateDocument(ctx: Context, next: () => Promise<any>) {
    const {
        clients: { adminDocuments },
    } = ctx

    // Extraer dataEntity y document directamente del cuerpo de la solicitud
    const bodyParams = await json(ctx.req)
    const { dataEntity, document } = bodyParams
    //datos de prueba,
    //url =/_v/:dataEntity/document
    //body= {
    /* "dataEntity": "BG",
    "document": {
    "post":"testcreate3","title":"testcreate3"
    }
} */


    // Validación: dataEntity es obligatorio, y el documento debe estar presente
    if (!dataEntity || !document) {
        ctx.status = 400
        ctx.body = {
            error: 'Falta el parámetro obligatorio: dataEntity o document',
        }
        return
    }

    try {
        // Llamar a la función que creará o actualizará el documento, pasando el documento completo
        const response = await adminDocuments.createOrUpdateDocument(dataEntity, document)
        // Devolver la respuesta
        ctx.status = 200
        ctx.body = response
    } catch (error) {
        console.error('Error al crear o actualizar el documento:', error)
        ctx.status = 500
        ctx.body = {
            error: 'No se pudo crear o actualizar el documento',
        }
    }

    ctx.set('cache-control', 'no-cache')
    await next()
}
