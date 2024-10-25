import { type FC, useState, useEffect } from "react"
import ToolbarPage from "./../../../Components/Toolbar"
import { Button, Card, CardHeader, Text, makeStyles, tokens } from "@fluentui/react-components"
import DataForm from "./DataForm"
import PasswordForm, { emitters } from './../../../Components/PasswordForm'

const useStyles = makeStyles({
  content: {
    marginTop: tokens.spacingVerticalXXL,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXXL,
    justifyContent: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingHorizontalXXL,
    paddingLeft: tokens.spacingVerticalXXL,
    paddingRight: tokens.spacingVerticalXXL,
    width: '100%',
    maxWidth: '300px'
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
})

const ProfilePage: FC<ProfilePageProps> = ({ onOpenMenu, user }) => {
  const styles = useStyles()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const handleOnStart = () => setLoading(true)
    const handleOnEnd = () => setLoading(false)
    emitters.start.on(handleOnStart)
    emitters.end.on(handleOnEnd)
    return () => {
      emitters.start.off(handleOnStart)
      emitters.end.off(handleOnEnd)
    }
  }, [setLoading])

  return (
    <>
      <ToolbarPage title="Perfil" onOpenMenu={onOpenMenu} />
      <div className={styles.content}>
        <div className={styles.form}>
          <Card>
            <CardHeader
              header={<Text weight="semibold">Datos personales</Text>}
            />
            <DataForm user={user} />
          </Card>
        </div>
        <div className={styles.form}>
          <Card>
            <CardHeader
              header={<Text weight="semibold">Contraseña</Text>}
            />
            <PasswordForm />
            <div className={styles.buttons}>
              <Button disabled={loading} appearance="primary" onClick={() => emitters.save.emit()}>
                Actualizar
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default ProfilePage

interface ProfilePageProps {
  onOpenMenu(): void
  user: Miscellaneous.User | null
}