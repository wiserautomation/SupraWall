package suprawall

import (
	"testing"
)

func TestNew(t *testing.T) {
	options := SupraWallOptions{
		ApiKey: "ag_test_key",
	}
	sw := New(options)

	if sw.Options.ApiKey != "ag_test_key" {
		t.Errorf("Expected ApiKey ag_test_key, got %s", sw.Options.ApiKey)
	}

	if sw.Options.CloudFunctionUrl != "https://www.supra-wall.com/api/v1/evaluate" {
		t.Errorf("Expected default URL, got %s", sw.Options.CloudFunctionUrl)
	}
}
