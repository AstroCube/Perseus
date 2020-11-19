import {Inject, Service} from "typedi";
import {IStorageManifest} from "../interfaces/IStorageManifest";

@Service()
export class StorageService {

    constructor(
        @Inject("storage") private storageClient: any
    ) {
    }

    public async writeFile(file: string): Promise<IStorageManifest> {
        return await this.storageClient.write(StorageService.base64toFile(file));
    }

    public async readFile(id: string): Promise<Buffer> {
        return await this.storageClient.read(id);
    }

    private static base64toFile(file: string): Buffer {
        return Buffer.from(file, 'base64');
    }

}
