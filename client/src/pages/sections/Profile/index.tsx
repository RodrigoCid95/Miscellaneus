import { type FC } from "react"
import ToolbarPage from "./../../../Components/Toolbar"
import { makeStyles, tokens } from "@fluentui/react-components"
import DataForm from "./DataForm"
import PasswordForm from "./PasswordForm"

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
  }
})

const ProfilePage: FC<ProfilePageProps> = ({ onOpenMenu, user }) => {
  const styles = useStyles()

  return (
    <>
      <ToolbarPage title="Perfil" onOpenMenu={onOpenMenu} />
      <div className={styles.content}>
        <div className={styles.form}>
          <DataForm user={user} />
        </div>
        <div className={styles.form}>
          <PasswordForm />
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