export const generateInputError = (input) => {
    return `Ha ocurrido un problema con los datos ingresados:
            - ${input} no es válido, por fabor chequee e ingreselo de nuevo.`
}

export const generateGeneralError = () => {
    return `Ups! Ha ocurrido un problema inesperado!:`
}

export const generateNotFoundError = (searched) => {
    return `Ha habido un problema tratando de encontrar lo que has solicitado:
            - ${searched.id ? searched.id : searched.email} no ha sido encontrado.`
}

export const generateNoStockError = (pid) => {
    return `Ha habido un problema tratando de el producto al carrito:
            - El producto ${pid} no dispone de suficiente stock.`
}

export const generateNoLoggedUser = () => {
    return `No se ha detectado ninguna sesión activa. Por favor logueate para poder acceder a tu información.`
}

export const generateAuthenticationError = (user) => {
    return `Ocurrió un problema en el login:
            - ${user.email}, las credenciales no son correctas, por favor revise y vuelva a ingresarlas..`
}

export const generateAutorizationError = (user) => {
    return `Ha ocurrido un problema de permisos:
            - ${user.email} no dispone de los permisos para el endpoint solicitado.`
}

export const generatePermisionError = (user) => {
    return `Su rol de ${user.rol} no le permite realizar este acción.`
}