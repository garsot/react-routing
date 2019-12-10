import React, { useEffect, useState, useMemo, createContext, useContext } from 'react'
import UseRoutesHookExt from './UseRoutesHookExt'

function convert(routes, basePath) {

    if (!(routes instanceof Array)) {
        routes = Object.entries(routes).map(([path, target]) => {

            if (path[0] === '@') {
                path = new RegExp(path.slice(1))
            }

            return { path, target }
        })
    }

    if (basePath) {
        for (let route of routes) {
            let isRegExp = route.path instanceof RegExp
            if (isRegExp) route.path = route.path.source
            route.path = basePath + '/' + route.path
            if (isRegExp) route.path = new RegExp(route.path)
        }
    }

    return routes
}

function generateRouteTreeID() {
    generateRouteTreeID.id = generateRouteTreeID.id ? generateRouteTreeID.id + 1 : 1
    return generateRouteTreeID.id
}

const RouteTreeContext = createContext()
RouteTreeContext.displayName = 'RouteTreeContext'

/**
 * Routing hook
 * @param {Object[]|Object} routes
 * @param {String|RegExp} [routes[].path = '/*' ] 
 * @param {String|function(params:Object, match:String, props:Object):ReactElement} routes[].target
 * @param {String} basePath - base path of routes
 * @param {Object} props - properties passed to the component
 */
export default function useRoutes(routes, basePath, props) {

    const [route, setRoute] = useState(null)
    const routeTreeID = useContext(RouteTreeContext)
    const routeID = useMemo(() => routeTreeID || generateRouteTreeID(), [routes, basePath])
    const ext = useMemo(() => new UseRoutesHookExt(convert(routes, basePath), routeID, setRoute), [routes, basePath])

    useEffect(ext.handleEffect, [])

    let currentRoute = route

    if (!route) {
        currentRoute = ext.getTargetRoute()
        ext.lastRoute = currentRoute
    }

    if (!currentRoute.target) return null

    const { target, parseResult: { params, match } } = currentRoute

    if (!routeTreeID) {
        return (
            <RouteTreeContext.Provider value={routeID}>
                {target(params, match, props)}
            </RouteTreeContext.Provider>
        )
    }

    return target(params, match, props)
}