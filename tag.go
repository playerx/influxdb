package influxdb

import (
	"encoding/json"
	"regexp"
	"strings"
)

// Operator is an Enum value of operators.
type Operator int

// Valid returns invalid error if the operator is invalid.
func (op Operator) Valid() error {
	if op < Equal || op > NotRegexEqual {
		return &Error{
			Code: EInvalid,
			Msg:  "Operator is invalid",
		}
	}
	return nil
}

// operators
const (
	Equal Operator = iota
	NotEqual
	RegexEqual
	NotRegexEqual
)

var opStr = []string{
	"equal",
	"notequal",
	"equalregex",
	"notequalregex",
}

var opStrMap = map[string]Operator{
	"equal":         Equal,
	"notequal":      NotEqual,
	"equalregex":    RegexEqual,
	"notequalregex": NotRegexEqual,
}

// String returns the string value of the operator.
func (op Operator) String() string {
	if err := op.Valid(); err != nil {
		return ""
	}
	return opStr[op]
}

// MarshalJSON implements json.Marshal interface.
func (op Operator) MarshalJSON() ([]byte, error) {
	return json.Marshal(op.String())
}

// UnmarshalJSON implements json.Unmarshaler interface.
func (op *Operator) UnmarshalJSON(b []byte) error {
	var s string
	if err := json.Unmarshal(b, &s); err != nil {
		return &Error{
			Code: EInvalid,
			Err:  err,
		}
	}
	var ok bool
	if *op, ok = opStrMap[s]; !ok {
		return &Error{
			Code: EInvalid,
			Msg:  "unrecognized operator",
		}
	}
	return nil
}

// Tag is a tag key-value pair.
type Tag struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

// NewTag generates a tag pair from a string in the format key:value.
func NewTag(s string) (Tag, error) {
	var tagPair Tag

	matched, err := regexp.MatchString(`^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+$`, s)
	if !matched || err != nil {
		return tagPair, &Error{
			Code: EInvalid,
			Msg:  `tag must be in form key:value`,
		}
	}

	slice := strings.Split(s, ":")
	tagPair.Key = slice[0]
	tagPair.Value = slice[1]

	return tagPair, nil
}

// Valid returns an error if the tagpair is missing fields
func (t Tag) Valid() error {
	if t.Key == "" || t.Value == "" {
		return &Error{
			Code: EInvalid,
			Msg:  "tag must contain a key and a value",
		}
	}
	return nil
}

// QueryParam converts a Tag to a string query parameter
func (t *Tag) QueryParam() string {
	return strings.Join([]string{t.Key, t.Value}, ":")
}

// TagRule is the struct of tag rule.
type TagRule struct {
	Tag
	Operator Operator `json:"operator"`
}

// Valid returns error for invalid operators.
func (tr TagRule) Valid() error {
	if err := tr.Tag.Valid(); err != nil {
		return err
	}

	return tr.Operator.Valid()
}
