package plugins

import (
	"Miscellaneous/plugins/grpcs"
	"context"
	"fmt"
	"log"
	"net"
	"os"
	"runtime"
	"sync"

	"github.com/Microsoft/go-winio"
	"google.golang.org/grpc"
	"google.golang.org/grpc/stats"
)

type ServerOptions struct {
	BarCodesServer  grpcs.BarCodesServer
	CheckoutServer  grpcs.CheckoutServer
	HistoryServer   grpcs.HistoryServer
	ProductsServer  grpcs.ProductsServer
	ProfileServer   grpcs.ProfileServer
	ProvidersServer grpcs.ProvidersServer
	UsersServer     grpcs.UsersServer
	OnKill          func()
}

type connStatsHandler struct {
	mu        sync.Mutex
	connected int
	OnKill    func()
}

func (h *connStatsHandler) TagConn(ctx context.Context, info *stats.ConnTagInfo) context.Context {
	return ctx
}

func (h *connStatsHandler) HandleConn(ctx context.Context, s stats.ConnStats) {
	h.mu.Lock()
	defer h.mu.Unlock()

	switch s.(type) {
	case *stats.ConnBegin:
		h.connected++
		fmt.Printf("Cliente conectado. Total: %d\n", h.connected)
	case *stats.ConnEnd:
		h.connected--
		fmt.Printf("Cliente desconectado. Total: %d\n", h.connected)
		if h.connected == 0 {
			fmt.Println("No hay más conexiones, cerrando proceso...")
			h.OnKill()
		}
	}
}

func (h *connStatsHandler) TagRPC(ctx context.Context, info *stats.RPCTagInfo) context.Context {
	return ctx
}

func (h *connStatsHandler) HandleRPC(ctx context.Context, s stats.RPCStats) {}

func NewServer(opts *ServerOptions) {
	addr := getSocketAddress()
	lis, err := createListener(addr)
	if err != nil {
		log.Fatalf("No se pudo crear listener: %v", err)
		return
	}

	var s *grpc.Server = nil
	s = grpc.NewServer(grpc.StatsHandler(&connStatsHandler{
		OnKill: func() {
			opts.OnKill()
			os.Exit(0)
		},
	}))
	grpcs.RegisterBarCodesServer(s, opts.BarCodesServer)
	grpcs.RegisterCheckoutServer(s, opts.CheckoutServer)
	grpcs.RegisterHistoryServer(s, opts.HistoryServer)
	grpcs.RegisterProductsServer(s, opts.ProductsServer)
	grpcs.RegisterProfileServer(s, opts.ProfileServer)
	grpcs.RegisterProvidersServer(s, opts.ProvidersServer)
	grpcs.RegisterUsersServer(s, opts.UsersServer)

	if runtime.GOOS == "windows" {
		log.Printf("Servidor escuchando en Named Pipe: %s", addr)
	} else {
		log.Printf("Servidor escuchando en Unix Socket: %s", addr)
	}

	if err := s.Serve(lis); err != nil {
		log.Fatalf("Error al iniciar el servidor: %v", err)
	}
}

func createListener(addr string) (net.Listener, error) {
	if runtime.GOOS == "windows" {
		return winio.ListenPipe(addr, nil)
	}
	_ = os.Remove(addr)
	return net.Listen("unix", addr)
}

func getSocketAddress() string {
	if runtime.GOOS == "windows" {
		return `\\.\pipe\miscellaneous`
	}
	return "/tmp/miscellaneous.sock"
}
