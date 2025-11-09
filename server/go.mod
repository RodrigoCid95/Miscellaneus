module Miscellaneous/server

go 1.24.5

require (
	Miscellaneous/core v0.0.0
	Miscellaneous/models v0.0.0
	Miscellaneous/utils v0.0.0
	github.com/gorilla/sessions v1.4.0
	github.com/labstack/echo-contrib v0.17.4
	github.com/labstack/echo/v4 v4.13.4
	github.com/labstack/gommon v0.4.2
)

require (
	Miscellaneous/plugins v0.0.0 // indirect
	github.com/Microsoft/go-winio v0.6.2 // indirect
	github.com/boombuler/barcode v1.1.0 // indirect
	github.com/gorilla/context v1.1.2 // indirect
	github.com/gorilla/securecookie v1.1.2 // indirect
	github.com/mattn/go-colorable v0.1.14 // indirect
	github.com/mattn/go-isatty v0.0.20 // indirect
	github.com/valyala/bytebufferpool v1.0.0 // indirect
	github.com/valyala/fasttemplate v1.2.2 // indirect
	golang.org/x/crypto v0.40.0 // indirect
	golang.org/x/image v0.32.0 // indirect
	golang.org/x/net v0.42.0 // indirect
	golang.org/x/sys v0.36.0 // indirect
	golang.org/x/text v0.30.0 // indirect
	golang.org/x/time v0.11.0 // indirect
	google.golang.org/genproto/googleapis/rpc v0.0.0-20250804133106-a7a43d27e69b // indirect
	google.golang.org/grpc v1.76.0 // indirect
	google.golang.org/protobuf v1.36.10 // indirect
	gopkg.in/ini.v1 v1.67.0 // indirect
)

replace Miscellaneous/core => ../core

replace Miscellaneous/plugins => ../plugins

replace Miscellaneous/models => ../models

replace Miscellaneous/utils => ../utils
