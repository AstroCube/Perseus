import {Inject, Service} from "typedi";

@Service()
export class StorageService {

    constructor(
        @Inject("storage") private storageClient: any
    ) {
    }

    public async writeFile(file: string): Promise<any> {

        console.log(this.storageClient);

        const test = await this.storageClient.write(new Buffer("atroo")).then((fileInfo) => {

            // The fid's will be the same, to access each variaton just
            // add _ARRAYINDEX to the end of the fid. In this case fileB
            // would be: fid + "_1"

            const fidA = fileInfo;
            const fidB = fileInfo + "_1";

            console.log(fileInfo);

            return fileInfo;
        }).catch((err) => {
            console.log(err);
        });
        return test;
    }

    private static base64toFile(file: string): Buffer {
        return Buffer.from(file, 'base64');
    }

}
