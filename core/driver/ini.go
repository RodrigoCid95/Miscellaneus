package driver

import (
	"Miscellaneous/models/structs"
	"Miscellaneous/plugins/grpcs"
	"Miscellaneous/utils/assets"
	"Miscellaneous/utils/config"
	"Miscellaneous/utils/fs"
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

var coreConfig *structs.CoreConfigData
var driverProcess *exec.Cmd
var Connection *grpc.ClientConn
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
	driverProcess = exec.Command(coreConfig.DriverPath)
	driverProcess.Env = append(driverProcess.Env, "CONFIG_PATH="+config.ConfigController.Path)
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

type externalConfig struct {
	DriversPath string `flag:"drivers" env:"DRIVERS_PATH" usage:"Directorio en donde se encutran los drivers."`
	Driver      string `flag:"driver" env:"DRIVER" usage:"Nombre del driver."`
}

func loadConfig() {
	coreConfig = &structs.CoreConfigData{}
	config.ConfigController.GetData("Core", coreConfig)

	extermalConfig := externalConfig{}
	config.LoadExternalConfig(&extermalConfig)

	if extermalConfig.DriversPath != "" {
		coreConfig.DriversPath = fs.ResolvePath(extermalConfig.DriversPath)
	}

	if extermalConfig.Driver != "" {
		coreConfig.Driver = extermalConfig.Driver
	}

	if coreConfig.Driver == "" {
		panic("No se definio un driver.")
	}

	socketPath = "/tmp/misc-sock-" + coreConfig.Driver + ".sock"
	if runtime.GOOS == "windows" {
		socketPath = `\\.\pipe\misc-` + coreConfig.Driver
		coreConfig.Driver = coreConfig.Driver + ".exe"
	}

	drivers := assets.NewAssest(coreConfig.DriversPath)
	coreConfig.DriverPath = drivers.Resolve(coreConfig.Driver)
	fmt.Printf("Driver cargado: %s\n", coreConfig.Driver)
	fmt.Printf("Ruta de driver: %s\n", coreConfig.DriverPath)
	if !fs.FileExists(coreConfig.DriverPath) {
		panic("El driver no existe.")
	}
}

func setup() {
	systemConfigName := "System"
	coreConfigName := "Core"

	if !config.ConfigController.HasSection(systemConfigName) {
		config.ConfigController.PutData(
			systemConfigName,
			&structs.ConfigData{
				Name:      "Mi Tienda",
				IpPrinter: "0.0.0.0",
			},
		)
	}

	if !config.ConfigController.HasSection(coreConfigName) {
		config.ConfigController.PutData(
			coreConfigName,
			&structs.CoreConfigData{
				Driver:  "",
				Timeout: 5,
			},
		)
	}
}

func Kill() {
	Connection.Close()
	driverProcess.Process.Kill()
}
