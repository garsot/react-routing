import React from 'react'
import { shallow } from 'enzyme'

import Link from '../Link'

describe('Link tests', () => {

    const handleClick = jest.fn()    

    beforeEach(() => {
        window.history.pushState({}, null, '/')
    })

    test('should render correctly', () => {

        const output = shallow(<Link to='/url'>Link</Link>)
        expect(output).toMatchSnapshot()
    })

    test('should call the passed onClick handler', () => {

        const output = shallow(<Link to='/url' onClick={handleClick}>Link</Link>)
        output.find('a').simulate('click', { preventDefault: () => { } })
        expect(handleClick).toHaveBeenCalled()
    })

    test('should change history', () => {
        expect(window.location.pathname).toBe('/')

        const output = shallow(<Link to='/url'>Link</Link>)
        output.find('a').simulate('click', { preventDefault: () => { } })

        expect(window.location.pathname).toBe('/url')
    })

})
