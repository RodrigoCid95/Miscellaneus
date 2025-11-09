package barcodes

import (
	"bytes"
	_ "embed"
	"encoding/base64"
	"image"
	"image/color"
	"image/draw"
	"image/png"

	"github.com/boombuler/barcode"
	"github.com/boombuler/barcode/code128"
	"golang.org/x/image/font"
	"golang.org/x/image/font/opentype"
	"golang.org/x/image/math/fixed"
)

//go:embed NotoSans-Regular.ttf
var fontBytes []byte

func GenerateDataURLBarcode(value string, tag string) string {
	if tag == "" {
		tag = value
	}

	width := 600
	height := 250
	barcodeImg, err := code128.Encode(value)
	if err != nil {
		panic(err)
	}
	scaledBC, err := barcode.Scale(barcodeImg, width, height)
	if err != nil {
		panic(err)
	}

	totalHeight := height + 80
	finalImg := image.NewRGBA(image.Rect(0, 0, width, totalHeight))
	draw.Draw(finalImg, finalImg.Bounds(), &image.Uniform{color.White}, image.Point{}, draw.Src)
	draw.Draw(finalImg, image.Rect(0, 0, width, height), scaledBC, image.Point{}, draw.Over)

	f, err := opentype.Parse(fontBytes)
	if err != nil {
		panic(err)
	}

	fontSize := 30.0
	var face font.Face

	for {
		face, err = opentype.NewFace(f, &opentype.FaceOptions{
			Size:    fontSize,
			DPI:     72,
			Hinting: font.HintingFull,
		})
		if err != nil {
			panic(err)
		}

		advance := font.MeasureString(face, tag)
		textWidth := advance.Round()

		if textWidth <= width-40 || fontSize <= 10 {
			break
		}

		fontSize -= 2
	}

	textWidth := font.MeasureString(face, tag).Round()
	x := (width - textWidth) / 2
	y := height + int(fontSize) + 10

	d := &font.Drawer{
		Dst:  finalImg,
		Src:  image.NewUniform(color.Black),
		Face: face,
		Dot:  fixed.P(x, y),
	}
	d.DrawString(tag)

	var buf bytes.Buffer
	if err := png.Encode(&buf, finalImg); err != nil {
		panic(err)
	}

	b64 := base64.StdEncoding.EncodeToString(buf.Bytes())
	dataURL := "data:image/png;base64," + b64
	return dataURL
}
