import React, { useEffect, useState, useMemo, createContext, useContext } from 'react'
import UseRoutesHookExtra from './UseRoutesHookExtra'

function convert(routes) {

    if (!(routes instanceof Array)) {
        return Object.entries(routes).map(([path, target]) => {

            if (path[0] === '~') {
                path = new RegExp(path.slice(1))
            }

            return { path, target }
        })
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
 * @param {String|ReactComponent} routes[].target
 * @param {function(params:object)} routes[].execTarget
 * @param {String|ReactComponent} [defaultComponent]
 */
export default function useRoutes(routes, defaultComponent) {

    const [route, setRoute] = useState(null)
    const routeTreeID = useContext(RouteTreeContext)
    const routeID = useMemo(() => routeTreeID || generateRouteTreeID(), [routes])
    const extra = useMemo(() => new UseRoutesHookExtra(convert(routes), defaultComponent, routeID, setRoute), [routes])

    useEffect(extra.handleEffect, [])

    let currentRoute = route

    if (!route) {
        currentRoute = extra.getTargetRoute()
        extra.currentRoute = currentRoute
    }

    const TargetComponent = currentRoute && currentRoute.component
    const params = currentRoute ? currentRoute.params : {}

    return [
        (props = params) => {

            if (TargetComponent) {
                const targetElement = <TargetComponent {...props} />

                if (!routeTreeID) {
                    return (
                        <RouteTreeContext.Provider value={routeID}>
                            {targetElement}
                        </RouteTreeContext.Provider>
                    )
                }

                return targetElement
            }

        },
        params
    ]
}