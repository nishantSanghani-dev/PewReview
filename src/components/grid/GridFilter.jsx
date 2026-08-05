export const getBackendFilters = (filter) => {
    if (!filter) {
        return []
    }

    const normalize = (descriptor) => {
        if (!descriptor) {
            return []
        }

        if (Array.isArray(descriptor.filters)) {
            return descriptor.filters.flatMap(normalize)
        }

        const isStatusField = descriptor.field === 'isActive'
        const normalizedValue = isStatusField
            ? descriptor.value === true || descriptor.value === 'true' || descriptor.value === 1 || descriptor.value === '1'
                ? '1'
                : '0'
            : descriptor.value

        return [
            {
                Field: descriptor.field,
                Value: normalizedValue,
                OperatorType: isStatusField ? 2 : 8,
            },
        ]
    }

    return normalize(filter)
}