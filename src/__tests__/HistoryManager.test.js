import HistoryManager from '../HistoryManager'

describe('HistoryManager tests', () => {

    beforeEach(() => {
        history.replaceState({}, null, '/')
    })

    test('should change url', () => {
        expect(window.location.pathname).toBe('/')

        HistoryManager.push('/test')

        expect(window.location.pathname).toBe('/test')
    })

    test('should move back through history', () => {

        return new Promise((resolve) => {

            HistoryManager.push('/test')
            HistoryManager.push('/test/42')

            const handler = () => {
                window.removeEventListener('popstate', handler)
                expect(window.location.pathname).toBe('/test')
                resolve()
            }

            window.addEventListener('popstate', handler)

            HistoryManager.back()
        })

    })

    test('should move forward through history', () => {

        return new Promise((resolve) => {

            HistoryManager.push('/test')

            let counter = 0

            const handler = () => {

                if (counter === 0) {
                    ++counter
                    HistoryManager.forward()
                    return
                }

                if (counter === 1) {
                    window.removeEventListener('popstate', handler)
                    expect(window.location.pathname).toBe('/test')
                    resolve()
                }
            }

            window.addEventListener('popstate', handler)

            HistoryManager.back()

        })

    })

    test('should subscribe and call handler after change url', () => {

        const handler = jest.fn()

        HistoryManager.on(handler, 1)
        HistoryManager.push('/test')

        expect(handler).toHaveBeenCalledTimes(1)
    })

    test('should subscribe and unsubscribe handler', () => {

        const handler = jest.fn()

        HistoryManager.on(handler, 1)
        HistoryManager.off(handler, 1)
        HistoryManager.push('/test')

        expect(handler).toHaveBeenCalledTimes(0)
    })

    test('should throw Error after re-subscribing the same handler', () => {

        const handler = jest.fn()

        expect(() => {
            HistoryManager.on(handler, 1)
            HistoryManager.on(handler, 1)
        }).toThrow(Error)

    })

    test('should throw Error after attempting to unsubscribe an unsubscribed handler', () => {

        const handler = jest.fn()

        expect(() => {
            HistoryManager.off(handler, 1)            
        }).toThrow(Error)

    })

})