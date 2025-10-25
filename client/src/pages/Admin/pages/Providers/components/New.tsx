import { type FC, useState } from "react"
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Field, Input, makeStyles, Spinner, tokens, ToolbarButton } from "@fluentui/react-components"
import { bundleIcon, PeopleAdd20Filled, PeopleAdd20Regular } from "@fluentui/react-icons"
import { useProvidersContext } from "../../../context/providers"
import { models } from "../../../../../../wailsjs/go/models"
import { SaveProvider } from "../../../../../../wailsjs/go/controllers/Providers"

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
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: tokens.spacingHorizontalXXL
  },
})

const NewProvider: FC<NewProviderProps> = () => {
  const styles = useStyles()
  const { loadProviders } = useProvidersContext()
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [name, setName] = useState<models.Provider['name']>('')
  const [msgNameValidation, setMsgNameValidation] = useState<string>('')

  const [phone, setPhone] = useState<models.Provider['phone']>('')
  const [msgPhoneValidation, setMsgPhoneValidation] = useState<string>('')

  const createProvider = () => {
    if (!name) {
      setMsgNameValidation('Campo requerido.')
      return
    }
    if (!phone) {
      setMsgPhoneValidation('Campo requerido.')
      return
    }
    setLoading(true)
    const newProvider: models.NewProvider = { name, phone }
    SaveProvider(newProvider)
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
        <DialogTitle>{loading ? "Guardando proveedor ..." : "Nuevo proveedor"}</DialogTitle>
        {loading && (
          <DialogBody className={styles.spinnerContainer}>
            <Spinner />
          </DialogBody>
        )}
        {!loading && (
          <DialogBody>
            <DialogContent className={styles.content}>
              <Field
                label="Nombre"
                validationState={msgNameValidation !== "" ? "warning" : undefined}
                validationMessage={msgNameValidation}
              >
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onBlur={() => setMsgNameValidation('')}
                />
              </Field>

              <Field
                label="Teléfono"
                validationState={msgPhoneValidation !== "" ? "warning" : undefined}
                validationMessage={msgPhoneValidation}
              >
                <Input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  onBlur={() => setMsgPhoneValidation('')}
                />
              </Field>
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancelar</Button>
              </DialogTrigger>
              <Button appearance="primary" onClick={createProvider}>Crear</Button>
            </DialogActions>
          </DialogBody>
        )}
      </DialogSurface>
    </Dialog>
  )
}

export default NewProvider

interface NewProviderProps {
}