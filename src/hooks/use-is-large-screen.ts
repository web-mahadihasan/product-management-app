import * as React from 'react'

const LARGE_BREAKPOINT = 1024

export function useIsLargeScreen() {
  const [isLargeScreen, setIsLargeScreen] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${LARGE_BREAKPOINT}px)`)
    const onChange = () => {
      setIsLargeScreen(mql.matches)
    }
    mql.addEventListener('change', onChange)
    setIsLargeScreen(mql.matches)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return !!isLargeScreen
}
