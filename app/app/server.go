package app

import (
	"Miscellaneous/utils/fs"
	"Miscellaneous/utils/paths"
	"os"
	"os/exec"
	"runtime"
)

var serverExecPath string

func init() {
	nameExec := "server"
	if runtime.GOOS == "windows" {
		nameExec = "server.exe"
	}
	serverExecPath = paths.ResolvePath(nameExec)
}

type Server struct {
	cmd *exec.Cmd
}

func (sc *Server) IsEnabled() bool {
	return fs.FileExists(serverExecPath)
}

func (sc *Server) IsRunning() bool {
	if sc.cmd == nil || sc.cmd.Process == nil {
		return false
	}
	return sc.cmd.ProcessState == nil
}

func (sc *Server) Start() error {
	if sc.IsRunning() {
		return nil
	}

	sc.cmd = exec.Command(serverExecPath)
	sc.cmd.Stdout = os.Stdout
	sc.cmd.Stderr = os.Stderr

	return sc.cmd.Start()
}

func (sc *Server) Stop() error {
	if !sc.IsRunning() {
		return nil
	}

	err := sc.cmd.Process.Kill()
	if err != nil {
		return err
	}

	_, _ = sc.cmd.Process.Wait()
	sc.cmd = nil
	return nil
}
