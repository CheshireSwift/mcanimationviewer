import React from 'react'

export function useTimeout(callback: Function, delay: number) {
  const savedCallback = React.useRef<Function>(callback)

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the timeout.
  React.useEffect(() => {
    const tick = () => {
      savedCallback.current()
    }

    if (delay !== null) {
      const id = setTimeout(tick, delay)
      return () => {
        clearTimeout(id)
      }
    }
  }, [delay])
}

export default useTimeout
