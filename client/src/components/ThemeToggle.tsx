import React from 'react'
import { Button } from '@/components/ui/button'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return 'fas fa-sun'
      case 'dark':
        return 'fas fa-moon'
      default:
        return 'fas fa-desktop'
    }
  }

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light'
      case 'dark':
        return 'Dark'
      default:
        return 'System'
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="interactive-button"
      data-testid="button-theme-toggle"
      title={`Current theme: ${getLabel()}. Click to change.`}
    >
      <i className={`${getIcon()} mr-2`}></i>
      <span className="hidden md:inline">{getLabel()}</span>
    </Button>
  )
}