import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'

import HistoryManager from './HistoryManager'

/**
 * Native anchor wrapper. Instead `href` use property `to`.
 */
const Link = forwardRef(({ to, children, onClick, ...props }, ref) => {
    return <a ref={ref} href={to} onClick={(e) => { e.preventDefault(); HistoryManager.push(to); onClick && onClick(e) }} {...props}>{children}</a>
})

Link.displayName = 'Link'

Link.propTypes = {
    to: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            pathname: PropTypes.string,
            search: PropTypes.object,
            hash: PropTypes.string
        })
    ]).isRequired    
}

export default Link
