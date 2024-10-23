import cn from 'classnames'
import type { FC, ReactElement } from 'react'

import styles from './spinner.module.scss'

interface ISpinner {
  className?: string
}

const Spinner: FC<ISpinner> = ({ className }): ReactElement => (
  <div className={cn(className, styles.spinner)} />
)

export { Spinner }
