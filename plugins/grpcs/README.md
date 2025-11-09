# Protos (gRPC / Protobuf)

Este módulo contiene los archivos `.proto` y los artefactos generados (`*.pb.go`, `*_grpc.pb.go`).

## Requisitos
- Go instalado (y `GOPATH` configurado).
- `protoc` instalado (versión 3+ / libprotoc 33.0 recomendado).
- Plugins de Go para `protoc`:
  - `protoc-gen-go`
  - `protoc-gen-go-grpc`

Instalación de plugins:

```powershell
# Instala los plugins en GOPATH/bin
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# Asegura que GOPATH/bin esté en PATH para la sesión actual
$env:PATH += ";$(go env GOPATH)\bin"
```

## Compilación
Ejecuta los siguientes comandos desde este directorio (`models/grpcs`):

```powershell
# Genera los archivos .pb.go y _grpc.pb.go a partir de todos los .proto
protoc --go_out=. --go_opt=paths=source_relative `
       --go-grpc_out=. --go-grpc_opt=paths=source_relative `
       *.proto
```

Notas:
- Los archivos `.proto` ya incluyen `go_package` para que `protoc-gen-go` resuelva correctamente el import path.
- Si cambias la ubicación o el módulo Go, ajusta el campo `go_package` en los `.proto` para que coincida con el nuevo import path.
