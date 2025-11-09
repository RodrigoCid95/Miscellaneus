package plugins

import (
	"Miscellaneous/plugins/grpcs"
	"context"

	"github.com/hashicorp/go-plugin"
	"google.golang.org/grpc"
)

type CheckoutPlugin struct {
	plugin.Plugin
	Impl grpcs.CheckoutServer
}

func (p *CheckoutPlugin) GRPCServer(broker *plugin.GRPCBroker, s *grpc.Server) error {
	grpcs.RegisterCheckoutServer(s, p.Impl)
	return nil
}

func (CheckoutPlugin) GRPCClient(ctx context.Context, broker *plugin.GRPCBroker, c *grpc.ClientConn) (interface{}, error) {
	return grpcs.NewCheckoutClient(c), nil
}
