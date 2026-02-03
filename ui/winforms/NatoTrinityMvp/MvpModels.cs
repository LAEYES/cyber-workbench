using System.Text.Json.Serialization;

namespace NatoTrinityMvp;

public sealed record MvpRisk(
  [property: JsonPropertyName("riskId")] string RiskId,
  [property: JsonPropertyName("title")] string Title,
  [property: JsonPropertyName("owner")] string Owner,
  [property: JsonPropertyName("likelihood")] int Likelihood,
  [property: JsonPropertyName("impact")] int Impact,
  [property: JsonPropertyName("score")] int Score,
  [property: JsonPropertyName("status")] string Status,
  [property: JsonPropertyName("dueDate")] string DueDate,
  [property: JsonPropertyName("createdAt")] string CreatedAt = "",
  [property: JsonPropertyName("createdBy")] string CreatedBy = "",
  [property: JsonPropertyName("updatedAt")] string UpdatedAt = "",
  [property: JsonPropertyName("updatedBy")] string UpdatedBy = ""
);

public sealed record MvpDecision(
  [property: JsonPropertyName("decisionId")] string DecisionId,
  [property: JsonPropertyName("riskId")] string RiskId,
  [property: JsonPropertyName("decisionType")] string DecisionType,
  [property: JsonPropertyName("rationale")] string Rationale,
  [property: JsonPropertyName("approvedBy")] string ApprovedBy,
  [property: JsonPropertyName("approvedAt")] string ApprovedAt,
  [property: JsonPropertyName("expiryDate")] string? ExpiryDate,
  [property: JsonPropertyName("createdAt")] string CreatedAt = "",
  [property: JsonPropertyName("createdBy")] string CreatedBy = ""
);

public sealed record MvpCase(
  [property: JsonPropertyName("caseId")] string CaseId,
  [property: JsonPropertyName("riskId")] string RiskId = "",
  [property: JsonPropertyName("severity")] string Severity = "",
  [property: JsonPropertyName("status")] string Status = "",
  [property: JsonPropertyName("owner")] string Owner = "",
  [property: JsonPropertyName("createdAt")] string CreatedAt = "",
  [property: JsonPropertyName("createdBy")] string CreatedBy = "",
  [property: JsonPropertyName("updatedAt")] string UpdatedAt = "",
  [property: JsonPropertyName("updatedBy")] string UpdatedBy = ""
);

public sealed record MvpAuditEvent(
  [property: JsonPropertyName("eventId")] string EventId,
  [property: JsonPropertyName("orgId")] string OrgId,
  [property: JsonPropertyName("actor")] string Actor,
  [property: JsonPropertyName("actorType")] string ActorType,
  [property: JsonPropertyName("action")] string Action,
  [property: JsonPropertyName("objectRef")] string ObjectRef,
  [property: JsonPropertyName("timestamp")] string Timestamp,
  [property: JsonPropertyName("outcome")] string Outcome,
  [property: JsonPropertyName("requestId")] string RequestId
);
