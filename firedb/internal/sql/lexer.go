package sql

// TokenType represents the type of a lexical token.
type TokenType int

const (
	// TokenEOF represents end of input.
	TokenEOF TokenType = iota
	// TokenIdentifier represents an identifier.
	TokenIdentifier
	// TokenKeyword represents a SQL keyword.
	TokenKeyword
	// TokenString represents a string literal.
	TokenString
	// TokenNumber represents a numeric literal.
	TokenNumber
	// TokenOperator represents an operator.
	TokenOperator
	// TokenPunctuation represents punctuation (commas, parentheses, etc).
	TokenPunctuation
)

// Token represents a single lexical token.
type Token struct {
	Type    TokenType
	Literal string
	Line    int
	Column  int
}

// Lexer tokenizes SQL input.
type Lexer struct {
	// TODO: Add fields for input, position, etc.
}

// NewLexer creates a new lexer for the given input.
func NewLexer(input string) *Lexer {
	// TODO: Implement lexer initialization
	return &Lexer{}
}

// NextToken returns the next token from the input.
func (l *Lexer) NextToken() Token {
	// TODO: Implement tokenization logic
	return Token{Type: TokenEOF}
}

// Peek returns the next token without consuming it.
func (l *Lexer) Peek() Token {
	// TODO: Implement lookahead
	return Token{Type: TokenEOF}
}
