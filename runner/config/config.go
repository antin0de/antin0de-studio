package config

import "os"

type Config struct {
	ApiEndpoint string
	ApiPassword string
	ToolsDir    string
}

func GetConfig() Config {
	return Config{
		ApiEndpoint: os.Getenv("ANTIN0DE_STUDIO_API_ENDPOINT"),
		ApiPassword: os.Getenv("ANTIN0DE_STUDIO_API_PASSWORD"),
		ToolsDir:    os.Getenv("ANTIN0DE_STUDIO_TOOLS_DIR"),
	}
}
