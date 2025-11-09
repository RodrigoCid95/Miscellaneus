package driver

import (
	"Miscellaneous/models/structs"
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

func Start() {
	setup()
	loadConfig()
	runDriver()
	awaitSocket()
	connectToDriver()
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
		conn, err := winio.DialPipe(`\\.\pipe\miscellaneous`, nil)
		if err != nil {
			return false, nil
		}
		conn.Close()
		return true, nil
	}
	socketPath := "/tmp/miscellaneous.sock"
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
	driverProcess = exec.Command(coreConfig.Driver)
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
			return winio.DialPipe(`\\.\pipe\miscellaneous`, nil)
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
	addr := "unix:///tmp/miscellaneous.sock"
	conn, err := grpc.Dial(
		addr,
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

	driverPath := paths.ResolvePath(".", "drivers", serializeName(coreConfig.Driver))

	if !fs.FileExists(driverPath) {
		panic("El driver no es valido.")
	}
	coreConfig.Driver = driverPath
}

func serializeName(name string) string {
	if runtime.GOOS == "windows" {
		return name + ".exe"
	}
	return name
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
