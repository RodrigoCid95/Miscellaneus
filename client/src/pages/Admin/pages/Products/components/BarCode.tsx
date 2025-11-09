import { type FC, useState } from "react"
import { Dialog, DialogTrigger, Button, DialogSurface, DialogTitle, DialogBody, DialogContent, makeStyles, DialogActions } from "@fluentui/react-components"
import { bundleIcon, BarcodeScanner20Filled, BarcodeScanner20Regular } from "@fluentui/react-icons"
import { structs } from "../../../../../../wailsjs/go/models"

const BarcodeScannerIcon = bundleIcon(BarcodeScanner20Filled, BarcodeScanner20Regular)
const useStyles = makeStyles({
  content: {
    display: "flex",
    flexDirection: "column",
    rowGap: "10px",
  },
  img: {
    height: 'auto',
    width: 'fit-content',
    margin: '0 auto',
  },
  dialog: {
    width: 'fit-content',
  },
})

const BarCodeViewer: FC<BarCodeViewerProps> = ({ barCode }) => {
  const styles = useStyles()
  const [open, setOpen] = useState<boolean>(false)

  const handleDownload = () => {
    const anchor = document.createElement('a')
    anchor.href = `${window.location.origin}/bar-code/${barCode.id}`
    anchor.download = `${barCode.name}.png`
    anchor.click()
  }

  return (
    <Dialog
      modalType="alert"
      open={open}
      onOpenChange={(_, data) => setOpen(data.open)}
    >
      <DialogTrigger disableButtonEnhancement>
        <Button
          aria-label="View"
          icon={<BarcodeScannerIcon />}
        />
      </DialogTrigger>
      <DialogSurface className={styles.dialog}>
        <DialogTitle>{barCode.name}</DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            <img className={styles.img} src={`${window.location.origin}/bar-code/${barCode.id}`} alt={barCode.name} />
          </DialogContent>
          <DialogActions>
            <Button appearance="primary" onClick={handleDownload}>Descargar</Button>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Cerrar</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export default BarCodeViewer

interface BarCodeViewerProps {
  barCode: structs.BarCode
}