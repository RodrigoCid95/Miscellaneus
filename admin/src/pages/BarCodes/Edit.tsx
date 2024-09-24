import { type FC, useCallback, useState } from "react"
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Field, Input, makeStyles, Spinner } from "@fluentui/react-components"
import { bundleIcon, Edit20Filled, Edit20Regular } from "@fluentui/react-icons"
import { loadBarCodeListEmitter } from "./List"

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

const EditBarcode: FC<EditBarcodeProps> = ({ item }) => {
  const styles = useStyles()
  const [name, setName] = useState<Miscellaneous.BarCode['name']>(item.name)
  const [tag, setTag] = useState<Miscellaneous.BarCode['tag']>(item.tag || '')
  const [value, setValue] = useState<Miscellaneous.BarCode['value']>(item.value)
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [nameVerification, setNameVerification] = useState<Verification>({})
  const [valueVerification, setValueVerification] = useState<Verification>({})

  const updateBarCode = useCallback(() => {
    if (!name) {
      setNameVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    if (!value) {
      setValueVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    setLoading(true)
    const newBarCode: Miscellaneous.BarCode = { id: item.id, name, tag, value }
    fetch(`${window.location.origin}/api/bar-codes`, {
      method: 'put',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(newBarCode)
    })
      .then(() => {
        setOpen(false)
        loadBarCodeListEmitter.emit()
      })
  }, [setLoading, name, tag, value, item, setNameVerification, setValueVerification])

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
        <DialogTitle>Editar código de barras</DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            <Field
              label="name"
              validationState={nameVerification.state}
              validationMessage={nameVerification.message}
            >
              <Input value={name} onChange={e => setName(e.target.value)} onBlur={() => setNameVerification({})} />
            </Field>

            <Field label="Título">
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
                : <Button appearance="primary" onClick={updateBarCode}>Actualizar</Button>
            }
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export default EditBarcode

interface EditBarcodeProps {
  item: Miscellaneous.BarCode
}