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

}
