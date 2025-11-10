package driver

import (
	"Miscellaneous/models/structs"
	"Miscellaneous/plugins/grpcs"
	"Miscellaneous/utils/config"
	"Miscellaneous/utils/fs"
	"Miscellaneous/utils/paths"
	"context"
	"fmt"
	"log"
	"net"
	"os"
	"os/exec"
	"runtime"
	"time"

	"github.com/Microsoft/go-winio"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var ConfigDriver *config.ConfigDriver

var coreConfig *structs.CoreConfigData
var driverProcess *exec.Cmd
var Connection *grpc.ClientConn
var driverPath string
var socketPath string

func Start() {
	setup()
	loadConfig()
	ok, _ := existsSocket()
	if ok {
		connectToDriver()
		infoClient := grpcs.NewInfoClient(Connection)
		req, err := infoClient.GetName(context.Background(), &grpcs.Empty{})
		if err != nil {
			panic(err)
		}
		name := req.GetName()
		if name != coreConfig.Driver {
			Kill()
			runDriver()
			awaitSocket()
			connectToDriver()
		}
	} else {
		runDriver()
		awaitSocket()
		connectToDriver()
	}
}

func awaitSocket() {
	timeout := time.After(time.Duration(coreConfig.Timeout) * time.Second)
	for {
		select {
		case <-timeout:
			fmt.Println("❌ Timeout: el socket no apareció a tiempo.")
			os.Exit(1)
		default:
			ok, err := existsSocket()
			if err != nil {
				fmt.Printf("Error verificando socket: %v\n", err)
			}
			if ok {
				fmt.Println("✅ Socket disponible, continuando ejecución...")
				return
			}
			fmt.Println("... todavía no disponible, reintentando en 0.5s ...")
			time.Sleep(500 * time.Millisecond)
		}
	}
}

func existsSocket() (bool, error) {
	if runtime.GOOS == "windows" {
		conn, err := winio.DialPipe(socketPath, nil)
		if err != nil {
			return false, nil
		}
		conn.Close()
		return true, nil
	}

	info, err := os.Stat(socketPath)
	if err != nil {
		if os.IsNotExist(err) {
			return false, nil
		}
		return false, err
	}
	if info.Mode()&os.ModeSocket == 0 {
		return false, fmt.Errorf("ruta existe pero no es un socket: %s", socketPath)
	}
	return true, nil
}

func runDriver() {
	ok, err := existsSocket()
	if err != nil {
		fmt.Printf("Error verificando socket: %v\n", err)
	}
	if ok {
		return
	}
	fmt.Println("Driver no encontrado, iniciando...")
	driverProcess = exec.Command(driverPath)
	driverProcess.Stdout = os.Stdout
	driverProcess.Stderr = os.Stderr
	driverProcess.Stdin = os.Stdin
	if err := driverProcess.Start(); err != nil {
		log.Fatalf("Error al iniciar el driver: %v", err)
	}
}

func connectToDriver() {
	if runtime.GOOS == "windows" {
		dialer := func(ctx context.Context, addr string) (net.Conn, error) {
			return winio.DialPipe(socketPath, nil)
		}
		conn, err := grpc.DialContext(
			context.Background(),
			"pipe",
			grpc.WithTransportCredentials(insecure.NewCredentials()),
			grpc.WithContextDialer(dialer),
		)
		if err != nil {
			panic(err)
		}
		Connection = conn
		return
	}

	conn, err := grpc.Dial(
		socketPath,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		panic(err)
	}
	Connection = conn
}

func loadConfig() {
	coreConfig = &structs.CoreConfigData{}
	ConfigDriver.GetData("Core", coreConfig)

	driverName := coreConfig.Driver
	socketPath = "/tmp/misc-sock-" + coreConfig.Driver + ".sock"
	if runtime.GOOS == "windows" {
		driverName = driverName + ".exe"
		socketPath = `\\.\pipe\misc-` + coreConfig.Driver
	}
	driverPath = paths.ResolvePath(".", "drivers", driverName)

	if !fs.FileExists(driverPath) {
		panic("El driver no es valido.")
	}
}

func setup() {
	systemConfigName := "System"
	codeConfigName := "Core"
	configPath := paths.ResolvePath("miscellaneous.conf")
	if !fs.FileExists(configPath) {
		fs.WriteFile(configPath, "")
	}
	ConfigDriver = &config.ConfigDriver{Path: configPath}

	if !ConfigDriver.HasSection(systemConfigName) {
		ConfigDriver.PutData(systemConfigName, &structs.ConfigData{
			Name:      "Mi Tienda",
			IpPrinter: "0.0.0.0",
		})
	}

	if !ConfigDriver.HasSection(codeConfigName) {
		ConfigDriver.PutData(codeConfigName, &structs.CoreConfigData{
			Driver:  "sqlite",
			Timeout: 5,
		})
	}
}

func Kill() {
	Connection.Close()
	driverProcess.Process.Kill()
}
