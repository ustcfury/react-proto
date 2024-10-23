import cn from 'classnames'
import { type FC, type ReactElement, memo } from 'react'
import { NavLink } from 'react-router-dom'

import { ROUTE_CONSTANTS } from 'constants/routeConstants'
import useTranslations from 'i18n/useTranslations'

import styles from './menu.module.scss'

interface IMenu {
  className?: string
}

const Menu: FC<IMenu> = ({ className }): ReactElement => {
  const { t } = useTranslations()

  return (
    <nav className={cn(styles.menu, className)}>
      <NavLink
        to={ROUTE_CONSTANTS.HOME}
        end
        className={({ isActive }) =>
          isActive ? cn(styles.item, styles['item-active']) : styles.item
        }
      >
        {t.pageNames.home}
      </NavLink>

      <NavLink
        to={ROUTE_CONSTANTS.FETCH}
        className={({ isActive }) =>
          isActive ? cn(styles.item, styles['item-active']) : styles.item
        }
      >
        {t.pageNames.fetch}
      </NavLink>

      <NavLink
        to={ROUTE_CONSTANTS.ABOUT}
        className={({ isActive }) =>
          isActive ? cn(styles.item, styles['item-active']) : styles.item
        }
      >
        {t.pageNames.about}
      </NavLink>
    </nav>
  )
}

const memorizedMenu = memo(Menu)

export { memorizedMenu as Menu }
