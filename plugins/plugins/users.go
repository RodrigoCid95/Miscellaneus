package plugins

import (
	"Miscellaneous/plugins/grpcs"
	"context"

	"github.com/hashicorp/go-plugin"
	"google.golang.org/grpc"
)

type UsersPlugin struct {
	Impl grpcs.UsersServer
}

func (p *UsersPlugin) GRPCServer(broker *plugin.GRPCBroker, s *grpc.Server) error {
	grpcs.RegisterUsersServer(s, p.Impl)
	return nil
}

func (p *UsersPlugin) GRPCClient(ctx context.Context, broker *plugin.GRPCBroker, c *grpc.ClientConn) (interface{}, error) {
	return grpcs.NewUsersClient(c), nil
}
