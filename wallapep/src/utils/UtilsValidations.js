export let validateFormDataInputRequired =
    (formData, inputKey, formErrors) => {

        let regexNotEmpty = /^(.+)$/;
        let errorMessage = "Required"
        return validateFormDataInput(
            formData, inputKey, formErrors, regexNotEmpty, errorMessage)
    }


export let validateFormDataInputEmail =
    (formData, inputKey, formErrors) => {

        let regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
        let errorMessage = "Not email format"
        return validateFormDataInput(
            formData, inputKey, formErrors, regexEmail, errorMessage)
    }

export let validateFormDataInput =
    (formData, inputKey, formErrors, regex, msgError) => {
        const newFormErrors = { ...formErrors };

        // Si el campo no tiene valor, no validamos hasta que el usuario intente enviar
        if (formData[inputKey] === null || formData[inputKey] === undefined || formData[inputKey] === '') {
            // Si ya hay un error, lo mantenemos. Si no, no añadimos uno nuevo hasta el submit.
            if (newFormErrors[inputKey] && newFormErrors[inputKey].type !== "server") {
                return { ...newFormErrors };
            }
            return { ...newFormErrors, [inputKey]: null }; // o mantener el error si ya existe
        }

        // Mantener errores de servidor
        if (newFormErrors[inputKey]?.type === "server") {
            return newFormErrors; // No sobrescribir errores de servidor con validaciones de cliente
        }

        // Validar con la regex
        if (regex.test(formData[inputKey])) {
            // Si pasa la validación, eliminamos cualquier error de cliente
            if (newFormErrors[inputKey] && newFormErrors[inputKey].type !== "server") {
                newFormErrors[inputKey] = null;
            }
            return newFormErrors; // Retorna el objeto de errores sin este error de cliente
        } else {
            // Si no pasa la validación, establecemos el error de cliente
            newFormErrors[inputKey] = { msg: msgError, type: "client" };
            return newFormErrors; // Retorna el objeto de errores con el nuevo error
        }
    }

export let allowSubmitForm = (formErrors) => {
    // Verifica si hay algún error de validación de cliente
    for (const key in formErrors) {
        if (formErrors[key] && formErrors[key].type !== "server") {
            return false;
        }
    }
    return true;
}

export let setServerErrors = (serverErrors, setFormErrors) => {
    let newFormErrors = {} //delete all previous
    if ( Array.isArray(serverErrors)){
        serverErrors.forEach(e => {
            newFormErrors[e.field] = { msg: e.msg, type: "server" }
        });
    }
    // destroy all previous errors is a new SET
    setFormErrors(newFormErrors)
}

export let joinAllServerErrorMessages = (serverErrors) => {
    let generalErrorMessage = "";
    if ( Array.isArray(serverErrors)){
        serverErrors.forEach(e => {
            generalErrorMessage += e.msg
        });
    } else {
        if (serverErrors?.msg != null){
            generalErrorMessage = serverErrors.msg;
        }
    }
    return generalErrorMessage
}

