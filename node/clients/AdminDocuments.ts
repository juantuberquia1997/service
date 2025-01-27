import type { InstanceOptions, IOContext } from '@vtex/api'
import { MasterData } from '@vtex/api'

export class AdminDocuments extends MasterData {
    constructor(context: IOContext, options?: InstanceOptions) {
        super(context, {
            ...(options ?? {}),
            headers: {
                ...(options?.headers ?? {}),
                'Content-Type': 'application/json; charset=utf-8',
                Accept: 'application/vnd.vtex.ds.v10+json',
                'REST-Range': 'resources=0-500',
                VtexIdclientAutCookie: `${context.adminUserAuthToken ??
                    context.storeUserAuthToken ??
                    context.authToken ??
                    ''}`,
                'X-Vtex-Use-Https': 'true',
            },
        })
    }

    public async searchMd(where: string, fields: string[], dataEntity: string, page: number = 1, pageSize: number = 50, sort: string) {

        try {
            const result = await this.searchDocuments({
                sort,
                where,
                dataEntity,
                pagination: {
                    page,
                    pageSize,
                },
                fields,
            })
            return result
        } catch (error) {
            console.error(`Error searching documents in dataEntity ${dataEntity}:`, error)
            throw new Error('Failed to search documents.')
        }
    }

    public async createOrUpdateDocument(dataEntity: string, document: any) {
        // Se usa null si el documento no tiene ID (se creará un nuevo documento)
        const documentId = document.id || null;

        try {
            const result = await this.createOrUpdatePartialDocument({
                dataEntity,
                fields: document,
                id: documentId,  // Si no hay ID, se pasará como null o undefined
                schema: 'v1',    // Asegúrate de usar el esquema correcto para tu caso
            });
            return result;
        } catch (error) {
            console.error(`Error creando/actualizando documento en dataEntity ${dataEntity}:`, error);
            throw new Error('Error al crear o actualizar el documento.');
        }
    }

    public async deleteDocumentById(dataEntity: string, documentId: string) {
        if (!documentId) {
            throw new Error('Document ID is required for deletion.')
        }

        try {
            await this.deleteDocument({
                dataEntity,
                id: documentId,
            })
        } catch (error) {
            console.error(`Error deleting document ${documentId} in dataEntity ${dataEntity}:`, error)
            throw new Error('Failed to delete the document.')
        }
    }
}
