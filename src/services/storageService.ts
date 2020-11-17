import {Inject, Service} from "typedi";
import fs from 'fs';

@Service()
export class StorageService {

    constructor(
        @Inject("storage") private storageClient: any
    ) {
    }

    public async writeFile(file: string, name: string): Promise<any> {
        await fs.writeFileSync("temp/" + name, file, 'base64');
        const response = await this.storageClient.write("temp/" + name);
        await fs.unlinkSync("temp/" + name);
        return response;
    }

    public async readFile(id: string): Promise<Buffer> {
        return await this.storageClient.read(id);
    }

}
