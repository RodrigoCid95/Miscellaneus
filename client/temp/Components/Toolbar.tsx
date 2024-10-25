import { type FC, type ReactNode, useState, useCallback, useEffect } from "react"
import { ToolbarButton, Title3, Toolbar, Card, makeStyles, tokens } from "@fluentui/react-components"
import { bundleIcon, Navigation20Filled, Navigation20Regular } from "@fluentui/react-icons"

const NavigationIcon = bundleIcon(Navigation20Filled, Navigation20Regular)
const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalL,
  }
})

const ToolbarPage: FC<ToolbarPageProps> = ({ title, onOpenMenu, children }) => {
  const styles = useStyles()
  const match = window.matchMedia("(min-width: 1024px)")
  const [showMenuButton, setShowMenuButton] = useState<boolean>(match.matches)

  const onMediaQueryChange = useCallback(
    ({ matches }: any) => {
      setShowMenuButton(matches)
    },
    [setShowMenuButton]
  )

  useEffect(() => {
    match.addEventListener("change", onMediaQueryChange)
    return () => {
      match.removeEventListener("change", onMediaQueryChange)
    }
  }, [onMediaQueryChange])

  if (children || !showMenuButton) {
    return (
      <Card>
        <Toolbar className={styles.toolbar}>
          {!showMenuButton && (
            <>
              <ToolbarButton
                appearance='transparent'
                icon={<NavigationIcon />}
                onClick={onOpenMenu}
              />
              <Title3>{title}</Title3>
            </>
          )}
          {children}
        </Toolbar>
      </Card>
    )
  }

  return ''

}

export default ToolbarPage

interface ToolbarPageProps {
  title: string
  onOpenMenu(): void
  children?: ReactNode
}