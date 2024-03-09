interface Database {
    getUser(user: string, hash: string): Promise<boolean>
}

export default Database