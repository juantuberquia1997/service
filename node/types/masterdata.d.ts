export interface PaginationArgs {
    page: number
    pageSize: number
}
export interface CreateDocumentArgs {
    acronym: string
    document: { fields: KeyValue[] }
    schema?: string
}
export interface DocumentArgs {
    acronym: string
    fields: string[]
    id: string
}
export interface DocumentsArgs {
    acronym: string
    fields: string[]
    page: number
    pageSize: number
    where: string
    sort: string
    schema?: string
}
export interface UpdateDocumentArgs {
    acronym: string
    document: { fields: KeyValue[] }
    schema?: string
}
export interface DeleteDocumentArgs {
    acronym: string
    documentId: string
    schema?: string
}


/*client*/

export interface PaginationArgs {
    page: number;
    pageSize: number;
}
export interface DocumentResponse {
    Id: string;
    Href: string;
    DocumentId: string;
}
export interface GetSchemaInput {
    dataEntity: string;
    schema: string;
}
export interface CreateSchemaInput {
    dataEntity: string;
    schemaName: string;
    schemaBody: object;
}
export interface GetDocumentInput {
    dataEntity: string;
    id: string;
    fields: string[];
}
export interface CreateDocumentInput {
    dataEntity: string;
    fields: object;
    schema?: string;
}
export interface CreateOrUpdateInput {
    dataEntity: string;
    fields: object;
    id?: string;
    schema?: string;
}
export interface UpdateInput {
    dataEntity: string;
    id: string;
    fields: object;
    schema?: string;
}
export interface SearchInput {
    dataEntity: string;
    fields: string[];
    where?: string;
    pagination: PaginationArgs;
    schema?: string;
    sort?: string;
}
export interface ScrollInput {
    dataEntity: string;
    fields: string[];
    where?: string;
    schema?: string;
    sort?: string;
    size?: number;
    mdToken?: string;
}
export interface DeleteInput {
    dataEntity: string;
    id: string;
}
export interface ScrollResponse<T> {
    data: T[];
    mdToken: string;
}