/**
 * The function for parsing the url in accordance with the specified pattern.
 * 
 * @param {string|RegExp} path - url-string, url-pattern or url-regexp
 * For url-pattern you can specify named parameters in the format ':param_name' (for example, '/page/:subpage').  
 * If your url can have any tail, add '/*' to end of pattern (for example, '/page/:subpage/*).
 * @param {string} [url = location.pathname] - url pathname.
 * @returns {Object} if you use RegExp then the exec method result will be returned; 
 * Otherwise, will be returned object with named params values, empty object (if no named params and tail in the pattern) or null (if the path does not match the pattern).
 * The tail will be placed in the parameter named '_'.
 */
export default function parseUrl(path, url = location.pathname) {    

    if (path instanceof RegExp) {
        return path.exec(url)
    }

    let patternRE = new RegExp('^' + path.replace(/\/:[^/\\*]+/g, '/([^/\\*]+)').replace(/\/\*$/g, '((?:/[^/\\*]+)*)') + '$')

    let paramNames = []
    let paramNameRE = /:([^*/.\\]+)/g

    for (; ;) {
        let parsedParamName = paramNameRE.exec(path)
        if (!parsedParamName) break
        paramNames.push(parsedParamName[1])
    }

    let parsedPath = patternRE.exec(url)

    if (!parsedPath) return null

    if (path.endsWith('/*')) paramNames.push("_")

    return Object.assign({}, ...paramNames.map((paramName, index) => ({ [paramName]: parsedPath[index + 1] })))
}