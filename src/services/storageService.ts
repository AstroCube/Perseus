import {Inject, Service} from "typedi";
import fs from 'fs';

@Service()
export class StorageService {

    constructor(
        @Inject("storage") private storageClient: any
    ) {
    }

    public async writeFile(file: string): Promise<any> {
        return await this.storageClient.write(StorageService.base64toFile(file));
    }

    public async readFile(id: string): Promise<Buffer> {
        const waitress = await this.storageClient.read(id);
        console.log(waitress);
        return waitress;
    }

    private static base64toFile(file: string): Buffer {
        return Buffer.from(file, 'base64');
    }

}
