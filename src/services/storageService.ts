import {Inject, Service} from "typedi";

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
        return waitress;
    }

    private static base64toFile(file: string): Buffer {
        return Buffer.from(file, 'base64');
    }

}
