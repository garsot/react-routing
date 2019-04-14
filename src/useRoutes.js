import React, { useEffect, useState, useMemo, createContext, useContext } from 'react'
import UseRoutesHookExtra from './UseRoutesHookExtra'

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
 * @param {String|function(params:Object, match:String):ReactElement} routes[].target  
 */
export default function useRoutes(routes, basePath) {

    const [route, setRoute] = useState(null)
    const routeTreeID = useContext(RouteTreeContext)
    const routeID = useMemo(() => routeTreeID || generateRouteTreeID(), [routes, match])
    const extra = useMemo(() => new UseRoutesHookExtra(convert(routes, basePath), routeID, setRoute), [routes, match])

    useEffect(extra.handleEffect, [])

    let currentRoute = route

    if (!route) {
        currentRoute = extra.getTargetRoute()
        extra.lastRoute = currentRoute
    }

    if (!currentRoute.target) return null

    const { target, parseResult: { params, match } } = currentRoute

    if (!routeTreeID) {
        return (
            <RouteTreeContext.Provider value={routeID}>
                {target(params, match)}
            </RouteTreeContext.Provider>
        )
    }

    return target(params, match)
}