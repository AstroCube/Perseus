import {Document} from "mongoose";

const forumWare = {

    find: (doc: Document) => {
        console.log(this.constructor);
        console.log(doc);
        console.log(this);
    }

};

export default forumWare;
