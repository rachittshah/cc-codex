# FireDB

A simple relational database implementation in Go, built from scratch to understand database internals.

## Overview

FireDB is an educational database project that implements core database concepts including:

- **Storage Layer**: Page-based storage with a pager and page cache
- **Indexing**: B-tree data structure for efficient key-value lookups
- **SQL Support**: Lexer, parser, and AST for SQL query processing
- **Query Execution**: Executor for running SQL statements
- **REPL Interface**: Interactive command-line interface

## Architecture

```
firedb/
├── cmd/firedb/          # REPL entry point
├── internal/
│   ├── pager/           # Page management and caching
│   ├── btree/           # B-tree index implementation
│   ├── storage/         # Row storage and table layout
│   ├── sql/             # SQL lexer, parser, and AST
│   └── executor/        # Query execution engine
└── README.md
```

### Components

#### Pager (`internal/pager`)
- **pager.go**: Manages fixed-size pages for database files
- **page_cache.go**: In-memory cache for frequently accessed pages

#### B-Tree (`internal/btree`)
- **btree.go**: B-tree index operations (insert, find, delete)
- **node.go**: B-tree node structure and serialization
- **cursor.go**: Iterator for traversing the B-tree

#### Storage (`internal/storage`)
- **row.go**: Row serialization and deserialization
- **layout.go**: Table schema and column definitions

#### SQL (`internal/sql`)
- **lexer.go**: Tokenizes SQL input
- **parser.go**: Parses tokens into an AST
- **ast.go**: Abstract syntax tree definitions for SQL statements

#### Executor (`internal/executor`)
- **executor.go**: Executes SQL statements and returns results

## Requirements

- Go 1.22 or higher

## Building

Build the entire project:

```bash
go build ./...
```

Build the REPL binary:

```bash
go build -o firedb ./cmd/firedb
```

Or use `go install`:

```bash
go install ./cmd/firedb
```

## Running

Start the FireDB REPL:

```bash
./firedb
```

Or if installed via `go install`:

```bash
firedb
```

### REPL Commands

Once in the REPL, you can:

- Type SQL commands (not yet implemented)
- Type `.exit` to quit

Example session:

```
╔═══════════════════════════════════════╗
║          FireDB v0.1.0                ║
║   A simple database implementation    ║
╚═══════════════════════════════════════╝

Type .exit to quit

firedb> .exit
Goodbye!
```

## Development Status

This project is currently in the scaffolding phase. All components are stub implementations marked with `TODO` comments. Future development will include:

- [ ] Implement page management and caching
- [ ] Implement B-tree insertion, search, and deletion
- [ ] Implement row serialization with table layouts
- [ ] Implement SQL lexer and parser
- [ ] Implement query executor
- [ ] Add support for CREATE TABLE, INSERT, SELECT, UPDATE, DELETE
- [ ] Add transaction support
- [ ] Add write-ahead logging (WAL)
- [ ] Add comprehensive tests

## Testing

Run tests (once implemented):

```bash
go test ./...
```

Run tests with coverage:

```bash
go test -cover ./...
```

## Project Goals

1. **Educational**: Learn database internals by building from scratch
2. **Simple**: Keep the codebase readable and well-documented
3. **Functional**: Implement core features of a working database
4. **Extensible**: Design for future enhancements (transactions, replication, etc.)

## References

This project draws inspiration from:
- SQLite architecture
- PostgreSQL documentation
- "Database Internals" by Alex Petrov
- "Let's Build a Simple Database" tutorial

## License

This is an educational project. Use as you see fit.

## Contributing

This is a learning project, but suggestions and improvements are welcome!
