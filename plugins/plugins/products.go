package plugins

import (
	"context"

	"Miscellaneous/plugins/grpcs"

	"github.com/hashicorp/go-plugin"
	"google.golang.org/grpc"
)

type ProductsPlugin struct {
	plugin.Plugin
	Impl grpcs.ProductsServer
}

func (p *ProductsPlugin) GRPCServer(broker *plugin.GRPCBroker, s *grpc.Server) error {
	grpcs.RegisterProductsServer(s, p.Impl)
	return nil
}

func (p *ProductsPlugin) GRPCClient(ctx context.Context, broker *plugin.GRPCBroker, c *grpc.ClientConn) (interface{}, error) {
	return grpcs.NewProductsClient(c), nil
}
