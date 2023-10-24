import React, { useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'

const Toggleable = React.forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
    if (props.type === 'display') {
      const display =
        props.containerDisplay === 'one-column' ? 'two-columns' : 'one-column'
      props.setContainerDisplay(display)
    }
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div className={props.divClass}>
      <div style={hideWhenVisible}>
        <button id={props.buttonId} className={`${props.buttonClass} view`} onClick={toggleVisibility}>
          {props.buttonLabel}
        </button>
      </div>
      <div className='hidden-content' style={showWhenVisible}>
        {props.children}
        <button className={props.buttonClass} onClick={toggleVisibility}>
          Hide
        </button>
      </div>
    </div>
  )
})

Toggleable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

Toggleable.displayName = 'Toggleable'

export default Toggleable
