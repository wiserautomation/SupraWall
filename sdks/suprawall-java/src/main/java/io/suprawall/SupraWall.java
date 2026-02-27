package io.suprawall;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

public class SupraWall {
    private static String apiKey = System.getenv("SUPRAWALL_API_KEY");
    private static String apiUrl = System.getenv().getOrDefault("SUPRAWALL_API_URL", "https://api.suprawall.io/v1/evaluate");

    public static void setApiKey(String key) { apiKey = key; }
    public static void setApiUrl(String url) { apiUrl = url; }

    public static class PolicyViolationException extends Exception {
        public PolicyViolationException(String msg) { super(msg); }
    }

    public static String evaluate(String agentId, String toolName, String jsonArguments) throws PolicyViolationException, IOException, InterruptedException {
        if (apiKey == null) throw new IllegalArgumentException("SUPRAWALL_API_KEY is required");

        if (apiKey.startsWith("ag_test_")) {
            return "{\"decision\":\"ALLOW\",\"reason\":\"Test mode bypass\"}";
        }

        String jsonPayload = String.format("{\"agentId\":\"%s\",\"toolName\":\"%s\",\"arguments\":%s}", agentId, toolName, jsonArguments == null ? "{}" : jsonArguments);

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
           throw new IOException("SupraWall Network Error: Failing closed");
        }

        String body = response.body();
        if (body.contains("\"decision\":\"DENY\"")) {
            throw new PolicyViolationException("SupraWall Policy Violation: Tool '" + toolName + "' explicitly denied.");
        } else if (body.contains("\"decision\":\"REQUIRE_APPROVAL\"")) {
            throw new PolicyViolationException("SupraWall Policy Violation: Tool '" + toolName + "' requires human approval.");
        }

        return body;
    }
}
