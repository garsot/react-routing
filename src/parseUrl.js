/**
 * The function for parsing the url in accordance with the specified template/regexp.
 * 
 * @param {string|RegExp} path - template or regexp
 * For template you can specify named parameters in the format ':param_name' (for example, '/page/:subpage').  
 * If your url can have any tail, add '/*' to end of pattern (for example, '/page/:subpage/*).
 * @param {string} [url = location.pathname] - url pathname.
 * @returns {{ params: Object, match: String }}
 */
export default function parseUrl(path, url = location.pathname) {

    if (path instanceof RegExp) {

        const execResult = path.exec(url)

        return execResult && {
            match: execResult[0],
            params: execResult.slice(1)
        }
    }    

    let patternRE = '^' + path.replace(/\/:[^/\\*]+/g, '/([^/\\*]+)')

    if (!path.endsWith('/*')) {
        patternRE += "$"
    }else {
        patternRE = patternRE.slice(0,-2)
    }

    patternRE = new RegExp(patternRE)

    let paramNames = []
    let paramNameRE = /:([^*/.\\]+)/g

    for (; ;) {
        let parsedParamName = paramNameRE.exec(path)
        if (!parsedParamName) break
        paramNames.push(parsedParamName[1])
    }

    let parsedPath = patternRE.exec(url)    

    return  parsedPath && {
        match: parsedPath[0],
        params: Object.assign({}, ...paramNames.map((paramName, index) => ({ [paramName]: parsedPath[index + 1] })))
    }

}