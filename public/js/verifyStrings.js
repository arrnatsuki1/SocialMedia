function isEmpty(string) {
    if(string == null || string == undefined){
        return true;
    }
    return string.length == 0
}


function hasWhitespaces(string) {
    if(string == null || string == undefined) {
        return true;
    }
    return /\s/g.test(string)
}

export { hasWhitespaces, isEmpty}