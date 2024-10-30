import { makeStyles, tokens, Card, CardHeader, Button, Text } from "@fluentui/react-components"
import { PasswordForm, PasswordFormProvider } from "../../../components/PasswordForm"
import ToolbarPage from "../../../components/Toolbar"
import { usePasswordForm } from "../../../context/passwordForm"
import DataForm from "./DataForm"

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

const Profile = () => {
  const styles = useStyles()
  const { loading: pLoading, save: pSave } = usePasswordForm()

  return (
    <>
      <ToolbarPage title="Perfil" />
      <div className={styles.content}>
        <div className={styles.form}>
          <Card>
            <CardHeader
              header={<Text weight="semibold">Datos personales</Text>}
            />
            <DataForm />
          </Card>
        </div>
        <div className={styles.form}>
          <Card>
            <CardHeader
              header={<Text weight="semibold">Contraseña</Text>}
            />
            <PasswordForm />
            <div className={styles.buttons}>
              <Button disabled={pLoading} appearance="primary" onClick={pSave}>
                Actualizar
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default () => (
  <PasswordFormProvider>
    <Profile />
  </PasswordFormProvider>
)