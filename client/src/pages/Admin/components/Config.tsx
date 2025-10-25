import { type FC, useState } from "react"
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Field, Input, makeStyles, Spinner } from "@fluentui/react-components"
import { bundleIcon, Settings20Filled, Settings20Regular } from "@fluentui/react-icons"
import { useConfigContext } from "./../context/config"
import { models } from "../../../../wailsjs/go/models"

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

const Config: FC<ConfigProps> = () => {
  const styles = useStyles()
  const { config, setConfig } = useConfigContext()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [name, setName] = useState<models.ConfigData['name']>(config?.name || '')
  const [nameVerification, setNameVerification] = useState<Verification>({})
  const [ipPrinter, setIpPrinter] = useState<models.ConfigData['ipPrinter']>(config?.ipPrinter || '')
  const [ipPrinterVerification, setIpPrinterVerification] = useState<Verification>({})

  const handleOnUpdate = () => {
    if (!name) {
      setNameVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    if (!ipPrinter) {
      setIpPrinterVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    setLoading(true)
    setConfig({ name, ipPrinter })
      .then(() => {
        setLoading(false)
        setOpen(false)
      })
  }

  return (
    <Dialog
      modalType="alert"
      open={open}
      onOpenChange={(_, data) => {
        setOpen(data.open)
        if (data.open) {
          setName(config?.name || '')
          setNameVerification({})
          setIpPrinter(config?.ipPrinter || '')
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
}