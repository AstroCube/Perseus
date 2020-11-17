import {Inject, Service} from "typedi";

@Service()
export class StorageService {

    constructor(
        @Inject("storage") private storageClient: any
    ) {
    }

    public async writeFile(file: string): Promise<any> {

        console.log(this.storageClient);

        const test = await this.storageClient.write(Buffer.from(file, 'base64'), "");
        console.log(test);
        return test;
    }

    private static base64toFile(file: string): Buffer {
        return Buffer.from(file, 'base64');
    }

}
