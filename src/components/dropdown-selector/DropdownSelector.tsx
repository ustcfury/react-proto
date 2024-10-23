import cn from 'classnames'
import {
  type ChangeEvent,
  type FC,
  type ReactElement,
  useEffect,
  useState,
} from 'react'

import styles from './dropdownSelector.module.scss'
interface IDropdownSelector {
  options: string[]
  value: string
  description?: string
  onChange: (selectedOption: string) => void
  className?: string
}

const DropdownSelector: FC<IDropdownSelector> = ({
  options,
  value,
  description,
  onChange,
  className,
}): ReactElement => {
  const [selectedOption, setSelectedOption] = useState<string>(value)

  const handleOptionChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const newOption = event.target.value
    setSelectedOption(newOption)
    onChange(newOption)
  }

  useEffect(() => {
    if (value !== selectedOption) {
      setSelectedOption(value)
    }
  }, [value, selectedOption])

  return (
    <select
      className={cn(styles.selector, className)}
      value={selectedOption}
      onChange={handleOptionChange}
      aria-label={description}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

export { DropdownSelector }
