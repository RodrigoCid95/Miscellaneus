import { type FC, useState } from "react"
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Field, Input, makeStyles, Spinner } from "@fluentui/react-components"
import { bundleIcon, Edit20Filled, Edit20Regular } from "@fluentui/react-icons"
import { useProvidersContext } from "../../../context/providers"

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
})

const EditProvider: FC<EditBarcodeProps> = ({ item }) => {
  const styles = useStyles()
  const { loadProviders } = useProvidersContext()
  const [name, setName] = useState<Miscellaneous.Provider['name']>(item.name)
  const [phone, setPhone] = useState<Miscellaneous.Provider['phone']>(item.phone)
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [nameVerification, setNameVerification] = useState<Verification>({})
  const [phoneVerification, setPhoneVerification] = useState<Verification>({})

  const handleOnUpdate = () => {
    if (!name) {
      setNameVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    if (!phone) {
      setPhoneVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    setLoading(true)
    const newProvider: Miscellaneous.Provider = { id: item.id, name, phone }
    window.updateProvider(newProvider)
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
        <DialogTitle>Editar proveedor</DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            <Field
              label="name"
              validationState={nameVerification.state}
              validationMessage={nameVerification.message}
            >
              <Input value={name} onChange={e => setName(e.target.value)} onBlur={() => setNameVerification({})} />
            </Field>

            <Field
              label="Teléfono"
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
                : <Button appearance="primary" onClick={handleOnUpdate}>Actualizar</Button>
            }
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export default EditProvider

interface EditBarcodeProps {
  item: Miscellaneous.Provider
}