export const onInvalidSubmit = (fieldsToTrim, getValues, setValue) => {
    fieldsToTrim.forEach((fieldName) => {
        const value = getValues(fieldName);

        if (typeof value === 'string') {
            setValue(fieldName, value.trim(), { shouldValidate: true });
        }
    });
}