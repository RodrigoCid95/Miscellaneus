import { type FC, useState } from "react"
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Field, Input, makeStyles, Spinner, tokens } from "@fluentui/react-components"
import { bundleIcon, Edit20Filled, Edit20Regular } from "@fluentui/react-icons"
import { useProvidersContext } from "../../../context/providers"
import { structs } from "../../../../../../wailsjs/go/models"
import { UpdateProvider } from "../../../../../../wailsjs/go/controllers/Providers"

const EditIcon = bundleIcon(Edit20Filled, Edit20Regular)

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

const EditProvider: FC<EditBarcodeProps> = ({ item }) => {
  const styles = useStyles()
  const { loadProviders } = useProvidersContext()
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [name, setName] = useState<structs.Provider['name']>(item.name)
  const [msgNameValidation, setMsgNameValidation] = useState<string>('')

  const [phone, setPhone] = useState<structs.Provider['phone']>(item.phone)
  const [msgPhoneValidation, setMsgPhoneValidation] = useState<string>('')

  const handleOnUpdate = () => {
    if (!name) {
      setMsgNameValidation('Campo requerido.')
      return
    }
    if (!phone) {
      setMsgPhoneValidation('Campo requerido.')
      return
    }
    setLoading(true)
    const newProvider: structs.Provider = { id: item.id, name, phone }
    UpdateProvider(newProvider)
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
        setLoading(false)
      }}
    >
      <DialogTrigger disableButtonEnhancement>
        <Button
          aria-label="Edit"
          icon={<EditIcon />}
        />
      </DialogTrigger>
      <DialogSurface className={styles.dialog}>
        <DialogTitle>{loading ? "Actualizando proveedor ... " : "Editar proveedor"}</DialogTitle>
        {loading && (
          <DialogBody className={styles.spinnerContainer}>
            <Spinner />
          </DialogBody>
        )}
        {!loading && (
          <DialogBody>
            <DialogContent className={styles.content}>
              <Field
                label="name"
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
              <Button appearance="primary" onClick={handleOnUpdate}>Actualizar</Button>
            </DialogActions>
          </DialogBody>
        )}
      </DialogSurface>
    </Dialog>
  )
}

export default EditProvider

interface EditBarcodeProps {
  item: structs.Provider
}