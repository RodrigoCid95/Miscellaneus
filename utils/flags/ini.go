package flags

import (
	"flag"
	"strings"
)

func FilterArgsFor(flg *flag.FlagSet, args []string) []string {
	var filteredArgs []string

	for i := 0; i < len(args); i++ {
		arg := args[i]

		if !strings.HasPrefix(arg, "-") {
			filteredArgs = append(filteredArgs, arg)
			continue
		}

		name := strings.TrimLeft(arg, "-")

		value := ""
		if parts := strings.SplitN(name, "=", 2); len(parts) == 2 {
			name = parts[0]
			value = parts[1]
		}

		f := flg.Lookup(name)
		if f == nil {
			continue
		}

		filteredArgs = append(filteredArgs, arg)

		isBool := f.Value.String() == "false" || f.Value.String() == "true"

		if value == "" && !isBool && i+1 < len(args) {
			nextArg := args[i+1]

			if !strings.HasPrefix(nextArg, "-") {
				filteredArgs = append(filteredArgs, nextArg)
				i++
			}
		}
	}

	return filteredArgs
}
