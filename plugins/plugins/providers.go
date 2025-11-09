package plugins

import (
	"Miscellaneous/plugins/grpcs"
	"context"

	"github.com/hashicorp/go-plugin"
	"google.golang.org/grpc"
)

type ProvidersPlugin struct {
	Impl grpcs.ProvidersServer
}

func (p *ProvidersPlugin) GRPCServer(broker *plugin.GRPCBroker, s *grpc.Server) error {
	grpcs.RegisterProvidersServer(s, p.Impl)
	return nil
}

func (p *ProvidersPlugin) GRPCClient(ctx context.Context, broker *plugin.GRPCBroker, c *grpc.ClientConn) (interface{}, error) {
	return grpcs.NewProvidersClient(c), nil
}
