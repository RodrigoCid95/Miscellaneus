import { type FC, useState } from "react"
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Field, Input, makeStyles, Spinner, tokens, ToolbarButton } from "@fluentui/react-components"
import { bundleIcon, AddCircle20Filled, AddCircle20Regular } from "@fluentui/react-icons"
import { useBarCodesContext } from "../../../context/barcodes"
import { structs } from "../../../../../../wailsjs/go/models"
import { CreateBarCode } from "../../../../../../wailsjs/go/controllers/BarCodes"

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
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: tokens.spacingHorizontalXXL
  },
})

const NewBarcode: FC<NewBarcodeProps> = () => {
  const styles = useStyles()
  const { loadBarCodes } = useBarCodesContext()
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [name, setName] = useState<structs.BarCode['name']>('')
  const [msgNameValidation, setMsgNameValidation] = useState<string>('')

  const [tag, setTag] = useState<structs.BarCode['tag']>('')

  const [value, setValue] = useState<structs.BarCode['value']>('')
  const [msgValueValidarion, setMsgValueValidation] = useState<string>('')

  const handleOnCreate = () => {
    if (!name) {
      setMsgNameValidation('Campo requerido.')
      return
    }
    if (!value) {
      setMsgValueValidation('Campo requerido.')
      return
    }
    setLoading(true)
    const newBarCode: structs.NewBarCode = { name, tag, value }
    CreateBarCode(newBarCode)
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
        <DialogTitle>{loading ? "Creando código de barras ..." : "Nuevo código de barras"}</DialogTitle>
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
                label="Etiqueta"
              >
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
              <Button appearance="primary" onClick={handleOnCreate}>Crear</Button>
            </DialogActions>
          </DialogBody>
        )}
      </DialogSurface>
    </Dialog>
  )
}

export default NewBarcode

interface NewBarcodeProps {
}