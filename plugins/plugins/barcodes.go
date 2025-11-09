package plugins

import (
	"Miscellaneous/plugins/grpcs"
	"context"

	"github.com/hashicorp/go-plugin"
	"google.golang.org/grpc"
)

type BarCodesPlugin struct {
	plugin.Plugin
	Impl grpcs.BarCodesServer
}

func (p *BarCodesPlugin) GRPCServer(broker *plugin.GRPCBroker, s *grpc.Server) error {
	grpcs.RegisterBarCodesServer(s, p.Impl)
	return nil
}

func (BarCodesPlugin) GRPCClient(ctx context.Context, broker *plugin.GRPCBroker, c *grpc.ClientConn) (interface{}, error) {
	return grpcs.NewBarCodesClient(c), nil
}
