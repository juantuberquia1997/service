import { UserInputError } from '@vtex/api';
import { map, mergeAll, prop, zipObj } from 'ramda';

import type {
    DocumentsArgs,
    CreateDocumentArgs,
    UpdateDocumentArgs,
    DeleteDocumentArgs,
} from '../types/masterdata';

const mapKeyAndStringifiedValues = (document: any) =>
    Object.keys(document).map((key) => ({
        key,
        value:
            typeof document[key] === 'string'
                ? document[key]
                : JSON.stringify(document[key]),
    }));

const parseFieldsToJson = (fields: any) =>
    mergeAll(fields.map((field: any) => zipObj([field.key], [field.value])));

export async function documents(_: any, args: DocumentsArgs, ctx: Context) {
    const {
        clients: { masterdata },
    } = ctx;

    const { acronym, fields, page, pageSize, where, schema, sort } = args;

    const data = (await masterdata.searchDocuments({
        dataEntity: acronym,
        fields,
        where,
        pagination: {
            page,
            pageSize,
        },
        schema,
        sort,
    })) as any;

    return map((document: any) => ({
        id: document.id,
        fields: mapKeyAndStringifiedValues(document),
    }))(data);
}

export async function createDocument(
    _: any,
    args: CreateDocumentArgs,
    ctx: Context
) {
    const {
        clients: { masterdata },
    } = ctx;

    const {
        acronym,
        document: { fields },
        schema,
    } = args;

    const response = await masterdata.createDocument({
        dataEntity: acronym,
        fields: parseFieldsToJson(fields),
        schema,
    });

    return {
        documentId: response.DocumentId,
    };

    return response;
}

export async function updateDocument(
    _: any,
    args: UpdateDocumentArgs,
    ctx: Context
) {
    const {
        clients: { masterdata },
    } = ctx;

    const {
        acronym,
        document: { fields },
        schema,
    } = args;

    const DocumentId = prop('id', parseFieldsToJson(fields)) as string;

    if (!DocumentId) {
        throw new UserInputError('document id field cannot be null/undefined');
    }

    await masterdata.updatePartialDocument({
        dataEntity: acronym,
        id: DocumentId,
        fields: parseFieldsToJson(fields),
        schema,
    });

    return {
        documentId: DocumentId,
    };
}

export async function deleteDocument(
    _: any,
    args: DeleteDocumentArgs,
    ctx: Context
) {
    const {
        clients: { masterdata },
    } = ctx;

    const { acronym, documentId } = args;

    if (!documentId) {
        throw new UserInputError('document id field cannot be null/undefined');
    }

    await masterdata.deleteDocument({
        dataEntity: acronym,
        id: documentId,
    });

    return {
        documentId,
    };
}
