/**
 * Provides static methods for changing url
 */
export default class HistoryManager {

    static handlersMap = {}

    /**
     * Change current url
     * @param {String|Object} to - new url
     * @param {String} [to.pathname = location.pathname]
     * @param {Object} [to.search]
     * @param {String} [to.hash]
     * @param {Object} [state = {}] - new state
     */
    static push(to, state = {}) {

        if (!to) return

        let hash

        if (typeof to === 'object') {

            let pathname = to.pathname ? to.pathname : ''
            let search = to.search ? '?' + Object.entries(to.search).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&') : ''
            to = `${pathname}${search}`
            state = to.state ? to.state : state
            hash = '#' + to.hash

        } else {

            const result = /(#[A-Za-z]+[-\w:.]*)$/.exec(to)

            if (result) {
                hash = result[1]
                to = to.slice(0, -hash.length)
            }
        }

        if (hash) location = hash

        if (to === `${location.pathname}${location.search}`) return

        window.history.pushState(state, null, to)

        const handlersMapValues = Object.values(HistoryManager.handlersMap)

        for (let { handlers } of handlersMapValues) {
            for (let handler of handlers) {
                if (handler() === false) break
            }
        }
    }

    /**
     * Move back through browser history
     */
    static back() {
        window.history.back()
    }

    /**
     * Move forward through browser history
     */
    static forward() {
        window.history.forward()
    }

    static on(handler, routeTreeID) {

        if (!HistoryManager.handlersMap[routeTreeID]) {

            const popstateHandler = () => {

                const { handlers } = HistoryManager.handlersMap[routeTreeID]

                for (let handler of handlers) {
                    if (handler() === false) break
                }
            }

            HistoryManager.handlersMap[routeTreeID] = {
                handlers: [],
                popstateHandler
            }

            window.addEventListener('popstate', popstateHandler)

        }

        const { handlers } = HistoryManager.handlersMap[routeTreeID]

        if (handlers.indexOf(handler) >= 0) throw new Error(`Attempt to add the same event handler to the push event!`)

        handlers.push(handler)
    }

    static off(handler, routeTreeID) {

        const { handlers, popstateHandler } = HistoryManager.handlersMap[routeTreeID]

        const index = handlers.indexOf(handler)

        if (index < 0) throw new Error(`Attempt to remove a handler not connected to the push event!`)

        handlers.splice(index, 1)

        if (handlers.length === 0) {
            delete HistoryManager.handlersMap[routeTreeID]
            window.removeEventListener('popstate', popstateHandler)
        }
    }
}
