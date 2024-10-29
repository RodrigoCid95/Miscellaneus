import { type FC, useState } from "react"
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Field, Input, makeStyles, Spinner, ToolbarButton } from "@fluentui/react-components"
import { bundleIcon, PeopleAdd20Filled, PeopleAdd20Regular } from "@fluentui/react-icons"
import { saveProvider } from "../../../services/providers"
import { useProvidersContext } from "../../../context/providers"

const AddIcon = bundleIcon(PeopleAdd20Filled, PeopleAdd20Regular)

const useStyles = makeStyles({
  content: {
    display: "flex",
    flexDirection: "column",
    rowGap: "10px",
  },
  dialog: {
    width: 'fit-content',
  },
})

const NewProvider: FC<NewProviderProps> = () => {
  const styles = useStyles()
  const { loadProviders } = useProvidersContext()
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [name, setName] = useState<Miscellaneous.Provider['name']>('')
  const [phone, setPhone] = useState<Miscellaneous.Provider['phone']>('')
  const [nameVerification, setNameVerification] = useState<Verification>({})
  const [phoneVerification, setPhoneVerification] = useState<Verification>({})

  const createProvider = () => {
    if (!name) {
      setNameVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    if (!phone) {
      setPhoneVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    setLoading(true)
    const newProvider: Miscellaneous.NewProvider = { name, phone }
    saveProvider(newProvider)
      .then(() => {
        setOpen(false)
        loadProviders()
      })
  }

  return (
    <Dialog
      modalType="alert"
      open={open}
      onOpenChange={(_, data) => {
        setOpen(data.open)
        setName('')
        setPhone('')
        setLoading(false)
      }}
    >
      <DialogTrigger disableButtonEnhancement>
        <ToolbarButton
          appearance='transparent'
          icon={<AddIcon />}
        />
      </DialogTrigger>
      <DialogSurface className={styles.dialog}>
        <DialogTitle>Nuevo proveedor</DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            <Field
              label="Nombre"
              validationState={nameVerification.state}
              validationMessage={nameVerification.message}
            >
              <Input value={name} onChange={e => setName(e.target.value)} onBlur={() => setNameVerification({})} />
            </Field>

            <Field
              label="Valor"
              validationState={phoneVerification.state}
              validationMessage={phoneVerification.message}
            >
              <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} onBlur={() => setPhoneVerification({})} />
            </Field>
          </DialogContent>
          <DialogActions>
            {!loading && (
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancelar</Button>
              </DialogTrigger>
            )}
            {
              loading
                ? <Spinner />
                : <Button appearance="primary" onClick={createProvider}>Crear</Button>
            }
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export default NewProvider

interface NewProviderProps {
}