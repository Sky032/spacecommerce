

export default class CustomError {

    static createError({ name = 'Error', cause, message, code }) {
        const error = new Error(message, cause, name, code)
        error.name = name
        error.message = message
        error.cause = cause
        error.code = code

        throw error
    }
}