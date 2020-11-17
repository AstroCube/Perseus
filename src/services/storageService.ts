import {Inject, Service} from "typedi";

@Service()
export class StorageService {

    constructor(
        @Inject("storage") private storageClient: any
    ) {
    }

    public async writeFile(file: any): Promise<any> {
        return await this.storageClient.write(file);
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
