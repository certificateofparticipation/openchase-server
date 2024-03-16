interface Database {
    getUser(user: string, hash: string): Promise<[boolean, boolean]>
    createUser(name: string, hash: string, admin: boolean): Promise<boolean>
}

export default Database