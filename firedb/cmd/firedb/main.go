package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

const banner = `
╔═══════════════════════════════════════╗
║          FireDB v0.1.0                ║
║   A simple database implementation    ║
╚═══════════════════════════════════════╝

Type .exit to quit
`

func main() {
	fmt.Print(banner)

	scanner := bufio.NewScanner(os.Stdin)

	for {
		fmt.Print("firedb> ")

		if !scanner.Scan() {
			break
		}

		input := strings.TrimSpace(scanner.Text())

		if input == ".exit" {
			fmt.Println("Goodbye!")
			os.Exit(0)
		}

		if input == "" {
			continue
		}

		// TODO: Parse and execute commands
		fmt.Printf("Command not recognized: %s\n", input)
	}

	if err := scanner.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "Error reading input: %v\n", err)
		os.Exit(1)
	}

	os.Exit(0)
}
