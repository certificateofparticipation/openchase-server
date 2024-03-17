import {User} from "../utility/models";

interface Database {
    getUser(user: string, hash: string): Promise<User>
    createUser(name: string, hash: string, admin: boolean): Promise<User>
}

export default Database