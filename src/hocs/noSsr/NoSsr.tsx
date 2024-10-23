import {
  type FC,
  type ReactElement,
  type ReactNode,
  useEffect,
  useState,
} from 'react'

interface INoSsr {
  fallback?: JSX.Element
  children?: ReactNode | ReactNode[]
}

const NoSsr: FC<INoSsr> = ({ children, fallback }): ReactElement => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return <>{mounted ? children : fallback}</>
}

export { NoSsr }
