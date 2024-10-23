import {
  type FC,
  type ReactElement,
  type ReactNode,
  useEffect,
  useState,
} from 'react'

import { Spinner } from 'components'

interface IWithSpinner {
  isSpinnerShown: boolean
  isShadowLoading?: boolean
  minTimeSpinnerShown?: number
  children?: ReactNode | ReactNode[]
}

const WithSpinner: FC<IWithSpinner> = ({
  children,
  isSpinnerShown = false,
  isShadowLoading = false,
  minTimeSpinnerShown,
}): ReactElement => {
  const [showSpinner, setShowSpinner] = useState(false)

  useEffect(() => {
    if (minTimeSpinnerShown != null) {
      if (isSpinnerShown && !showSpinner) {
        setShowSpinner(true)
        setTimeout(() => {
          setShowSpinner(false)
        }, minTimeSpinnerShown)
      }
    } else {
      setShowSpinner(isSpinnerShown)
    }
  }, [isSpinnerShown, minTimeSpinnerShown, showSpinner])

  if (showSpinner) {
    if (isShadowLoading) {
      return (
        <>
          <div style={{ visibility: 'hidden', height: 0, width: 0 }}>
            {children}
          </div>
          <Spinner />
        </>
      )
    }

    return <Spinner />
  }

  return <>{children}</>
}

export { WithSpinner }
