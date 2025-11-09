module Miscellaneous/core

go 1.24.5

require (
	Miscellaneous/models v0.0.0
	Miscellaneous/plugins v0.0.0
	Miscellaneous/utils v0.0.0
	github.com/Microsoft/go-winio v0.6.2
	google.golang.org/grpc v1.76.0
)

require (
	github.com/boombuler/barcode v1.1.0 // indirect
	github.com/davecgh/go-spew v1.1.1 // indirect
	github.com/pmezard/go-difflib v1.0.0 // indirect
	golang.org/x/image v0.32.0 // indirect
	golang.org/x/net v0.42.0 // indirect
	golang.org/x/sys v0.36.0 // indirect
	golang.org/x/text v0.30.0 // indirect
	google.golang.org/genproto/googleapis/rpc v0.0.0-20250804133106-a7a43d27e69b // indirect
	google.golang.org/protobuf v1.36.10 // indirect
	gopkg.in/ini.v1 v1.67.0 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
)

replace Miscellaneous/utils => ../utils

replace Miscellaneous/plugins => ../plugins

replace Miscellaneous/models => ../models
