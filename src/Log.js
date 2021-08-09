const IS_DEBUG = 1

const LogCategories = {
    DEBUG: 'DEBUG'
}

const Log = (Category, Name, Value) => {
    if (IS_DEBUG !== 0 && Category === LogCategories.DEBUG) {
        const Str = Value !== undefined ? (Name + ': ' + Value) : Name
        console.log('[' + Category + '] ' + Str)
    }
}

module.exports = {
    Log: Log,
    LogCategories: LogCategories
}
