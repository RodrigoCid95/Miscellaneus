package plugins

import (
	"context"

	"Miscellaneous/plugins/grpcs"

	"github.com/hashicorp/go-plugin"
	"google.golang.org/grpc"
)

type ProfilePlugin struct {
	Impl grpcs.ProfileServer
}

func (p ProfilePlugin) GRPCServer(broker *plugin.GRPCBroker, s *grpc.Server) error {
	grpcs.RegisterProfileServer(s, p.Impl)
	return nil
}

func (p ProfilePlugin) GRPCClient(ctx context.Context, broker *plugin.GRPCBroker, c *grpc.ClientConn) (interface{}, error) {
	return grpcs.NewProfileClient(c), nil
}
