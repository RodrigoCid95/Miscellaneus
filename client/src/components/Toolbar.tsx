import { type FC, type ReactNode } from "react"
import { ToolbarButton, Title3, Toolbar, Card, makeStyles, tokens } from "@fluentui/react-components"
import { bundleIcon, Navigation20Filled, Navigation20Regular } from "@fluentui/react-icons"
import { useAdminAppContext } from "../context/admin"

const NavigationIcon = bundleIcon(Navigation20Filled, Navigation20Regular)
const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalL,
  }
})

const ToolbarPage: FC<ToolbarPageProps> = ({ title, children }) => {
  const styles = useStyles()
  const { matches, isOpen, setIsOpen } = useAdminAppContext()

  if (children || !matches) {
    return (
      <Card>
        <Toolbar className={styles.toolbar}>
          {!matches && (
            <>
              <ToolbarButton
                appearance='transparent'
                icon={<NavigationIcon />}
                onClick={() => setIsOpen(!isOpen)}
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
  children?: ReactNode
}