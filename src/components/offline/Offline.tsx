import cn from 'classnames'
import type { FC, ReactElement } from 'react'

import { useOnlineStatus } from 'hooks'
import useTranslations from 'i18n/useTranslations'

import styles from './offline.module.scss'

interface IOffline {
  className?: string
}

const Offline: FC<IOffline> = ({ className }): ReactElement => {
  const isAppOnline = useOnlineStatus()
  const { t } = useTranslations()

  return (
    <div
      className={cn(
        className,
        styles.offline,
        isAppOnline ? styles.hide : styles.show,
      )}
    >
      {t.offlineText}
    </div>
  )
}

export { Offline }
