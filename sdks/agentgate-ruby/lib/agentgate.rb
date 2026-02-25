require 'net/http'
require 'json'
require 'uri'

module AgentGate
  class Error < StandardError; end
  class PolicyViolationError < Error; end

  class << self
    attr_accessor :api_key
    attr_accessor :api_url

    def setup
      yield self
    end

    def evaluate!(agent_id:, tool_name:, arguments: {})
      api_key = self.api_key || ENV['AGENTGATE_API_KEY']
      api_url = self.api_url || ENV['AGENTGATE_API_URL'] || 'https://api.agentgate.io/v1/evaluate'

      raise Error, "AGENTGATE_API_KEY is required" unless api_key

      # Bypass completely if it's a test key
      return { decision: "ALLOW", reason: "Test mode" } if api_key.start_with?("ag_test_")

      uri = URI(api_url)
      req = Net::HTTP::Post.new(uri)
      req['Authorization'] = "Bearer #{api_key}"
      req['Content-Type'] = 'application/json'
      req.body = {
        agentId: agent_id,
        toolName: tool_name,
        arguments: arguments
      }.to_json

      res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https') do |http|
        http.request(req)
      end

      unless res.is_a?(Net::HTTPSuccess)
        raise Error, "AgentGate Network Error: Failing closed."
      end

      data = JSON.parse(res.body)
      
      if data['decision'] == 'DENY'
        raise PolicyViolationError, "AgentGate: Tool '#{tool_name}' explicitly denied."
      elsif data['decision'] == 'REQUIRE_APPROVAL'
        raise PolicyViolationError, "AgentGate: Tool '#{tool_name}' requires human approval."
      end

      data
    end
  end
end
