import { type FC, useState, useCallback } from "react"
import { Spinner, Button } from "@fluentui/react-components"

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
    return <Button appearance="transparent" onClick={handleOnLogout}>Cerrar sesión</Button>
  }
}

export default LogoutButton

interface LogoutButtonProps {
}