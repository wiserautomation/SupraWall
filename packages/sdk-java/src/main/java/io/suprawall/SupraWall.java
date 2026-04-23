package io.suprawall;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class SupraWall {
    private static String apiKey = System.getenv("SUPRAWALL_API_KEY");
    private static String apiUrl = System.getenv().getOrDefault("SUPRAWALL_API_URL", "https://www.supra-wall.com/api/v1/evaluate");

    private static final Gson gson = new Gson();

    public static void setApiKey(String key) { apiKey = key; }
    public static void setApiUrl(String url) { apiUrl = url; }

    public static class PolicyViolationException extends Exception {
        public PolicyViolationException(String msg) { super(msg); }
    }

    public static class EvaluateResponse {
        public String decision;
        public String reason;
    }

    public static EvaluateResponse evaluate(String agentId, String toolName, String jsonArguments) throws PolicyViolationException, IOException, InterruptedException {
        if (apiKey == null) throw new IllegalArgumentException("SUPRAWALL_API_KEY is required");

        if (apiKey.startsWith("sw_test_")) {
            EvaluateResponse testResponse = new EvaluateResponse();
            testResponse.decision = "ALLOW";
            testResponse.reason = "Test mode bypass";
            return testResponse;
        }

        JsonObject payload = new JsonObject();
        payload.addProperty("agentId", agentId);
        payload.addProperty("toolName", toolName);
        if (jsonArguments != null) {
            payload.add("arguments", gson.fromJson(jsonArguments, JsonObject.class));
        } else {
            payload.add("arguments", new JsonObject());
        }

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(gson.toJson(payload)))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
           throw new IOException("SupraWall Network Error: Failing closed");
        }

        EvaluateResponse result = gson.fromJson(response.body(), EvaluateResponse.class);

        if ("DENY".equals(result.decision)) {
            throw new PolicyViolationException("SupraWall Policy Violation: Tool '" + toolName + "' explicitly denied.");
        } else if ("REQUIRE_APPROVAL".equals(result.decision)) {
            throw new PolicyViolationException("SupraWall Policy Violation: Tool '" + toolName + "' requires human approval.");
        }

        return result;
    }
}
