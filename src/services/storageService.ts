import {Inject, Service} from "typedi";
import fs from 'fs';

@Service()
export class StorageService {

    constructor(
        @Inject("storage") private storageClient: any
    ) {
    }

    public async writeFile(file: string, name: string): Promise<any> {
        fs.writeFileSync("/tmp/" + name, file, 'base64');
        const response = await this.storageClient.write("/tmp/" + name);
        await fs.unlinkSync("/tmp/" + name);
        return response;
    }

    public async readFile(id: string): Promise<Buffer> {
        return await this.storageClient.read(id);
    }

}
