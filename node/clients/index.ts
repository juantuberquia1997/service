import { IOClients } from '@vtex/api';
import { AdminDocuments } from './AdminDocuments';

export class Clients extends IOClients {
    public get adminDocuments() {
        return this.getOrSet('adminDocuments', AdminDocuments);
    }
}
