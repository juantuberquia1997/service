import type { ClientsConfig, RecorderState, ServiceContext } from '@vtex/api';
import { LRUCache, method, Service } from '@vtex/api';

import { Clients } from './clients';
import { createOrUpdateDocument } from './Middleware/createOrUpdateDocument';
import { deleteDocument } from './Middleware/deleteDocument';
import { searchDocumentsMD } from './Middleware/searchDocuments';
import { resolvers } from './resolvers';

declare global {
    // eslint-disable-next-line no-unused-vars, no-use-before-define
    type Context = ServiceContext<Clients, State>

    interface State extends RecorderState {
    }
}
const TIMEOUT_MS = 800;

const memoryCache = new LRUCache<string, any>({ max: 5000 });

metrics.trackCache('status', memoryCache);

const clients: ClientsConfig<Clients> = {
    implementation: Clients,
    options: {
        default: {
            retries: 2,
            timeout: TIMEOUT_MS,
        },
        status: {
            memoryCache,
        },
    },
};



export default new Service({
    clients,
    graphql: {
        resolvers,
    },
    routes: {
        searchDocumentsMD: method({
            GET: [searchDocumentsMD],
        }),
        createOrUpdateDocument: method({
            PATCH: [createOrUpdateDocument],
        }),
        deleteDocument: method({
            DELETE: [deleteDocument],
        }),
        health: method({
            GET: async (ctx: Context) => {
                ctx.status = 200;
                ctx.body = 'OK';
            },
        })
    }
});
