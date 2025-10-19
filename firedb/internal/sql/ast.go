package sql

// Statement represents a SQL statement.
type Statement interface {
	// StatementNode is a marker method to identify statement nodes.
	StatementNode()
}

// Expression represents a SQL expression.
type Expression interface {
	// ExpressionNode is a marker method to identify expression nodes.
	ExpressionNode()
}

// SelectStatement represents a SELECT statement.
type SelectStatement struct {
	Columns []string
	From    string
	Where   Expression
	// TODO: Add fields for ORDER BY, LIMIT, etc.
}

func (s *SelectStatement) StatementNode() {}

// InsertStatement represents an INSERT statement.
type InsertStatement struct {
	Table   string
	Columns []string
	Values  []Expression
}

func (i *InsertStatement) StatementNode() {}

// UpdateStatement represents an UPDATE statement.
type UpdateStatement struct {
	Table string
	Set   map[string]Expression
	Where Expression
}

func (u *UpdateStatement) StatementNode() {}

// DeleteStatement represents a DELETE statement.
type DeleteStatement struct {
	Table string
	Where Expression
}

func (d *DeleteStatement) StatementNode() {}

// CreateTableStatement represents a CREATE TABLE statement.
type CreateTableStatement struct {
	Table   string
	Columns []ColumnDef
}

func (c *CreateTableStatement) StatementNode() {}

// ColumnDef represents a column definition in CREATE TABLE.
type ColumnDef struct {
	Name string
	Type string
	// TODO: Add constraints, default values, etc.
}

// BinaryExpression represents a binary operation (e.g., a = b).
type BinaryExpression struct {
	Left     Expression
	Operator string
	Right    Expression
}

func (b *BinaryExpression) ExpressionNode() {}

// Literal represents a literal value.
type Literal struct {
	Value interface{}
}

func (l *Literal) ExpressionNode() {}

// Identifier represents a column or table name.
type Identifier struct {
	Name string
}

func (i *Identifier) ExpressionNode() {}
