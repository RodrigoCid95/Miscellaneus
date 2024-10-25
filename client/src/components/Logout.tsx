import { type FC, useState, useCallback } from "react"
import { Spinner, Button } from "@fluentui/react-components"
import { bundleIcon, ArrowExit20Filled, ArrowExit20Regular } from "@fluentui/react-icons"

const LogoutIcon = bundleIcon(ArrowExit20Filled, ArrowExit20Regular)

const LogoutButton: FC<LogoutButtonProps> = () => {
  const [loading, setLoading] = useState<boolean>(false)

  const handleOnLogout = useCallback(() => {
    setLoading(true)
    fetch(`${window.location.origin}/api/auth`, {
      method: 'delete'
    })
      .then(() => {
        setLoading(false)
        window.location.reload()
      })
  }, [setLoading])

  if (loading) {
    return <Spinner />
  } else {
    return <Button appearance="transparent" icon={<LogoutIcon />} onClick={handleOnLogout}/>
  }
}

export default LogoutButton

interface LogoutButtonProps {
}