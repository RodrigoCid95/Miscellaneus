import { type FC, useState } from "react"
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Field, Input, makeStyles, Spinner, tokens } from "@fluentui/react-components"
import { bundleIcon, Edit20Filled, Edit20Regular } from "@fluentui/react-icons"
import { useBarCodesContext } from "../../../context/barcodes"
import { models } from "../../../../../../wailsjs/go/models"
import { UpdateBarCode } from "../../../../../../wailsjs/go/controllers/BarCodes"

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

const EditBarcode: FC<EditBarcodeProps> = ({ item }) => {
  const styles = useStyles()
  const { loadBarCodes } = useBarCodesContext()
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [name, setName] = useState<models.BarCode['name']>(item.name)
  const [msgNameValidation, setMsgNameValidation] = useState<string>('')

  const [tag, setTag] = useState<models.BarCode['tag']>(item.tag || '')

  const [value, setValue] = useState<models.BarCode['value']>(item.value)
  const [msgValueValidarion, setMsgValueValidation] = useState<string>('')

  const handleOnUpdate = () => {
    if (!name) {
      setMsgNameValidation('Campo requerido.')
      return
    }
    if (!value) {
      setMsgValueValidation('Campo requerido.')
      return
    }
    setLoading(true)
    const barCode: models.BarCode = { id: item.id, name, tag, value }
    UpdateBarCode(barCode)
      .then(() => {
        setOpen(false)
        loadBarCodes()
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
        <DialogTitle>{loading ? "Actualizando código de barras ..." : "Editar código de barras"}</DialogTitle>
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

              <Field label="Título">
                <Input value={tag} onChange={e => setTag(e.target.value)} />
              </Field>

              <Field
                label="Valor"
                validationState={msgValueValidarion !== "" ? "warning" : undefined}
                validationMessage={msgValueValidarion}
              >
                <Input
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  onBlur={() => setMsgValueValidation('')}
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

export default EditBarcode

interface EditBarcodeProps {
  item: models.BarCode
}