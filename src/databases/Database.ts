interface Database {
    getUser(user: string, hash: string): Promise<[boolean, boolean]>
}

export default Database