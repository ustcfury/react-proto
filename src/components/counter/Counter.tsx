import cn from 'classnames'
import type { FC, ReactElement } from 'react'

import styles from './counter.module.scss'

interface ICounter {
  className?: string
  description?: string
  value?: number
}

const Counter: FC<ICounter> = ({
  className,
  description,
  value = 0,
}): ReactElement => (
  <div className={cn(styles.wrapper, className)}>
    {value}
    {description !== null && (
      <span className={cn(styles.description)}>{description}</span>
    )}
  </div>
)

export { Counter }
