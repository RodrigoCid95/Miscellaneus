package structs

type ConfigData struct {
	Name      string `ini:"name" json:"name"`
	IpPrinter string `ini:"ip printer" json:"ipPrinter"`
}

type CoreConfigData struct {
	DriverPath  string
	DriversPath string `ini:"drivers"`
	Driver      string `ini:"driver"`
	Timeout     int64  `ini:"timeout"`
}
