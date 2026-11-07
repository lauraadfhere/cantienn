package dotenv

import (
	"os"
	"strings"
)

func Load(path string) error {
	raw, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	lines := strings.Split(string(raw), "\n")
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		line = strings.TrimPrefix(line, "export ")
		if strings.HasPrefix(strings.ToLower(line), "$env:") {
			line = line[5:]
		}
		line = strings.TrimSpace(line)
		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}
		key := strings.TrimSpace(parts[0])
		key = strings.TrimSpace(strings.TrimPrefix(strings.ToLower(key), "$env:"))
		key = strings.ToUpper(key)
		val := strings.TrimSpace(parts[1])
		val = strings.TrimSuffix(val, ";")
		val = strings.Trim(val, "\"'` \r")
		if key != "" {
			os.Setenv(key, val)
		}
	}
	return nil
}

