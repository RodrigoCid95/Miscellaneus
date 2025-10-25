import { type FC, useState } from "react"
import { makeStyles, CheckboxOnChangeData, Dialog, DialogTrigger, Button, DialogSurface, DialogTitle, DialogBody, DialogContent, Checkbox, DialogActions, Spinner, tokens } from "@fluentui/react-components"
import { bundleIcon, Delete20Filled, Delete20Regular } from "@fluentui/react-icons"
import { useBarCodesContext } from "../../../context/barcodes"
import { DeleteBarCode as dBarCode } from "../../../../../../wailsjs/go/controllers/BarCodes"
import { models } from "../../../../../../wailsjs/go/models"

const DeleteIcon = bundleIcon(Delete20Filled, Delete20Regular)
const useStyles = makeStyles({
  content: {
    display: "flex",
    flexDirection: "column",
    rowGap: "10px",
  },
  dialog: {
    width: 'fit-content',
  },
  button: {
    backgroundColor: tokens.colorPaletteRedBackground3,
    color: tokens.colorNeutralForeground1,
    ":hover": {
      backgroundColor: tokens.colorPaletteRedBackground2,
    },
    ":active": {
      backgroundColor: tokens.colorPaletteRedBackground1,
    },
    ":hover:active": {
      backgroundColor: tokens.colorPaletteRedBackground1,
    },
    ":disabled": {
      backgroundColor: tokens.colorNeutralBackgroundDisabled,
      color: tokens.colorNeutralForegroundDisabled,
      cursor: "not-allowed",
    },
  },
  checkboxActive: {
    "--fui-Checkbox__indicator--borderColor": tokens.colorPaletteRedBorder2,
    "--fui-Checkbox__indicator--backgroundColor": tokens.colorPaletteRedBackground3,
    "--fui-Checkbox__indicator--color": tokens.colorNeutralForeground1,
    ":hover": {
      "--fui-Checkbox__indicator--borderColor": tokens.colorPaletteRedBorder1,
      "--fui-Checkbox__indicator--backgroundColor": tokens.colorPaletteRedBackground2,
    },
    ":active": {
      "--fui-Checkbox__indicator--borderColor": tokens.colorPaletteRedBorder1,
      "--fui-Checkbox__indicator--backgroundColor": tokens.colorPaletteRedBackground2,
    }
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: tokens.spacingHorizontalXXL
  },
})

const DeleteBarCode: FC<DeleteBarCodeProps> = ({ item }) => {
  const styles = useStyles()
  const { loadBarCodes } = useBarCodesContext()
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [checked, setChecked] = useState(false)

  const handleChange = (
    _: any,
    data: CheckboxOnChangeData
  ) => {
    setChecked(Boolean(data.checked))
  }

  const handleOnDelete = () => {
    setLoading(true)
    dBarCode(item.id)
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
          icon={<DeleteIcon />}
        />
      </DialogTrigger>
      <DialogSurface className={styles.dialog}>
        <DialogTitle>{loading ? "Borrando código de barras ..." : "Eliminar código de barras"}</DialogTitle>
        {loading && (
          <DialogBody className={styles.spinnerContainer}>
            <Spinner />
          </DialogBody>
        )}
        {!loading && (
          <DialogBody>
            <DialogContent className={styles.content}>
              <p>¿Estás seguro(a) que quieres eliminar el código de barras "{item.name}"?</p>
              <Checkbox
                className={checked ? styles.checkboxActive : undefined}
                checked={checked}
                onChange={handleChange}
                label="Si, estoy seguro"
              />
            </DialogContent>
            <DialogActions>
              <Button className={styles.button} disabled={!checked} appearance="primary" onClick={handleOnDelete}>Eliminar</Button>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancelar</Button>
              </DialogTrigger>
            </DialogActions>
          </DialogBody>
        )}
      </DialogSurface>
    </Dialog>
  )
}

export default DeleteBarCode

interface DeleteBarCodeProps {
  item: models.BarCode
}