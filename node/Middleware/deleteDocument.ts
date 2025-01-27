import { json } from 'co-body'

export async function deleteDocument(ctx: Context, next: () => Promise<any>) {
    const {
        clients: { adminDocuments },
    } = ctx

    // Extraer dataEntity y documentId directamente del cuerpo de la solicitud
    const bodyParams = await json(ctx.req)
    const { dataEntity, documentId } = bodyParams

    // Validación: dataEntity y documentId son obligatorios
    if (!dataEntity || !documentId) {
        ctx.status = 400
        ctx.body = {
            error: 'Falta el parámetro obligatorio: dataEntity o documentId',
        }
        return
    }
    //datos de prueba,
    // url = /_v/:dataEntity/document
    // body= {{
    /*   "dataEntity": "BG",
    "documentId": "{{primero crear uno, luego copiar el documentID y pegarlo aqui}}" */


    try {
        // Llamar a la función que eliminará el documento
        await adminDocuments.deleteDocumentById(dataEntity, documentId)

        // Devolver un estado exitoso
        ctx.status = 200
        ctx.body = {
            message: `Documento con ID ${documentId} eliminado exitosamente.`,
        }
    } catch (error) {
        console.error(`Error al eliminar el documento con ID ${documentId}:`, error)
        ctx.status = 500
        ctx.body = {
            error: 'No se pudo eliminar el documento.',
        }
    }

    ctx.set('cache-control', 'no-cache')
    await next()
}
