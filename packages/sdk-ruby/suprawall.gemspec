# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "suprawall"
  spec.version       = "0.1.0"
  spec.authors        = ["SupraWall Contributors"]
  spec.email         = ["contact@supra-wall.com"]

  spec.summary       = "Ruby SDK for SupraWall. Policy enforcement for AI agents."
  spec.homepage      = "https://supra-wall.com"
  spec.license       = "Apache-2.0"
  spec.required_ruby_version = Gem::Requirement.new(">= 2.6.0")

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://github.com/wiserautomation/SupraWall"

  spec.files = Dir["lib/**/*.rb", "LICENSE", "README.md"]
  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{\Aexe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  spec.add_dependency "json", ">= 2.0"
end
