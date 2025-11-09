package plugins

import (
	"Miscellaneous/plugins/grpcs"
	"context"

	"github.com/hashicorp/go-plugin"
	"google.golang.org/grpc"
)

type HistoryPlugin struct {
	plugin.Plugin
	Impl grpcs.HistoryServer
}

func (p *HistoryPlugin) GRPCServer(broker *plugin.GRPCBroker, s *grpc.Server) error {
	grpcs.RegisterHistoryServer(s, p.Impl)
	return nil
}

func (HistoryPlugin) GRPCClient(ctx context.Context, broker *plugin.GRPCBroker, c *grpc.ClientConn) (interface{}, error) {
	return grpcs.NewHistoryClient(c), nil
}
