import { type FC, useState, useCallback } from "react"
import { type ConfigController } from './../utils/Config'
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Field, Input, makeStyles, Spinner } from "@fluentui/react-components"
import { bundleIcon, Settings20Filled, Settings20Regular } from "@fluentui/react-icons"

const SettingsIcon = bundleIcon(Settings20Filled, Settings20Regular)
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

const Config: FC<ConfigProps> = ({ configController }) => {
  const styles = useStyles()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [name, setName] = useState<Miscellaneous.Config['name']>('')
  const [nameVerification, setNameVerification] = useState<Verification>({})
  const [ipPrinter, setIpPrinter] = useState<Miscellaneous.Config['name']>('')
  const [ipPrinterVerification, setIpPrinterVerification] = useState<Verification>({})

  const handleOnUpdate = useCallback(() => {
    if (!name) {
      setNameVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    if (!ipPrinter) {
      setIpPrinterVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    setLoading(true)
    fetch(`${window.location.origin}/api/config`, {
      method: 'put',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ name, ipPrinter })
    })
      .then(res => res.json())
      .then(() => {
        setLoading(false)
        configController.config = {
          name,
          ipPrinter
        }
        setOpen(false)
      })
  }, [name, ipPrinter, setOpen, configController])

  return (
    <Dialog
      modalType="alert"
      open={open}
      onOpenChange={(_, data) => {
        setOpen(data.open)
        if (data.open) {
          setName(configController.config?.name || '')
          setNameVerification({})
          setIpPrinter(configController.config?.ipPrinter || '')
          setIpPrinterVerification({})
        }
      }}
    >
      <DialogTrigger disableButtonEnhancement>
        <Button appearance="transparent" icon={<SettingsIcon />} />
      </DialogTrigger>
      <DialogSurface className={styles.dialog}>
        <DialogTitle>Ajustes</DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            <Field
              label="Nombre de la tienda"
              validationState={nameVerification.state}
              validationMessage={nameVerification.message}
            >
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setNameVerification({})} />
            </Field>

            <Field
              label="IP de impresora"
              validationState={ipPrinterVerification.state}
              validationMessage={ipPrinterVerification.message}
            >
              <Input type="text" value={ipPrinter} onChange={(e) => setIpPrinter(e.target.value)} onBlur={() => setIpPrinterVerification({})} />
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
                : <Button appearance="primary" onClick={handleOnUpdate}>Guardar</Button>
            }
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export default Config

interface ConfigProps {
  configController: ConfigController
}