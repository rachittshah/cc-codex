package storage

import (
	"encoding/binary"
	"errors"
	"unicode/utf8"
)

// Constants for fixed-size row layout
const (
	UsernameMax = 32  // Maximum bytes for Username field
	EmailMax    = 255 // Maximum bytes for Email field
	RowSize     = 8 + UsernameMax + EmailMax // Total row size: ID(8) + Username(32) + Email(255) = 295 bytes
)

// Row represents a fixed-size row with ID, Username, and Email fields
type Row struct {
	ID       uint64
	Username string
	Email    string
}

// Serialize writes the row into dst buffer in fixed-size format.
// Layout (little-endian): [8 bytes ID][32 bytes username][255 bytes email]
// Returns RowSize on success, error if dst is too small.
func (r Row) Serialize(dst []byte) (int, error) {
	if len(dst) < RowSize {
		return 0, errors.New("destination buffer too small")
	}

	// Write ID (8 bytes, little-endian)
	binary.LittleEndian.PutUint64(dst[0:8], r.ID)

	// Write Username (32 bytes, UTF-8 truncated, zero-padded)
	writeFixed(dst[8:8+UsernameMax], r.Username, UsernameMax)

	// Write Email (255 bytes, UTF-8 truncated, zero-padded)
	writeFixed(dst[8+UsernameMax:8+UsernameMax+EmailMax], r.Email, EmailMax)

	return RowSize, nil
}

// DeserializeRow reads a row from src buffer.
// Returns error if src is too small.
func DeserializeRow(src []byte) (Row, error) {
	if len(src) < RowSize {
		return Row{}, errors.New("source buffer too small")
	}

	var row Row

	// Read ID (8 bytes, little-endian)
	row.ID = binary.LittleEndian.Uint64(src[0:8])

	// Read Username (32 bytes, trim trailing zeros)
	row.Username = readFixed(src[8 : 8+UsernameMax])

	// Read Email (255 bytes, trim trailing zeros)
	row.Email = readFixed(src[8+UsernameMax : 8+UsernameMax+EmailMax])

	return row, nil
}

// truncateToBytes truncates string s to at most max bytes (not runes).
// Ensures the result is valid UTF-8 by not cutting in the middle of a rune.
func truncateToBytes(s string, max int) string {
	if len(s) <= max {
		return s
	}

	// Truncate to max bytes, but may cut in middle of multi-byte rune
	truncated := s[:max]

	// Walk backwards to find the last valid rune boundary
	for len(truncated) > 0 {
		if utf8.ValidString(truncated) {
			return truncated
		}
		// Remove last byte and try again
		truncated = truncated[:len(truncated)-1]
	}

	return ""
}

// writeFixed writes string s into buffer b (size bytes), truncating by bytes if needed
// and padding with zeros.
func writeFixed(b []byte, s string, size int) {
	// Truncate to size bytes if necessary
	truncated := truncateToBytes(s, size)

	// Copy string bytes
	copy(b, truncated)

	// Zero-pad the rest
	for i := len(truncated); i < size; i++ {
		b[i] = 0
	}
}

// readFixed reads a fixed-size string field from buffer b, trimming trailing zeros.
func readFixed(b []byte) string {
	// Find the first zero byte
	end := len(b)
	for i, c := range b {
		if c == 0 {
			end = i
			break
		}
	}

	return string(b[:end])
}
