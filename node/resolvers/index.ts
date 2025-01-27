import {
    documents,
    createDocument,
    updateDocument,
    deleteDocument,
} from './masterData';

export const resolvers = {
    Query: {
        getElements: documents,
    },
    Mutation: {
        saveElement: createDocument,
        updateElement: updateDocument,
        deleteElement: deleteDocument,
    },
};
