package app

import (
	"Miscellaneous/core/utils"
	"os"
	"os/exec"
	"runtime"
)

type Server struct {
	cmd *exec.Cmd
}

func (sc *Server) getExecutablePath() string {
	if runtime.GOOS == "windows" {
		return ".\\server.exe"
	}
	return "./server"
}

func (sc *Server) IsEnabled() bool {
	exePath := sc.getExecutablePath()
	return utils.FileExists(exePath)
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

	sc.cmd = exec.Command(sc.getExecutablePath())
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
