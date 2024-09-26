import { useCallback, useState, type FC } from "react"
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Field, Input, makeStyles, Spinner, ToolbarButton } from "@fluentui/react-components"
import { bundleIcon, AddCircle20Filled, AddCircle20Regular } from "@fluentui/react-icons"
import { loadBarCodeListEmitter } from "./List"

const AddIcon = bundleIcon(AddCircle20Filled, AddCircle20Regular)

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

const NewBarcode: FC<NewBarcodeProps> = () => {
  const styles = useStyles()
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [name, setName] = useState<Miscellaneous.BarCode['name']>('')
  const [tag, setTag] = useState<Miscellaneous.BarCode['tag']>('')
  const [value, setValue] = useState<Miscellaneous.BarCode['value']>('')
  const [nameVerification, setNameVerification] = useState<Verification>({})
  const [valueVerification, setValueVerification] = useState<Verification>({})

  const createBarCode = useCallback(() => {
    if (!name) {
      setNameVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    if (!value) {
      setValueVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    setLoading(true)
    const newBarCode: Miscellaneous.NewBarCode = { name, tag, value }
    fetch(`${window.location.origin}/api/bar-codes`, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(newBarCode)
    })
      .then(() => {
        setOpen(false)
        loadBarCodeListEmitter.emit()
      })
  }, [setLoading, name, tag, value, setNameVerification, setValueVerification])

  return (
    <Dialog
      modalType="alert"
      open={open}
      onOpenChange={(_, data) => {
        setOpen(data.open)
        setName('')
        setTag('')
        setValue('')
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
        <DialogTitle>Nuevo código de barras</DialogTitle>
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
              label="Etiqueta"
            >
              <Input value={tag} onChange={e => setTag(e.target.value)} />
            </Field>

            <Field
              label="Valor"
              validationState={valueVerification.state}
              validationMessage={valueVerification.message}
            >
              <Input value={value} onChange={e => setValue(e.target.value)} onBlur={() => setValueVerification({})} />
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
                : <Button appearance="primary" onClick={createBarCode}>Crear</Button>
            }
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export default NewBarcode

interface NewBarcodeProps {
}