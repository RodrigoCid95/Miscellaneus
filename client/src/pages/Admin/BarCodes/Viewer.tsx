import { type FC, useEffect, useState } from "react"
import { Dialog, DialogTrigger, Button, DialogSurface, DialogTitle, DialogBody, DialogContent, makeStyles, DialogActions, Spinner } from "@fluentui/react-components"
import { bundleIcon, Eye20Filled, Eye20Regular } from "@fluentui/react-icons"

const EyeIcon = bundleIcon(Eye20Filled, Eye20Regular)
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
  const [loadingImage, setLoadingImage] = useState<boolean>(true)
  const [src, setSrc] = useState<string>('')

  useEffect(() => {
    window.getBarCodeSrc(barCode.id)
      .then(src => {
        setSrc(src)
        setLoadingImage(false)
      })
  }, [])

  const handleDownload = () => {
    const anchor = document.createElement('a')
    anchor.href = src
    anchor.download = `${barCode.name}.webp`
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
          icon={<EyeIcon />}
        />
      </DialogTrigger>
      <DialogSurface className={styles.dialog}>
        <DialogTitle>{barCode.name}</DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            {loadingImage ? <Spinner /> : <img className={styles.img} src={src} alt={barCode.name} />}
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
  barCode: Miscellaneous.BarCode
}