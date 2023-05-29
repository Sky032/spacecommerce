import UserDTO from '../dao/DTO/users.dto.js'

export default class CartRepository {
    
    constructor(dao) {
        this.dao = dao;
    }

    getUsers = async() => {
        return await this.dao.getUsers()
    }

    getUser = async(data) => {
        return await this.dao.getUser(data)
    }

    getById = async(uid) => {
        return await this.dao.getById(uid)
    }

    createUser = async(data) => {
        const user = new UserDTO(data)
        const result = this.dao.createUser(user)

        return result
    }

    updateUser = async(userEmail, cid) => {
        return this.dao.updateUser(userEmail, cid);
    }

    modifyRol = async(uid) => {
        return this.dao.modifyRol(uid);
    }

    sendResetMail = async (userEmail) => {
        return this.dao.sendResetMail(userEmail);
    }

    resetPassword = async(uid, token, password) => {
        return this.dao.resetPassword(uid, token, password)
    }

    updateLastConnection = async (uid) => {
        return this.dao.updateLastConnection(uid)
    }

    uploadDocs = async (uid, files) => {
        return this.dao.uploadDocs(uid, files)
    }

    deleteInactiveUsers = async (hs) => {
        return this.dao.deleteInactiveUsers(hs)
    }

}