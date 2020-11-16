import {Inject, Service} from "typedi";
import atob from "atob";

@Service()
export class StorageService {

    constructor(
        @Inject("storage") private storageClient: any
    ) {
    }

    public async writeFile(file: string, name: string): Promise<any> {
        return await this.storageClient.write(StorageService.base64toFile(file, name));
    }

    private static base64toFile(file: string, name: string): File {

        const arr = file.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while(n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], name, {type:mime});
    }

}
