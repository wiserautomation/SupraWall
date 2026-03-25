using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace SUPRA-WALL.Models
{
    public class EvaluateRequest
    {
        public string AgentId { get; set; }
        public string ToolName { get; set; }
        public object Arguments { get; set; }
    }

    public class EvaluateResponse
    {
        public string Decision { get; set; }
        public string Reason { get; set; }
    }

    public class PolicyViolationException : Exception
    {
        public PolicyViolationException(string message) : base(message) { }
    }

    public class Client
    {
        private static readonly HttpClient httpClient = new HttpClient();
        private string apiKey;
        private string apiUrl;

        public Client(string key = null, string url = null)
        {
            apiKey = key ?? Environment.GetEnvironmentVariable("SUPRAWALL_API_KEY");
            apiUrl = url ?? Environment.GetEnvironmentVariable("suprawall_API_URL") ?? "https://api.suprawall.io/v1/evaluate";

            if (string.IsNullOrEmpty(apiKey)) throw new ArgumentException("SUPRAWALL_API_KEY is required");
        }

        public async Task<EvaluateResponse> EvaluateAsync(string agentId, string toolName, object arguments = null)
        {
            if (apiKey.StartsWith("ag_test_"))
            {
                return new EvaluateResponse { Decision = "ALLOW", Reason = "Test mode bypass" };
            }

            var requestModel = new EvaluateRequest
            {
                AgentId = agentId,
                ToolName = toolName,
                Arguments = arguments ?? new { }
            };

            var jsonPayload = JsonSerializer.Serialize(requestModel);
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            var request = new HttpRequestMessage(HttpMethod.Post, apiUrl)
            {
                Content = content
            };
            request.Headers.Add("Authorization", $"Bearer {apiKey}");

            var response = await httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                throw new HttpRequestException("SUPRA-WALL Network Error: Failing closed.");
            }

            var responseString = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<EvaluateResponse>(responseString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (result.Decision == "DENY")
            {
                throw new PolicyViolationException($"SUPRA-WALL Policy Violation: Tool '{toolName}' explicitly denied.");
            }
            else if (result.Decision == "REQUIRE_APPROVAL")
            {
                throw new PolicyViolationException($"SUPRA-WALL Policy Violation: Tool '{toolName}' requires human approval.");
            }

            return result;
        }
    }
}
