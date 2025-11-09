module Miscellaneous/plugins

go 1.24.5

require (
	github.com/Microsoft/go-winio v0.6.2
	github.com/hashicorp/go-plugin v1.7.0
	google.golang.org/grpc v1.76.0
	google.golang.org/protobuf v1.36.10
)

require github.com/stretchr/testify v1.11.1 // indirect

require (
	github.com/fatih/color v1.13.0 // indirect
	github.com/golang/protobuf v1.5.4 // indirect
	github.com/hashicorp/go-hclog v1.6.3 // indirect
	github.com/hashicorp/yamux v0.1.2 // indirect
	github.com/mattn/go-colorable v0.1.12 // indirect
	github.com/mattn/go-isatty v0.0.20 // indirect
	github.com/oklog/run v1.1.0 // indirect
	golang.org/x/net v0.42.0 // indirect
	golang.org/x/sys v0.36.0 // indirect
	golang.org/x/text v0.30.0 // indirect
	google.golang.org/genproto/googleapis/rpc v0.0.0-20250804133106-a7a43d27e69b // indirect
)

replace Miscellaneous/models => ../models
